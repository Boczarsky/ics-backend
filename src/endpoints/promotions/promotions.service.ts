import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Connection } from 'typeorm';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { Promotion } from '../../entity/promotion.entity';
import { RemovePromotionDto } from './dto/remove-promotion.dto';
import { ErrorType } from '../../enums/error-type.enum';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { Coupon } from '../../entity/coupon.entity';
import { CouponRewardDto } from './dto/coupon-reward.dto';
import { ReedemCouponDto } from './dto/redeem-coupon.dto';

@Injectable()
export class PromotionsService {

  constructor(private readonly connection: Connection) {}

  async createPromotion(userId: number, promotionData: CreatePromotionDto) {
    const { info, limit, prize, startDate, endDate } = promotionData;
    const promotion = new Promotion();
    promotion.user_id = userId;
    promotion.info = info;
    promotion.limit = limit;
    promotion.prize = prize;
    promotion.start_date = startDate;
    promotion.end_date = endDate;
    const promotionRepository = this.connection.getRepository(Promotion);
    try {
      return await promotionRepository.manager.save(promotion);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async removePromotion(userId: number, promotionData: RemovePromotionDto) {
    const { promotionId } = promotionData;
    const promotionRepository = this.connection.getRepository(Promotion);
    const promotion = await promotionRepository.findOne({promotion_id: promotionId, user_id: userId});
    if (!promotion) {
      throw new HttpException(ErrorType.notFound, HttpStatus.NOT_FOUND);
    }
    try {
      return await promotionRepository.manager.remove(promotion);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async createCoupon(userId: number, promotionData: CreateCouponDto) {
    const { promotionId } = promotionData;
    const promotionRepository = this.connection.getRepository(Promotion);
    const promotion = await promotionRepository.findOne({promotion_id: promotionId});
    if (!promotion) {
      throw new HttpException(ErrorType.notFound, HttpStatus.NOT_FOUND);
    }
    const coupon = new Coupon();
    coupon.user_id = userId;
    coupon.promotion_id = promotionId;
    coupon.count = 0;
    const couponRepository = this.connection.getRepository(Coupon);
    try {
      return await couponRepository.manager.save(coupon);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async couponReward(managerId: number, couponData: CouponRewardDto) {
    const { couponId } = couponData;
    const couponRepository = this.connection.getRepository(Coupon);
    const coupon = await couponRepository.findOne({
      where: {
        coupon_id: couponId,
      },
      relations: ['promotion_shop', 'promotion_shop.promotion'],
    });
    if (!coupon) {
      throw new HttpException(ErrorType.notFound, HttpStatus.NOT_FOUND);
    }
    if (coupon.promotion_shop.promotion.user_id !== managerId) {
      throw new HttpException(ErrorType.accessDenied, HttpStatus.UNAUTHORIZED);
    }
    if (coupon.count < coupon.promotion_shop.promotion.limit) {
      coupon.count += 1;
      try {
        return await couponRepository.manager.save(coupon);
      } catch (error) {
        throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    } else {
      const newCoupon = new Coupon();
      newCoupon.count = 1;
      newCoupon.promotion_id = coupon.promotion_id;
      newCoupon.user_id = coupon.user_id;
      try {
        return await couponRepository.manager.save(newCoupon);
      } catch (error) {
        throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }

  async reedemCoupon(managerId: number, couponData: ReedemCouponDto) {
    const { couponId } = couponData;
    const couponRepository = this.connection.getRepository(Coupon);
    const coupon = await couponRepository.findOne({
      where: {
        coupon_id: couponId,
      },
      relations: ['promotion'],
    });
    if (!coupon) {
      throw new HttpException(ErrorType.notFound, HttpStatus.NOT_FOUND);
    }
    if (coupon.promotion_shop.promotion.user_id !== managerId) {
      throw new HttpException(ErrorType.accessDenied, HttpStatus.UNAUTHORIZED);
    }
    if (coupon.count === coupon.promotion_shop.promotion.limit) {
      try {
        return await couponRepository.manager.remove(coupon);
      } catch (error) {
        throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    } else {
      throw new HttpException(ErrorType.requirementsNotMet, HttpStatus.BAD_REQUEST);
    }
  }

  async listPromotions(managerId: number) {
    const promotionRepository = this.connection.getRepository(Promotion);
    return await promotionRepository.find({user_id: managerId});
  }

  async listCoupons(userId: number) {
    const couponRepository = this.connection.getRepository(Coupon);
    return await couponRepository.find({where: {user_id: userId}, relations: ['promotion']});
  }

}
