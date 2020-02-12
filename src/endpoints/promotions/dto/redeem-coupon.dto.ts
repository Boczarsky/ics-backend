import { IsNumber } from 'class-validator';

export class RedeemCouponDto {

  @IsNumber()
  couponId: number;

}
