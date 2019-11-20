import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Connection } from 'typeorm';
import { CreateIcecreamShopDto } from './dto/create-icecream-shop.dto';
import { IcecreamShop } from '../../entity/icecream-shop.entity';
import { UserType } from '../../enums/user-type.enum';
import { ErrorType } from '../../enums/error-type.enum';
import { Follower } from '../../entity/follower.entity';

@Injectable()
export class IcecreamShopsService {

  constructor(private readonly connection: Connection) {}

  async getIcecreamShop(icecreamShopId: number, userId: number, userType: UserType) {
    const icecreamShopRepositiory = this.connection.getRepository(IcecreamShop);
    return await icecreamShopRepositiory.findOne({
      where: {icecream_shop_id: icecreamShopId},
      relations: ['followers', 'opinions', 'posts'],
    });
  }

  async createIcecreamShop(ownerId: number, user_type: UserType, icecreamShopData: CreateIcecreamShopDto) {
    const icecreamShopRepositiory = this.connection.getRepository(IcecreamShop);
    const newIcecreamShop = new IcecreamShop();
    newIcecreamShop.name = icecreamShopData.name;
    newIcecreamShop.city = icecreamShopData.city;
    newIcecreamShop.street = icecreamShopData.street;
    newIcecreamShop.description = icecreamShopData.description;
    newIcecreamShop.postal_code = icecreamShopData.postal_code;
    if (icecreamShopData.logo_id) {
      newIcecreamShop.logo_id = icecreamShopData.logo_id;
    }
    if (icecreamShopData.photo_id) {
      newIcecreamShop.photo_id = icecreamShopData.photo_id;
    }
    if (user_type === UserType.admin) {
      if (!icecreamShopData.owner_id) {
        throw new HttpException(ErrorType.userNotFound, HttpStatus.NOT_FOUND);
      }
      newIcecreamShop.owner_id = icecreamShopData.owner_id;
    } else {
      newIcecreamShop.owner_id = ownerId;
    }
    try {
      const result = await icecreamShopRepositiory.manager.save(newIcecreamShop);
      return {icecreamShopId: result.icecream_shop_id};
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getMyIcecreamShops(ownerId: number) {
    const icecreamShopRepositiory = this.connection.getRepository(IcecreamShop);
    try {
      return await icecreamShopRepositiory.find({owner_id: ownerId});
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async addToFavorites(userId: number, icecreamShopId: number) {
    const favoriteFollowerRepository = this.connection.getRepository(Follower);
    const favoriteFollower = new Follower();
    favoriteFollower.user_id = userId;
    favoriteFollower.icecream_shop_id = icecreamShopId;
    try {
      await favoriteFollowerRepository.manager.save(favoriteFollower);
      return {};
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async removeFromFavorites(userId: number, icecreamShopId: number) {
    const favoriteShopRepository = this.connection.getRepository(Follower);
    try {
      const favorite = await favoriteShopRepository.findOne({user_id: userId, icecream_shop_id: icecreamShopId});
      favoriteShopRepository.manager.remove(favorite);
      return {};
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

}
