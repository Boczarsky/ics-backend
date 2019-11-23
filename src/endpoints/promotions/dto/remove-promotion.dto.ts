import { IsNumber } from 'class-validator';

export class RemovePromotionDto {

  @IsNumber()
  promotionId: number;

}
