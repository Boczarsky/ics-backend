import { IsNumber } from 'class-validator';

export class ToggleFavoriteDto {

  @IsNumber()
  icecreamShopId: number;

}
