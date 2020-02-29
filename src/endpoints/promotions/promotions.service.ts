import { Employment } from './../../entity/employment.entity';
import { UserType } from './../../enums/user-type.enum';
import { IcecreamShop } from './../../entity/icecream-shop.entity';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Connection } from 'typeorm';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { Promotion } from '../../entity/promotion.entity';
import { RemovePromotionDto } from './dto/remove-promotion.dto';
import { ErrorType } from '../../enums/error-type.enum';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { Coupon } from '../../entity/coupon.entity';
import { CouponRewardDto } from './dto/coupon-reward.dto';
import { RedeemCouponDto } from './dto/redeem-coupon.dto';
import { AssignShopDto } from './dto/assign-shop.dto';
import { PromotionShop } from '../../entity/promotion_shop.entity';
import { ManagerPromotionList } from '../../entity/views/manager_promotion_list.entity';

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
    const promotionShopRepository = this.connection.getRepository(PromotionShop);
    const promotion = await promotionShopRepository.findOne({where: {promotion_shop_id: promotionId}, relations: ['promotion']});
    if (!promotion) {
      throw new HttpException(ErrorType.notFound, HttpStatus.NOT_FOUND);
    }
    const couponRepository = this.connection.getRepository(Coupon);
    let alreadyTaken;
    try {
      alreadyTaken = await couponRepository.find({where: {promotion_shop_id: promotionId}});
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    if (alreadyTaken && alreadyTaken.some(taken => taken.count !== promotion.promotion.limit)) {
      throw new HttpException(ErrorType.alreadyExist, HttpStatus.BAD_REQUEST);
    }
    const coupon = new Coupon();
    coupon.user_id = userId;
    coupon.promotion_shop_id = promotionId;
    coupon.count = 0;
    try {
      return await couponRepository.manager.save(coupon);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async couponReward(userId: number, userType: number, couponData: CouponRewardDto) {
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
    if (userType === UserType.manager && coupon.promotion_shop.promotion.user_id !== userId) {
      throw new HttpException(ErrorType.accessDenied, HttpStatus.UNAUTHORIZED);
    }
    if (userType === UserType.employee) {
      const employmentRepository = this.connection.getRepository(Employment);
      const employee = await employmentRepository.findOne({user_id: userId, icecream_shop_id: coupon.promotion_shop.icecream_shop_id});
      if (!employee) {
        throw new HttpException(ErrorType.accessDenied, HttpStatus.UNAUTHORIZED);
      }
    }
    if (coupon.count < coupon.promotion_shop.promotion.limit) {
      coupon.count += 1;
      try {
        return await couponRepository.manager.save(coupon);
      } catch (error) {
        throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    } else {
      throw new HttpException(ErrorType.requirementsNotMet, HttpStatus.BAD_REQUEST);
    }
  }

  async redeemCoupon(userId: number, userType: number, couponData: RedeemCouponDto) {
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
    if (userType === UserType.manager && coupon.promotion_shop.promotion.user_id !== userId) {
      throw new HttpException(ErrorType.accessDenied, HttpStatus.UNAUTHORIZED);
    }
    if (userType === UserType.employee) {
      const employmentRepository = this.connection.getRepository(Employment);
      const employee = await employmentRepository.findOne({user_id: userId, icecream_shop_id: coupon.promotion_shop.icecream_shop_id});
      if (!employee) {
        throw new HttpException(ErrorType.accessDenied, HttpStatus.UNAUTHORIZED);
      }
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
    const promotionRepository = this.connection.getRepository(ManagerPromotionList);
    return await promotionRepository.find({where: {user_id: managerId}});
  }

  async listCoupons(userId: number) {
    const couponRepository = this.connection.getRepository(Coupon);
    const result = await couponRepository.find({where: {user_id: userId}, relations: ['promotion_shop', 'promotion_shop.icecream_shop', 'promotion_shop.promotion']});
    return result.map(coupon => ({
      icecream_shop: {
        logo_file_name: coupon.promotion_shop.icecream_shop.logo_file_name,
        name: coupon.promotion_shop.icecream_shop.name,
        city: coupon.promotion_shop.icecream_shop.city,
        street: coupon.promotion_shop.icecream_shop.street,
        postal_code: coupon.promotion_shop.icecream_shop.postal_code,
      },
      coupon: {
        id: coupon.coupon_id,
        prize: coupon.promotion_shop.promotion.prize,
        info: coupon.promotion_shop.promotion.info,
        limit: coupon.promotion_shop.promotion.limit,
        count: coupon.count,
        start_date: coupon.promotion_shop.promotion.start_date,
        end_date: coupon.promotion_shop.promotion.end_date,
      },
    }));
  }

  async listShopsToAssign(userId: number) {
    const icecreamShopRepository = this.connection.getRepository(IcecreamShop);
    return await icecreamShopRepository.find({where: { owner_id: userId }, select: ['name', 'icecream_shop_id', 'street', 'city']});
  }

  async assignShop(data: AssignShopDto) {
    const promotionShopRepository = this.connection.getRepository(PromotionShop);
    const promotionShop = new PromotionShop();
    promotionShop.icecream_shop_id = data.icecreamShopId;
    promotionShop.promotion_id = data.promotionId;
    try {
      return await promotionShopRepository.manager.save(promotionShop);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async unassignShop(data: AssignShopDto) {
    const promotionShopRepository = this.connection.getRepository(PromotionShop);
    const assignedShop = await promotionShopRepository.findOne({icecream_shop_id: data.icecreamShopId, promotion_id: data.promotionId});
    if (!assignedShop) {
      throw new HttpException(ErrorType.notFound, HttpStatus.NOT_FOUND);
    }
    try {
      return await promotionShopRepository.manager.remove(assignedShop);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

}
