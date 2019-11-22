import { IsNumber } from 'class-validator';

export class RemoveOpinionDto {

  @IsNumber()
  icecreamShopId: number;

  @IsNumber()
  userId: number;

}
