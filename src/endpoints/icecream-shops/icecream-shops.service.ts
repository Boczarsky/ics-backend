import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Connection, Repository } from 'typeorm';
import { CreateIcecreamShopDto } from './create-icecream-shop.dto';
import { IcecreamShop } from 'src/entity/icecream-shop.entity';
import { User } from 'src/entity/user.entity';

@Injectable()
export class IcecreamShopsService {

  constructor(private readonly connection: Connection) {}

  async createIcecreamShop(icecreamShopData: CreateIcecreamShopDto) {
    const icecreamShopRepositiory: Repository<IcecreamShop> = this.connection.getRepository(IcecreamShop);
    const userRepositiory: Repository<User> = this.connection.getRepository(User);
    const newIcecreamShop = new IcecreamShop();
    newIcecreamShop.name = icecreamShopData.name;
    const owner = await userRepositiory.findOne({userId: icecreamShopData.ownerId});
    if (!owner) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    newIcecreamShop.owner = owner;
    try {
      const result = await icecreamShopRepositiory.save(newIcecreamShop);
      return {icecreamShopId: result.icecreamShopId};
    } catch (error) {
      switch (error.code) {
        case '23505':
          throw new HttpException('Already exists.', HttpStatus.FORBIDDEN);
        default:
          throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
    }
  }

}
