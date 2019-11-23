import { IsNumber, IsOptional, IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreatePostDto {

  @IsNumber()
  icecreamShopId: number;

  @IsOptional()
  @IsArray()
  @IsString({each: true})
  attachments: string[];

  @IsNotEmpty()
  content: string;

}
