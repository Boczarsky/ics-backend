import { SpecialDay } from './../../entity/special_day.entity';
import { OpenDay } from './../../entity/open_day.entity';
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
import { ListFavoriteIcecreamShopDto } from './dto/list-favorite-icecream-shop.dto';

@Injectable()
export class IcecreamShopsService {

  constructor(private readonly connection: Connection) {}

  async getIcecreamShop(icecreamShopId: number, uType: number) {
    const icecreamShopRepositiory = this.connection.getRepository(IcecreamShop);
    const response = await icecreamShopRepositiory.findOne({
      where: {icecream_shop_id: icecreamShopId},
      relations: ['followers', 'opinions', 'posts', 'flavours', 'flavours.hashtags', 'open_days', 'special_days'],
    });
    return { ...response, flavours: response.flavours.filter(flavour => UserType.client === uType ? flavour.status !== 3 : true ), followers: response.followers.length };
  }

  async createIcecreamShop(ownerId: number, userType: UserType, icecreamShopData: CreateIcecreamShopDto) {
    const icecreamShopRepositiory = this.connection.getRepository(IcecreamShop);
    const newIcecreamShop = new IcecreamShop();
    newIcecreamShop.name = icecreamShopData.name;
    newIcecreamShop.city = icecreamShopData.city;
    newIcecreamShop.street = icecreamShopData.street;
    newIcecreamShop.description = icecreamShopData.description;
    newIcecreamShop.postal_code = icecreamShopData.postalCode;
    if (icecreamShopData.googleMapLink) {
      newIcecreamShop.google_map_link = icecreamShopData.googleMapLink;
    }
    if (icecreamShopData.logoFileName) {
      newIcecreamShop.logo_file_name = icecreamShopData.logoFileName;
    }
    if (icecreamShopData.backgroundFileName) {
      newIcecreamShop.background_file_name = icecreamShopData.backgroundFileName;
    }
    if (userType === UserType.admin) {
      if (!icecreamShopData.ownerId) {
        throw new HttpException(ErrorType.userNotFound, HttpStatus.NOT_FOUND);
      }
      newIcecreamShop.owner_id = icecreamShopData.ownerId;
    } else {
      newIcecreamShop.owner_id = ownerId;
    }
    try {
      const result = await icecreamShopRepositiory.manager.save(newIcecreamShop);
      if (icecreamShopData.openDays && icecreamShopData.openDays.length) {
        const openDayRepository = this.connection.getRepository(OpenDay);
        const openDays = icecreamShopData.openDays.map(data => {
          const oDay = new OpenDay();
          oDay.icecream_shop_id = result.icecream_shop_id;
          oDay.from = data.from;
          oDay.to = data.to;
          oDay.hour_from = data.hourFrom;
          oDay.hour_to = data.hourTo;
          return oDay;
        });
        await openDayRepository.save(openDays);
      }
      if (icecreamShopData.specialDays && icecreamShopData.specialDays.length) {
        const specialDayRepository = this.connection.getRepository(SpecialDay);
        const specialDays = icecreamShopData.specialDays.map(data => {
          const sDay = new SpecialDay();
          sDay.icecream_shop_id = result.icecream_shop_id;
          sDay.closed = data.closed;
          sDay.from = data.from;
          sDay.to = data.to;
          if (!data.closed) {
            sDay.hour_from = data.hourFrom;
            sDay.hour_to = data.hourTo;
          }
          return sDay;
        });
        await specialDayRepository.save(specialDays);
      }
      return {icecreamShopId: result.icecream_shop_id};
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async listIcecreamShops(filters: ListIcecreamShopsDto) {
    const { limit, offset, name, city, hashtags, employeeId, managerId } = filters;
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
      logo_file_name,
      follows,
      json_agg(hashtag) as "hashtags"
    FROM icecream_shop_search ${whereString}
    GROUP BY
      icecream_shop_id,
      owner_id,
      name,
      city,
      street,
      postal_code,
      logo_file_name,
      follows
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
    const { name, city, street, postalCode, description, icecreamShopId, logoFileName, backgroundFileName, googleMapLink, openDays, specialDays } = editData;
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
    if (postalCode) {
      icecreamShop.postal_code = postalCode;
    }
    if (description) {
      icecreamShop.description = description;
    }
    if (logoFileName) {
      icecreamShop.logo_file_name = logoFileName;
    }
    if (backgroundFileName) {
      icecreamShop.background_file_name = backgroundFileName;
    }
    icecreamShop.google_map_link = googleMapLink;
    try {
      if (openDays) {
        const oDays = openDays.map(data => {
          const oDay = new OpenDay();
          oDay.icecream_shop_id = icecreamShop.icecream_shop_id;
          oDay.from = data.from;
          oDay.to = data.to;
          oDay.hour_from = data.hourFrom;
          oDay.hour_to = data.hourTo;
          return oDay;
        });
        const openDayRepository = this.connection.getRepository(OpenDay);
        await openDayRepository.delete({ icecream_shop_id: icecreamShop.icecream_shop_id });
        await openDayRepository.save(oDays);
      }
      if (specialDays) {
        const sDays = specialDays.map(data => {
          const sDay = new SpecialDay();
          sDay.icecream_shop_id = icecreamShop.icecream_shop_id;
          sDay.closed = data.closed;
          sDay.from = data.from;
          sDay.to = data.to;
          if (!data.closed) {
            sDay.hour_from = data.hourFrom;
            sDay.hour_to = data.hourTo;
          }
          return sDay;
        });
        const specialDayRepository = this.connection.getRepository(SpecialDay);
        await specialDayRepository.delete({ icecream_shop_id: icecreamShop.icecream_shop_id });
        await specialDayRepository.save(sDays);
      }
      return await icecreamShopRepository.manager.save(icecreamShop, {});
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
      "ics"."icecream_shop_id" as id,
      "ics"."name",
      "ics"."city",
      "ics"."street",
      "ics"."postal_code",
      "ics"."logo_file_name"
    FROM "follower" "f"
    LEFT JOIN "icecream_shop" "ics" ON "f"."icecream_shop_id" = "ics"."icecream_shop_id"
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
