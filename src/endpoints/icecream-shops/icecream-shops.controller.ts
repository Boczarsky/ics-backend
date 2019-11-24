import { Controller, Post, Body, Get, UseGuards, Request, HttpException, HttpStatus, Param, Delete } from '@nestjs/common';
import { IcecreamShopsService } from './icecream-shops.service';
import { CreateIcecreamShopDto } from './dto/create-icecream-shop.dto';
import { AuthGuard } from '@nestjs/passport';
import { UserType } from '../../enums/user-type.enum';
import { ErrorType } from '../../enums/error-type.enum';
import { ListIcecreamShopsDto } from './dto/list-icecream-shops.dto';
import { EditIcecreamShopDto } from './dto/edit-icecream-shop.dto';
import { ListFavoriteIcecreamShopDto } from './dto/list-favorite-icecream-shop.dto';
import { ToggleFavoriteDto } from './dto/toggle-favorite.dto';

@Controller('icecream-shops')
export class IcecreamShopsController {

  constructor(private readonly icecreamShopsService: IcecreamShopsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async getIcecreamShop(@Param('id') id: string) {
    return await this.icecreamShopsService.getIcecreamShop(+id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('create')
  async createIcecreamShop(@Body() icecreamShop: CreateIcecreamShopDto, @Request() req) {
    const { user_id, user_type } = req.user.userData;
    if (![UserType.admin, UserType.manager].includes(user_type)) {
      throw new HttpException(ErrorType.accessDenied, HttpStatus.UNAUTHORIZED);
    }
    return await this.icecreamShopsService.createIcecreamShop(user_id, user_type, icecreamShop);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('list')
  async listIcecreamShops(@Body() filters: ListIcecreamShopsDto, @Request() req) {
    return await this.icecreamShopsService.listIcecreamShops(filters);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('addToFavorite')
  async addToFavorites(@Request() req, @Body() toggleFavorite: ToggleFavoriteDto) {
    const { user_type, user_id } = req.user.userData;
    if (UserType.client !== user_type) {
      throw new HttpException(ErrorType.accessDenied, HttpStatus.UNAUTHORIZED);
    }
    const { icecreamShopId } = toggleFavorite;
    return await this.icecreamShopsService.addToFavorite(user_id, icecreamShopId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('removeFromFavorite')
  async removeFromFavorites(@Request() req, @Body() toggleFavorite: ToggleFavoriteDto) {
    const { user_type, user_id } = req.user.userData;
    if (UserType.client !== user_type) {
      throw new HttpException(ErrorType.accessDenied, HttpStatus.UNAUTHORIZED);
    }
    const { icecreamShopId } = toggleFavorite;
    return await this.icecreamShopsService.removeFromFavorite(user_id, icecreamShopId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('edit')
  async editIcecreamShop(@Request() req, @Body() editData: EditIcecreamShopDto) {
    const { user_type, user_id } = req.user.userData;
    if ([UserType.client, UserType.guest].includes(user_type)) {
      throw new HttpException(ErrorType.accessDenied, HttpStatus.UNAUTHORIZED);
    }
    return await this.icecreamShopsService.editIcecreamShop(+user_id, user_type, editData);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('list/favorite')
  async listFavoriteIcecreamShops(@Request() req, @Body() filters: ListFavoriteIcecreamShopDto) {
    const { user_type, user_id } = req.user.userData;
    if (UserType.client !== user_type) {
      throw new HttpException(ErrorType.accessDenied, HttpStatus.UNAUTHORIZED);
    }
    return await this.icecreamShopsService.listFavoriteIcecreamShops(+user_id, filters);
  }

}
