import { IsNumber, IsNotEmpty } from 'class-validator';

export class AddOpinionCommentDto {

  @IsNumber()
  opinionId: number;

  @IsNotEmpty()
  content: number;

}
