import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { IcecreamShopsService } from './icecream-shops.service';
import { CreateIcecreamShopDto } from './create-icecream-shop.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('icecream-shops')
export class IcecreamShopsController {

  constructor(private readonly icecreamShopsService: IcecreamShopsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async createIcecreamShop(@Body() icecreamShop: CreateIcecreamShopDto, @Request() req) {
    const id = req.user.userData.user_id;
    return await this.icecreamShopsService.createIcecreamShop(id, icecreamShop);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('my')
  async getMyIcecreamShops(@Request() req) {
    const id = req.user.userData.user_id;
    return await this.icecreamShopsService.getMyIcecreamShops(id);
  }

}
