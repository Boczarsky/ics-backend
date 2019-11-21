import { IsNumber } from 'class-validator';

export class ListFavoriteIcecreamShopDto {

  @IsNumber()
  limit: number;

  @IsNumber()
  offset: number;

}
