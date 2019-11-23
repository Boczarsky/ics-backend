import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Connection, In } from 'typeorm';
import { UserType } from '../../enums/user-type.enum';
import { CreatePostDto } from './dto/create-post.dto';
import { IcecreamShop } from '../../entity/icecream-shop.entity';
import { ErrorType } from '../../enums/error-type.enum';
import { Employment } from '../../entity/employment.entity';
import { Post } from '../../entity/post.entity';
import { PostAttachment } from '../../entity/post_attachment.entity';
import { EditPostDto } from './dto/edit-post.dto';
import { RemovePostDto } from './dto/remove-post.dto';
import { AddPostCommentDto } from './dto/add-post-comment.dto';
import { PostComment } from '../../entity/post_comment.entity';
import { RemovePostCommentDto } from './dto/remove-post-comment.dto';
import { AddPostReactionDto } from './dto/add-post-reaction';
import { PostReaction } from '../../entity/post_reaction.entity';
import { RemovePostReactionDto } from './dto/remove-post-reaction.dto';
import { ListPostsDto } from './dto/list-posts.dto';
import { totalmem } from 'os';

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
    const { icecreamShopId, content, attachments } = postData;
    this.checkPermissions(userId, userType, icecreamShopId);
    const newPost = new Post();
    newPost.content = content;
    newPost.icecream_shop_id = icecreamShopId;
    newPost.created_at = new Date().toISOString();
    const postRepository = this.connection.getRepository(Post);
    let createdPost: Post;
    try {
      createdPost = await postRepository.manager.save(newPost);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    if (createdPost && attachments) {
      const postAttachmentRepository = this.connection.getRepository(PostAttachment);
      const files = attachments.map(fileName => {
        const attachment = new PostAttachment();
        attachment.file_name = fileName;
        attachment.post_id = createdPost.post_id;
        return attachment;
      });
      try {
        createdPost.attachments = await postAttachmentRepository.manager.save(files);
      } catch (error) {
        createdPost.attachments = [];
      }
    }
    return createdPost;
  }

  async editPost(userId: number, userType: UserType, postData: EditPostDto) {
    const { postId, content, attachments, attachmentsToDelete } = postData;
    const postRepository = this.connection.getRepository(Post);
    const post = await postRepository.findOne({post_id: postId});
    if (!post) {
      throw new HttpException(ErrorType.notFound, HttpStatus.NOT_FOUND);
    }
    this.checkPermissions(userId, userType, post.icecream_shop_id);
    if (content) {
      post.content = content;
    }
    let editedPost;
    try {
      editedPost = await postRepository.manager.save(post);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    const postAttachmentRepository = this.connection.getRepository(PostAttachment);
    if (attachmentsToDelete) {
      const currentAttachments = await postAttachmentRepository.find({post_attachment_id: In(attachmentsToDelete)});
      try {
        editedPost.attachments = await postAttachmentRepository.manager.remove(currentAttachments);
      } catch (error) {
        editedPost.attachments = [...editedPost.attachments];
      }
    }
    if (attachments) {
      const newAttachments = attachments.map(fileName => {
        const attachment = new PostAttachment();
        attachment.file_name = fileName;
        attachment.post_id = postId;
        return attachment;
      });
      try {
        editedPost.attachments = await postAttachmentRepository.manager.save(newAttachments);
      } catch (error) {
        editedPost.attachments = [...editedPost.attachments];
      }
    }
    return editedPost;
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

  async addPostComment(userId: number, userType: UserType, commentData: AddPostCommentDto) {
    const { postId, content } = commentData;
    const postRepository = this.connection.getRepository(Post);
    const post = await postRepository.findOne({post_id: postId});
    if (!post) {
      throw new HttpException(ErrorType.notFound, HttpStatus.NOT_FOUND);
    }
    if ([UserType.manager, UserType.employee].includes(userType)) {
      this.checkPermissions(userId, userType, post.icecream_shop_id);
    }
    const comment = new PostComment();
    comment.content = content;
    comment.user_id = userId;
    comment.post_id = postId;
    comment.created_at = new Date().toISOString();
    if ([UserType.manager, UserType.employee].includes(userType)) {
      comment.icecream_shop_id = post.icecream_shop_id;
    }
    const opinionCommentRepository = this.connection.getRepository(PostComment);
    try {
      return await opinionCommentRepository.manager.save(comment);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async removePostComment(userId: number, userType: UserType, commentData: RemovePostCommentDto) {
    const { postId, commentId } = commentData;
    const postRepository = this.connection.getRepository(Post);
    const post = await postRepository.findOne({post_id: postId});
    const postCommentRepository = this.connection.getRepository(PostComment);
    const comment = await postCommentRepository.findOne({post_comment_id: commentId});
    if (!post || !comment) {
      throw new HttpException(ErrorType.notFound, HttpStatus.NOT_FOUND);
    }
    if ([UserType.employee, UserType.manager].includes(userType)) {
      this.checkPermissions(userId, userType, post.icecream_shop_id);
    }
    if (userType === UserType.client && comment.user_id !== userId) {
      throw new HttpException(ErrorType.accessDenied, HttpStatus.UNAUTHORIZED);
    }
    try {
      return await postCommentRepository.manager.remove(comment);
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
      "post_id",
      "name",
      "content",
      "created_at",
      "logo_file_name",
      json_agg(
        CASE WHEN "comment_to" IS null THEN null
        ELSE json_build_object(
          'id', "post_comment_id",
          'author', "comment_author",
          'content', "comment_content",
          'post_id', "comment_to"
        ) END
      ) as comments,
      json_agg(
        CASE WHEN "reaction_to" IS null THEN null
        ELSE json_build_object(
            'author', "reaction_author",
            'reaction_type', "reaction_type",
            'post_id', "reaction_to"
          ) END
      ) as reactions,
      json_agg("file_name") as files
    FROM "list_post" ${whereString}
    GROUP BY
      post_id,
      name,
      content,
      created_at,
      logo_file_name
    LIMIT ${limit}
    OFFSET ${offset}
    `;
    const response = await this.connection.query(query);
    return response.reduce((prev, curr) => {
      const { total, ...rest } = curr;
      if (prev.total !== total) {
        prev.total = total;
      }
      rest.comments = curr.comments.filter(Boolean);
      rest.reactions = curr.reactions.filter(Boolean);
      rest.files = curr.files.filter(Boolean);
      prev.result.push(rest);
      return prev;
    }, {result: [], total: 0});
  }

}
