import { Controller, UseGuards, Post, Body, Request, HttpException, HttpStatus } from '@nestjs/common';
import { PostsService } from './posts.service';
import { AuthGuard } from '@nestjs/passport';
import { ListPostsDto } from './dto/list-posts.dto';
import { CreatePostDto } from './dto/create-post.dto';
import { UserType } from '../../enums/user-type.enum';
import { ErrorType } from '../../enums/error-type.enum';
import { EditPostDto } from './dto/edit-post.dto';
import { RemovePostDto } from './dto/remove-post.dto';
import { AddPostReactionDto } from './dto/add-post-reaction.dto';
import { RemovePostReactionDto } from './dto/remove-post-reaction.dto';

@Controller('posts')
export class PostsController {

  constructor(private readonly postsService: PostsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('list')
  async listPosts(@Body() filters: ListPostsDto) {
    return await this.postsService.listPosts(filters);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('create')
  async createPost(@Request() req, @Body() postData: CreatePostDto) {
    const { user_id, user_type } = req.user.userData;
    if (![UserType.employee, UserType.manager].includes(user_type)) {
      throw new HttpException(ErrorType.accessDenied, HttpStatus.UNAUTHORIZED);
    }
    return this.postsService.createPost(+user_id, user_type, postData);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('edit')
  async editPost(@Request() req, @Body() postData: EditPostDto) {
    const { user_id, user_type } = req.user.userData;
    if (![UserType.employee, UserType.manager].includes(user_type)) {
      throw new HttpException(ErrorType.accessDenied, HttpStatus.UNAUTHORIZED);
    }
    return this.postsService.editPost(+user_id, user_type, postData);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('remove')
  async removePost(@Request() req, @Body() postData: RemovePostDto) {
    const { user_id, user_type } = req.user.userData;
    if (![UserType.employee, UserType.manager].includes(user_type)) {
      throw new HttpException(ErrorType.accessDenied, HttpStatus.UNAUTHORIZED);
    }
    return this.postsService.removePost(+user_id, user_type, postData);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('addReaction')
  async addReaction(@Request() req, @Body() reactionData: AddPostReactionDto) {
    const { user_id, user_type } = req.user.userData;
    if (user_type !== UserType.client) {
      throw new HttpException(ErrorType.accessDenied, HttpStatus.UNAUTHORIZED);
    }
    return this.postsService.addReaction(+user_id, reactionData);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('removeReaction')
  async removeReaction(@Request() req, @Body() reactionData: RemovePostReactionDto) {
    const { user_id, user_type } = req.user.userData;
    if (user_type !== UserType.client) {
      throw new HttpException(ErrorType.accessDenied, HttpStatus.UNAUTHORIZED);
    }
    return this.postsService.removeReaction(+user_id, reactionData);
  }

}
