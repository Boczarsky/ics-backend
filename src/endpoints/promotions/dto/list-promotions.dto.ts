import { IsNumber } from 'class-validator';

export class ListPromotionsDto {

  @IsNumber()
  icecreamShopId: number;

}
