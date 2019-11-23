import { IsNumber, IsNotEmpty } from 'class-validator';

export class AddPostCommentDto {

  @IsNumber()
  postId: number;

  @IsNotEmpty()
  content: string;

}
