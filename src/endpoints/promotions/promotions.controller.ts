import { Controller, UseGuards, Post, Request, Body, HttpException, HttpStatus, Get } from '@nestjs/common';
import { PromotionsService } from './promotions.service';
import { AuthGuard } from '@nestjs/passport';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UserType } from '../../enums/user-type.enum';
import { ErrorType } from '../../enums/error-type.enum';
import { RemovePromotionDto } from './dto/remove-promotion.dto';
import { CouponRewardDto } from './dto/coupon-reward.dto';
import { ListPromotionsDto } from './dto/list-promotions.dto';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { ReedemCouponDto } from './dto/redeem-coupon.dto';

@Controller('promotions')
export class PromotionsController {

  constructor(private readonly promotionsService: PromotionsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('create')
  async createPromotion(@Request() req, @Body() promotionData: CreatePromotionDto) {
    const { user_type, user_id } = req.user.userData;
    if (user_type !== UserType.manager) {
      throw new HttpException(ErrorType.accessDenied, HttpStatus.UNAUTHORIZED);
    }
    return await this.promotionsService.createPromotion(+user_id, promotionData);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('remove')
  async removePromotion(@Request() req, @Body() promotionData: RemovePromotionDto) {
    const { user_type, user_id } = req.user.userData;
    if (user_type !== UserType.manager) {
      throw new HttpException(ErrorType.accessDenied, HttpStatus.UNAUTHORIZED);
    }
    return await this.promotionsService.removePromotion(+user_id, promotionData);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('coupon/reward')
  async couponReward(@Request() req, @Body() couponData: CouponRewardDto) {
    const { user_type, user_id, manager_id } = req.user.userData;
    if (![UserType.manager, UserType.employee].includes(user_type)) {
      throw new HttpException(ErrorType.accessDenied, HttpStatus.UNAUTHORIZED);
    }
    const userId = user_type === UserType.manager ? +user_id : +manager_id;
    return await this.promotionsService.couponReward(userId, couponData);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('coupon/reedem')
  async couponRedeem(@Request() req, @Body() couponData: ReedemCouponDto) {
    const { user_type, user_id, manager_id } = req.user.userData;
    if (![UserType.manager, UserType.employee].includes(user_type)) {
      throw new HttpException(ErrorType.accessDenied, HttpStatus.UNAUTHORIZED);
    }
    const userId = user_type === UserType.manager ? +user_id : +manager_id;
    return await this.promotionsService.reedemCoupon(userId, couponData);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('coupon/create')
  async createCoupon(@Request() req, @Body() couponData: CreateCouponDto) {
    const { user_type, user_id } = req.user.userData;
    if (user_type !== UserType.client) {
      throw new HttpException(ErrorType.accessDenied, HttpStatus.UNAUTHORIZED);
    }
    return await this.promotionsService.createCoupon(+user_id, couponData);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('list')
  async listPromotions(@Request() req) {
    const { user_type, user_id } = req.user.userData;
    if (user_type !== UserType.manager) {
      throw new HttpException(ErrorType.accessDenied, HttpStatus.UNAUTHORIZED);
    }
    return await this.promotionsService.listPromotions(+user_id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('coupon/list')
  async listCoupons(@Request() req) {
    const { user_type, user_id } = req.user.userData;
    if (user_type !== UserType.client) {
      throw new HttpException(ErrorType.accessDenied, HttpStatus.UNAUTHORIZED);
    }
    return await this.promotionsService.listCoupons(+user_id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('view')
  async getPromotions(@Body() filters: ListPromotionsDto) {
    return await this.promotionsService.listPromotions(filters.managerId);
  }

}
