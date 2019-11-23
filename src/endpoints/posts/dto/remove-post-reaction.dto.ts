import { IsNumber, IsEnum } from 'class-validator';

export class RemovePostReactionDto {

  @IsNumber()
  postId: number;

}
