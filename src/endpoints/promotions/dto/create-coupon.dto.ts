import { IsNumber } from 'class-validator';

export class CreateCouponDto {

  @IsNumber()
  promotionId: number;

}
