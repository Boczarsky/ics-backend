import { IsNumber, IsOptional, IsNotEmpty, IsString } from 'class-validator';

export class EditPostDto {

  @IsNumber()
  postId: number;

  @IsOptional()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsNotEmpty()
  content: string;

  @IsOptional()
  @IsString()
  fileName: string;

}
