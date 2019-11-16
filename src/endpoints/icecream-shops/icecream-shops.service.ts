import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Connection, Repository } from 'typeorm';
import { CreateIcecreamShopDto } from './create-icecream-shop.dto';
import { IcecreamShop } from '../../entity/icecream-shop.entity';

@Injectable()
export class IcecreamShopsService {

  constructor(private readonly connection: Connection) {}

  async createIcecreamShop(id: number, icecreamShopData: CreateIcecreamShopDto) {
    const icecreamShopRepositiory: Repository<IcecreamShop> = this.connection.getRepository(IcecreamShop);
    const newIcecreamShop = new IcecreamShop();
    newIcecreamShop.name = icecreamShopData.name;
    newIcecreamShop.owner_id = id;
    try {
      const result = await icecreamShopRepositiory.manager.save(newIcecreamShop);
      return {icecreamShopId: result.icecream_shop_id};
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getMyIcecreamShops(id: number) {
    const icecreamShopRepositiory: Repository<IcecreamShop> = this.connection.getRepository(IcecreamShop);
    try {
      const icecreamShops = await icecreamShopRepositiory.find({owner_id: id});
      return icecreamShops;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

}
