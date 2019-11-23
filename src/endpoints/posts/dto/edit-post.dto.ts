import { IsNumber, IsOptional, IsNotEmpty, IsArray } from 'class-validator';

export class EditPostDto {

  @IsNumber()
  postId: number;

  @IsOptional()
  @IsNotEmpty()
  content: string;

  @IsOptional()
  @IsArray()
  @IsNumber({}, {each: true})
  attachmentsToDelete: number[];

  @IsOptional()
  @IsArray()
  @IsNumber({}, {each: true})
  attachments: string[];

}
