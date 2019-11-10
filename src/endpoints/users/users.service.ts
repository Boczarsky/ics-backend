import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateUserDto } from './create-user.dto';
import { Connection, Repository } from 'typeorm';
import { User } from 'src/entity/user.entity';
import { UserType } from 'src/enums/user-type.enum';
import { IcecreamShop } from 'src/entity/icecream-shop.entity';
import { UpdateUserDto } from './update-user.dto';

@Injectable()
export class UsersService {

  constructor(private readonly connection: Connection) {}

  async createUser(userData: CreateUserDto) {
    const userRepositiory: Repository<User> = this.connection.getRepository(User);
    const newUser = new User();
    switch (userData.userType) {
      case UserType.client:
        this.setPrimaryUserData(newUser, userData);
        break;
      case UserType.employee:
        const icecreamShop = await this.connection
          .getRepository(IcecreamShop)
          .findOne({icecreamShopId: userData.icsId});
        if (!icecreamShop) {
          throw new HttpException('Icecream Shop not found.', HttpStatus.NOT_FOUND);
        }
        this.setPrimaryUserData(newUser, userData);
        newUser.icecreamShop = icecreamShop;
      case UserType.manager:
        this.setPrimaryUserData(newUser, userData);
      default:
    }
    try {
      const result = await userRepositiory.manager.save(newUser);
      return {userId: result.userId};
    } catch (error) {
      switch (error.code) {
        case '23505':
          throw new HttpException('User already exists.', HttpStatus.FORBIDDEN);
        default:
          throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
    }
  }

  async updateUser(userData: UpdateUserDto) {
    const userRepositiory: Repository<User> = this.connection.getRepository(User);
    const user = await userRepositiory.findOne({userId: userData.userId});
    if (!user) {
      throw new HttpException('User not found.', HttpStatus.NOT_FOUND);
    }
    Object.keys(userData)
      .filter((key) => !['userId', 'oldPassword', 'password', 'icsId'].includes(key))
      .forEach((key) => {
        user[key] = userData[key];
      });
    if (userData.password && user.password === userData.oldPassword) {
      user.password = userData.password;
    }
    if (userData.icsId && user.icecreamShop.icecreamShopId !== userData.icsId) {
      const icecreamShop = await this.connection.getRepository(IcecreamShop).findOne({icecreamShopId: userData.icsId});
      if (!icecreamShop) {
        throw new HttpException('Icecream Shop not found.', HttpStatus.NOT_FOUND);
      }
      user.icecreamShop = icecreamShop;
    }
    try {
      const result = await userRepositiory.manager.save(user);
      return result;
    } catch (error) {
      switch (error.code) {
        default:
          throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
    }
  }

  private setPrimaryUserData(newUser: User, userData: CreateUserDto) {
    newUser.login = userData.login;
    newUser.password = userData.password;
    newUser.email = userData.email;
    newUser.userType = userData.userType;
  }

}
