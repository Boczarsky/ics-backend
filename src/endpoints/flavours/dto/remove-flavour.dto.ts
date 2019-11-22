import { IsNumber } from 'class-validator';

export class RemoveFlavourDto {

  @IsNumber()
  flavourId: number;

  @IsNumber()
  icecreamShopId: number;

}
