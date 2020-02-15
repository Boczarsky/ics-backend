import { IsNumber } from 'class-validator';

export class NewsFeedDto {

  @IsNumber()
  offset: number;

  @IsNumber()
  limit: number;

}
