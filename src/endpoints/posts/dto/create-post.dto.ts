import { IsNumber, IsOptional, IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreatePostDto {

  @IsNumber()
  icecreamShopId: number;

  @IsOptional()
  @IsString()
  fileName: string;

  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  content: string;

}
