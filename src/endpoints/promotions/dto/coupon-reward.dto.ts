import { IsNumber } from 'class-validator';

export class CouponRewardDto {

  @IsNumber()
  couponId: number;

}
