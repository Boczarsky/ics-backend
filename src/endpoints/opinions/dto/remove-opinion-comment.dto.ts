import { IsNumber } from 'class-validator';

export class RemoveOpinionCommentDto {

  @IsNumber()
  commentId: number;

  @IsNumber()
  opinionId: number;

}
