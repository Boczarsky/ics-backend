import { IsNumber } from 'class-validator';

export class ReedemCouponDto {

  @IsNumber()
  couponId: number;

}
