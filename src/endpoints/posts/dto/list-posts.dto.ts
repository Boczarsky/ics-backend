import { IsNumber, IsOptional, IsArray } from 'class-validator';

export class ListPostsDto {

  @IsOptional()
  @IsArray()
  @IsNumber({}, {each: true})
  icecreamShops: number[];

  @IsNumber()
  offset: number;

  @IsNumber()
  limit: number;

}
