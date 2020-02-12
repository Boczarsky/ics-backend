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
import { RedeemCouponDto } from './dto/redeem-coupon.dto';
import { AssignShopDto } from './dto/assign-shop.dto';

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
    const { user_type, user_id } = req.user.userData;
    if (![UserType.manager, UserType.employee].includes(user_type)) {
      throw new HttpException(ErrorType.accessDenied, HttpStatus.UNAUTHORIZED);
    }
    return await this.promotionsService.couponReward(+user_id, +user_type, couponData);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('coupon/redeem')
  async couponRedeem(@Request() req, @Body() couponData: RedeemCouponDto) {
    const { user_type, user_id } = req.user.userData;
    if (![UserType.manager, UserType.employee].includes(user_type)) {
      throw new HttpException(ErrorType.accessDenied, HttpStatus.UNAUTHORIZED);
    }
    return await this.promotionsService.redeemCoupon(+user_id, +user_type, couponData);
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
  @Get('shopsToAssign')
  async listShopsToAssign(@Request() req) {
    const { user_type, user_id } = req.user.userData;
    if (user_type !== UserType.manager) {
      throw new HttpException(ErrorType.accessDenied, HttpStatus.UNAUTHORIZED);
    }
    return await this.promotionsService.listShopsToAssign(+user_id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('assignShop')
  async assignShop(@Request() req, @Body() assignShopData: AssignShopDto) {
    const { user_type } = req.user.userData;
    if (user_type !== UserType.manager) {
      throw new HttpException(ErrorType.accessDenied, HttpStatus.UNAUTHORIZED);
    }
    return await this.promotionsService.assignShop(assignShopData);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('unassignShop')
  async unassignShop(@Request() req, @Body() unassignShopData: AssignShopDto) {
    const { user_type } = req.user.userData;
    if (user_type !== UserType.manager) {
      throw new HttpException(ErrorType.accessDenied, HttpStatus.UNAUTHORIZED);
    }
    return await this.promotionsService.unassignShop(unassignShopData);
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
    return await this.promotionsService.listPromotions(filters.icecreamShopId);
  }

}
