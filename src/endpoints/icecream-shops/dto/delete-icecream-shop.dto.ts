import { IsNumber } from 'class-validator';

export class DeleteIcecreamShopDto {

  @IsNumber()
  icecreamShopId: number;

}
