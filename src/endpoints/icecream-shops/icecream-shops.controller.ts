import { Controller, Post, Body, Get, UseGuards, Request, HttpException, HttpStatus, Param, Delete } from '@nestjs/common';
import { IcecreamShopsService } from './icecream-shops.service';
import { CreateIcecreamShopDto } from './dto/create-icecream-shop.dto';
import { AuthGuard } from '@nestjs/passport';
import { UserType } from '../../enums/user-type.enum';
import { ErrorType } from '../../enums/error-type.enum';

@Controller('icecream-shops')
export class IcecreamShopsController {

  constructor(private readonly icecreamShopsService: IcecreamShopsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async getIcecreamShop(@Request() req, @Param('id') id: string) {
    const { user_id, user_type } = req.user.userData;
    return await this.icecreamShopsService.getIcecreamShop(+id, user_id, user_type);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async createIcecreamShop(@Body() icecreamShop: CreateIcecreamShopDto, @Request() req) {
    const { user_id, user_type } = req.user.userData;
    if (![UserType.admin, UserType.manager].includes(user_type)) {
      throw new HttpException(ErrorType.accessDenied, HttpStatus.UNAUTHORIZED);
    }
    return await this.icecreamShopsService.createIcecreamShop(user_id, user_type, icecreamShop);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('manager/my')
  async getMyIcecreamShops(@Request() req) {
    const { user_id, user_type } = req.user.userData;
    if (UserType.manager !== user_type) {
      throw new HttpException(ErrorType.accessDenied, HttpStatus.UNAUTHORIZED);
    }
    return await this.icecreamShopsService.getMyIcecreamShops(user_id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':id/favorite')
  async addToFavorites(@Request() req, @Param('id') id: string) {
    const { user_type, user_id } = req.user.userData;
    if (UserType.client !== user_type) {
      throw new HttpException(ErrorType.accessDenied, HttpStatus.UNAUTHORIZED);
    }
    return await this.icecreamShopsService.addToFavorites(user_id, +id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id/favorite')
  async removeFromFavorites(@Request() req, @Param('id') id: string) {
    const { user_type, user_id } = req.user.userData;
    if (UserType.client !== user_type) {
      throw new HttpException(ErrorType.accessDenied, HttpStatus.UNAUTHORIZED);
    }
    return await this.icecreamShopsService.removeFromFavorites(user_id, +id);
  }

}
