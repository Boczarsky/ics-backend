import { IsNumber } from 'class-validator';

export class ListOpinionsDto {

  @IsNumber()
  icecreamShopId: number;

  @IsNumber()
  offset: number;

  @IsNumber()
  limit: number;

}
