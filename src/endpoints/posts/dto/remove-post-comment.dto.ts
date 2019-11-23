import { IsNumber } from 'class-validator';

export class RemovePostCommentDto {

  @IsNumber()
  postId: number;

  @IsNumber()
  commentId: number;

}
