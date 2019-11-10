import { Controller, Post, Body } from '@nestjs/common';
import { IcecreamShopsService } from './icecream-shops.service';
import { CreateIcecreamShopDto } from './create-icecream-shop.dto';

@Controller('icecream-shops')
export class IcecreamShopsController {

  constructor(private readonly icecreamShopsService: IcecreamShopsService) {}

  @Post()
  async createIcecreamShop(@Body() icecreamShop: CreateIcecreamShopDto) {
    return await this.icecreamShopsService.createIcecreamShop(icecreamShop);
  }

}
