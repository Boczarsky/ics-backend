import { IsNumber, IsNotEmpty, IsOptional } from 'class-validator';

export class AddOpinionCommentDto {

  @IsNumber()
  opinionId: number;

  @IsNotEmpty()
  content: string;

}
