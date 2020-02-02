import { IsNumber, IsOptional, IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreatePostDto {

  @IsNumber()
  icecreamShopId: number;

  @IsOptional()
  @IsString({each: true})
  fileName: string;

  @IsNotEmpty()
  content: string;

}
