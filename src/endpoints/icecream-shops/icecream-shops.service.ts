import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Connection } from 'typeorm';
import { CreateIcecreamShopDto } from './dto/create-icecream-shop.dto';
import { IcecreamShop } from '../../entity/icecream-shop.entity';
import { UserType } from '../../enums/user-type.enum';
import { ErrorType } from '../../enums/error-type.enum';
import { Follower } from '../../entity/follower.entity';
import { ListIcecreamShopsDto } from './dto/list-icecream-shops.dto';
import { EditIcecreamShopDto } from './dto/edit-icecream-shop.dto';
import { Employment } from '../../entity/employment.entity';
import { Localization } from '../../entity/localization.entity';
import { ListFavoriteIcecreamShopDto } from './dto/list-favorite-icecream-shop.dto';

@Injectable()
export class IcecreamShopsService {

  constructor(private readonly connection: Connection) {}

  async getIcecreamShop(icecreamShopId: number) {
    const icecreamShopRepositiory = this.connection.getRepository(IcecreamShop);
    const response = await icecreamShopRepositiory.findOne({
      where: {icecream_shop_id: icecreamShopId},
      relations: ['followers', 'opinions', 'posts', 'flavours', 'localization'],
    });
    return { ...response, followers: response.followers.length };
  }

  async createIcecreamShop(ownerId: number, userType: UserType, icecreamShopData: CreateIcecreamShopDto) {
    const icecreamShopRepositiory = this.connection.getRepository(IcecreamShop);
    const newIcecreamShop = new IcecreamShop();
    newIcecreamShop.name = icecreamShopData.name;
    newIcecreamShop.city = icecreamShopData.city;
    newIcecreamShop.street = icecreamShopData.street;
    newIcecreamShop.description = icecreamShopData.description;
    newIcecreamShop.postal_code = icecreamShopData.postal_code;
    if (icecreamShopData.logo_file_name) {
      newIcecreamShop.logo_file_name = icecreamShopData.logo_file_name;
    }
    if (icecreamShopData.photo_file_name) {
      newIcecreamShop.photo_file_name = icecreamShopData.photo_file_name;
    }
    if (userType === UserType.admin) {
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
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async listIcecreamShops(filters: ListIcecreamShopsDto) {
    const { limit, offset, name, city, hashtags, localization, employeeId, managerId } = filters;
    const where = [];
    if (employeeId) {
      where.push(`employee_id = ${employeeId}`);
    }
    if (managerId) {
      where.push(`owner_id = ${managerId}`);
    }
    if (name) {
      where.push(`lower(name) LIKE '%${name}%'`);
    }
    if (city) {
      where.push(`lower(city) LIKE '%${city}%'`);
    }
    if (hashtags && hashtags.length) {
      const quoted = hashtags.map(hashtag => `'${hashtag}'`);
      where.push(`hashtag IN (${quoted.join(',')})`);
    }
    const whereString = where.length ? `WHERE ${where.join(' AND ')}` : '';
    const query = `
    WITH count_ics AS (SELECT DISTINCT icecream_shop_id FROM icecream_shop_search ${whereString})
    SELECT
      (select count(*) as count FROM count_ics) as total,
      icecream_shop_id,
      owner_id,
      name,
      city,
      street,
      postal_code,
      longitude,
      latitude,
      logo_file_name,
      json_agg(hashtag) as "hashtags"
    FROM icecream_shop_search ${whereString}
    GROUP BY
      icecream_shop_id,
      owner_id,
      name,
      city,
      street,
      postal_code,
      longitude,
      latitude,
      logo_file_name
    LIMIT ${limit}
    OFFSET ${offset}
    `;
    try {
      const queryResult = await this.connection.query(query);
      return queryResult.reduce((prev, curr) => {
        const {total, ...result} = curr;
        if (!prev.total) {
          prev.total = total;
        }
        prev.result.push(result);
        return prev;
      }, { result: [], total: 0 });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async addToFavorite(userId: number, icecreamShopId: number) {
    const followerRepository = this.connection.getRepository(Follower);
    const follower = new Follower();
    follower.user_id = userId;
    follower.icecream_shop_id = icecreamShopId;
    try {
      return await followerRepository.manager.save(follower);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async removeFromFavorite(userId: number, icecreamShopId: number) {
    const followerRepository = this.connection.getRepository(Follower);
    const favorite = await followerRepository.findOne({user_id: userId, icecream_shop_id: icecreamShopId});
    if (!favorite) {
      throw new HttpException(ErrorType.notFound, HttpStatus.NOT_FOUND);
    }
    try {
      return await followerRepository.manager.remove(favorite);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async editIcecreamShop(userId: number, userType: UserType, editData: EditIcecreamShopDto) {
    const { name, city, street, postal_code, description, icecreamShopId, logo_file_name, photo_file_name, localization } = editData;
    const icecreamShopRepository = this.connection.getRepository(IcecreamShop);
    const employmentRepository = this.connection.getRepository(Employment);
    const icecreamShop = await icecreamShopRepository.findOne({ icecream_shop_id: icecreamShopId });
    if (!icecreamShop) {
      throw new HttpException(ErrorType.notFound, HttpStatus.NOT_FOUND);
    }
    if (userType === UserType.manager && icecreamShop.owner_id !== userId) {
      throw new HttpException(ErrorType.accessDenied, HttpStatus.UNAUTHORIZED);
    }
    if (userType === UserType.employee) {
      const employee = await employmentRepository.findOne({icecream_shop_id: icecreamShopId, user_id: userId});
      if (!employee) {
        throw new HttpException(ErrorType.accessDenied, HttpStatus.UNAUTHORIZED);
      }
    }
    if (name) {
      icecreamShop.name = name;
    }
    if (city) {
      icecreamShop.city = city;
    }
    if (street) {
      icecreamShop.street = street;
    }
    if (postal_code) {
      icecreamShop.postal_code = postal_code;
    }
    if (description) {
      icecreamShop.description = description;
    }
    if (logo_file_name) {
      icecreamShop.logo_file_name = logo_file_name;
    }
    if (photo_file_name) {
      icecreamShop.photo_file_name = photo_file_name;
    }
    if (localization) {
      const newLocalization = new Localization();
      newLocalization.icecream_shop_id = icecreamShopId;
      newLocalization.latitude = localization.latitude;
      newLocalization.longitude = localization.longitude;
      if (icecreamShop.localization_id) {
        newLocalization.localization_id = icecreamShop.localization_id;
      }
      const localizationRepository = this.connection.getRepository(Localization);
      try {
        icecreamShop.localization = await localizationRepository.manager.save(newLocalization);
      } catch (error) {
        throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
    try {
      return await icecreamShopRepository.manager.save(icecreamShop);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async listFavoriteIcecreamShops(userId: number, filters: ListFavoriteIcecreamShopDto) {
    const { limit, offset } = filters;
    const query = `
    WITH count_ics AS (SELECT DISTINCT "user_id", "icecream_shop_id" FROM "follower" WHERE "user_id" = ${userId})
    SELECT
      (select count(*) as count FROM count_ics) as "total",
      "ics"."icecream_shop_id",
      "ics"."owner_id",
      "ics"."name",
      "ics"."city",
      "ics"."street",
      "ics"."postal_code",
      "l"."longitude",
      "l"."latitude",
      "ics"."logo_id"
    FROM "follower" "f"
    LEFT JOIN "icecream_shop" "ics" ON "f"."icecream_shop_id" = "ics"."icecream_shop_id"
    LEFT JOIN "localization" "l" ON "ics"."icecream_shop_id" = "l"."icecream_shop_id"
    WHERE "f"."user_id" = ${userId}
    LIMIT ${limit}
    OFFSET ${offset}
    `;
    try {
      const queryResult = await this.connection.query(query);
      return queryResult.reduce((prev, curr) => {
        const {total, ...result} = curr;
        if (!prev.total) {
          prev.total = total;
        }
        prev.result.push(result);
        return prev;
      }, { result: [], total: 0 });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

}
