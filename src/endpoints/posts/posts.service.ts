import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Connection, In } from 'typeorm';
import { UserType } from '../../enums/user-type.enum';
import { CreatePostDto } from './dto/create-post.dto';
import { IcecreamShop } from '../../entity/icecream-shop.entity';
import { ErrorType } from '../../enums/error-type.enum';
import { Employment } from '../../entity/employment.entity';
import { Post } from '../../entity/post.entity';
import { EditPostDto } from './dto/edit-post.dto';
import { RemovePostDto } from './dto/remove-post.dto';
import { AddPostReactionDto } from './dto/add-post-reaction.dto';
import { PostReaction } from '../../entity/post_reaction.entity';
import { RemovePostReactionDto } from './dto/remove-post-reaction.dto';
import { ListPostsDto } from './dto/list-posts.dto';

@Injectable()
export class PostsService {

  constructor(private readonly connection: Connection) {}

  async checkPermissions(userId: number, userType: UserType, icecreamShopId: number) {
    if (userType === UserType.manager) {
      const icecreamShopRepository = this.connection.getRepository(IcecreamShop);
      const ownedIcecreamShop = await icecreamShopRepository.findOne({icecream_shop_id: icecreamShopId, owner_id: userId});
      if (!ownedIcecreamShop) {
        throw new HttpException(ErrorType.accessDenied, HttpStatus.UNAUTHORIZED);
      }
    }
    if (userType === UserType.employee) {
      const employmentRepository = this.connection.getRepository(Employment);
      const employment = await employmentRepository.findOne({user_id: userId, icecream_shop_id: icecreamShopId});
      if (!employment) {
        throw new HttpException(ErrorType.accessDenied, HttpStatus.UNAUTHORIZED);
      }
    }
  }

  async createPost(userId: number, userType: UserType, postData: CreatePostDto) {
    const { icecreamShopId, content, fileName, title } = postData;
    this.checkPermissions(userId, userType, icecreamShopId);
    const newPost = new Post();
    newPost.title = title;
    newPost.content = content;
    newPost.icecream_shop_id = icecreamShopId;
    if (fileName) {
      newPost.file_name = fileName;
    }
    newPost.created_at = new Date().toISOString();
    const postRepository = this.connection.getRepository(Post);
    try {
      return await postRepository.manager.save(newPost);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async editPost(userId: number, userType: UserType, postData: EditPostDto) {
    const { postId, content, fileName } = postData;
    const postRepository = this.connection.getRepository(Post);
    const post = await postRepository.findOne({post_id: postId});
    if (!post) {
      throw new HttpException(ErrorType.notFound, HttpStatus.NOT_FOUND);
    }
    this.checkPermissions(userId, userType, post.icecream_shop_id);
    post.file_name = fileName;
    if (content) {
      post.content = content;
    }
    try {
      return await postRepository.manager.save(post);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async removePost(userId: number, userType: UserType, postData: RemovePostDto) {
    const { postId } = postData;
    const postRepository = this.connection.getRepository(Post);
    const post = await postRepository.findOne({post_id: postId});
    if (!post) {
      throw new HttpException(ErrorType.notFound, HttpStatus.NOT_FOUND);
    }
    const icecreamShopId = post.icecream_shop_id;
    this.checkPermissions(userId, userType, icecreamShopId);
    try {
      return await postRepository.remove(post);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async addReaction(userId: number, reactionData: AddPostReactionDto) {
    const postReactionRepository = this.connection.getRepository(PostReaction);
    const reaction = new PostReaction();
    reaction.post_id = reactionData.postId;
    reaction.reaction_type = reactionData.reactionType;
    reaction.user_id = userId;
    try {
      return await postReactionRepository.manager.save(reaction);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async removeReaction(userId: number, reactionData: RemovePostReactionDto) {
    const postReactionRepository = this.connection.getRepository(PostReaction);
    const reaction = await postReactionRepository.findOne({user_id: userId, post_id: reactionData.postId});
    try {
      return await postReactionRepository.manager.remove(reaction);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async listPosts(filters: ListPostsDto) {
    const { icecreamShops, offset, limit } = filters;
    const where = [];
    if (icecreamShops) {
      where.push(`"icecream_shop_id" IN (${icecreamShops.join(',')})`);
    }
    const whereString = where.length ? `WHERE ${where.join(' AND ')}` : '';
    const query = `
    WITH count_post AS (SELECT DISTINCT "post_id", "name", "created_at", "logo_file_name" FROM "list_post" ${whereString})
    SELECT
      (SELECT count(*) FROM count_post) as "total",
      "icecream_shop_id",
      "post_id",
      "name",
      "content",
      "created_at",
      "logo_file_name",
      json_agg(
        CASE WHEN "reaction_to" IS null THEN null
        ELSE json_build_object(
            'author', "reaction_author",
            'reaction_type', "reaction_type",
            'post_id', "reaction_to"
          ) END
      ) as reactions,
      title,
      file_name
    FROM "list_post" ${whereString}
    GROUP BY
      post_id,
      name,
      content,
      created_at,
      logo_file_name,
      file_name,
      title,
      icecream_shop_id
    LIMIT ${limit}
    OFFSET ${offset}
    `;
    const response = await this.connection.query(query);
    return response.reduce((prev, curr) => {
      const { total, ...rest } = curr;
      if (prev.total !== total) {
        prev.total = total;
      }
      rest.reactions = curr.reactions.filter(Boolean);
      prev.result.push(rest);
      return prev;
    }, {result: [], total: 0});
  }

}
