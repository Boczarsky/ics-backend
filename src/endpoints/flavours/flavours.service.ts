import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Connection } from 'typeorm';
import { AddFlavourDto } from './dto/add-flavour.dto';
import { IcecreamShop } from 'src/entity/icecream-shop.entity';
import { Employment } from 'src/entity/employment.entity';
import { UserType } from 'src/enums/user-type.enum';
import { ErrorType } from 'src/enums/error-type.enum';
import { IcecreamFlavour } from 'src/entity/icecream_flavour.entity';
import { FlavourHashtag } from 'src/entity/flavour_hashtag.entity';

@Injectable()
export class FlavoursService {

  constructor(private readonly connection: Connection) {}

  async addFlavour(userId: number, userType: number, flavourData: AddFlavourDto) {
    const {icecreamShopId, name, composition, status, hashtags } = flavourData;
    const icecreamShopRepository = this.connection.getRepository(IcecreamShop);
    const employmentRepository = this.connection.getRepository(Employment);
    if (userType === UserType.manager) {
      const icecreamShop = await icecreamShopRepository.findOne({owner_id: userId, icecream_shop_id: icecreamShopId});
      if (!icecreamShop) {
        throw new HttpException(ErrorType.accessDenied, HttpStatus.UNAUTHORIZED);
      }
    }
    if (userType === UserType.employee) {
      const employee = await employmentRepository.findOne({user_id: userId, icecream_shop_id: icecreamShopId});
      if (!employee) {
        throw new HttpException(ErrorType.accessDenied, HttpStatus.UNAUTHORIZED);
      }
    }
    const newFlavour = new IcecreamFlavour();
    if (hashtags && hashtags.length) {
      newFlavour.hashtags = hashtags.map(hashtag => {
        const flavourHashtag = new FlavourHashtag();
        flavourHashtag.hashtag = hashtag;
        flavourHashtag.icecream_flavour_id = icecreamShopId;
        return flavourHashtag;
      });
    }
    newFlavour.icecream_shop_id = icecreamShopId;
    newFlavour.name = name;
    newFlavour.composition = composition;
    newFlavour.status = status;
    const icecreamFlavourRepository = this.connection.getRepository(IcecreamFlavour);
    try {
      return await icecreamFlavourRepository.manager.save(newFlavour);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

}
