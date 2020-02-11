import { IsNumber } from 'class-validator';

export class AssignShopDto {

  @IsNumber()
  promotionId: number;

  @IsNumber()
  icecreamShopId: number;

}
