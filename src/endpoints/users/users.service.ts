import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateUserDto } from './create-user.dto';
import { Connection, Repository } from 'typeorm';
import { User } from '../../entity/user.entity';
import { UpdateUserDto } from './update-user.dto';
import { PasswordHelper } from '../../common/password-helper';
import { UserType } from '../../enums/user-type.enum';
import { ErrorType } from '../../enums/error-type.enum';
import e = require('express');
import { ListUsersDto } from './list-users.dto';

@Injectable()
export class UsersService {

  passwordHelper = new PasswordHelper();

  constructor(private readonly connection: Connection) {}

  async createUser(userData: CreateUserDto, creatorData: User) {
    console.log(creatorData);
    const userRepositiory: Repository<User> = this.connection.getRepository(User);
    const newUser = new User();
    const login = await userRepositiory.findOne({login: userData.login});
    if (login) {
      throw new HttpException(ErrorType.loginExist, HttpStatus.FORBIDDEN);
    }
    const email = await userRepositiory.findOne({email: userData.email});
    if (email) {
      throw new HttpException(ErrorType.emailExist, HttpStatus.FORBIDDEN);
    }
    newUser.login = userData.login;
    newUser.password = this.passwordHelper.hash(userData.password);
    newUser.email = userData.email;
    if (creatorData.user_type === UserType.manager) {
      newUser.manager_id = creatorData.user_id;
      newUser.user_type = UserType.employee;
    }
    if (creatorData.user_type === UserType.admin) {
      if (userData.managerId) {
        newUser.manager_id = userData.managerId;
        newUser.user_type = UserType.employee;
      } else {
        newUser.user_type = userData.userType ? userData.userType : UserType.client;
      }
    }
    try {
      const result = await userRepositiory.manager.save(newUser);
      return {userId: result.user_id};
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async updateUser(id: number, userData: UpdateUserDto, updaterData: User) {
    const userRepositiory: Repository<User> = this.connection.getRepository(User);
    const user = await userRepositiory.findOne({user_id: id});
    if (!user) {
      throw new HttpException(ErrorType.userNotFound, HttpStatus.NOT_FOUND);
    }
    if (updaterData.user_type !== UserType.admin && ![user.user_id, user.manager_id].includes(updaterData.user_id)) {
      throw new HttpException(ErrorType.accessDenied, HttpStatus.UNAUTHORIZED);
    }
    Object.keys(userData)
      .filter((key) => !['userId', 'email', 'oldPassword', 'password', 'userType'].includes(key))
      .forEach((key) => {
        user[key] = userData[key];
      });
    if (userData.password) {
      const correctOldPassword = this.passwordHelper.compare(userData.oldPassword, user.password);
      if (correctOldPassword) {
        user.password = this.passwordHelper.hash(userData.password);
      } else if (updaterData.user_type === UserType.admin) {
        user.password = this.passwordHelper.hash(userData.password);
      } else {
        throw new HttpException(ErrorType.passwordMathFailed, HttpStatus.BAD_REQUEST);
      }
    }
    if (updaterData.user_type === UserType.admin) {
      if (userData.managerId) {
        user.manager_id = userData.managerId;
      }
    }
    if (userData.email) {
      const email = await userRepositiory.findOne({email: userData.email});
      if (email) {
        throw new HttpException(ErrorType.emailExist, HttpStatus.FORBIDDEN);
      }
    }
    try {
      const result = await userRepositiory.manager.save(user);
      const { password, ...response } = result;
      return response;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getUser(userId: number, userData: User) {
    const userRepositiory: Repository<User> = this.connection.getRepository(User);
    const user = await userRepositiory.findOne({user_id: userId});
    if (!user) {
      throw new HttpException(ErrorType.userNotFound, HttpStatus.NOT_FOUND);
    }
    if (userData.user_type === UserType.admin || [user.user_id, user.manager_id].includes(userData.user_id)) {
      return user;
    } else {
      throw new HttpException(ErrorType.accessDenied, HttpStatus.UNAUTHORIZED);
    }
  }

  async listUsers(filters: ListUsersDto) {
    const filterArray = [];
    if (filters.user_type) {
      filterArray.push();
    }
    if (filters.search) {
      filterArray.push();
    }
    const query = `SELECT u1.user_id, u1.login, u1.email, u1.first_name, u1.last_name, u2.email as "manager"
    FROM "user" u1
    LEFT JOIN "user" u2 ON u1.manager_id = u2.user_id
    WHERE lower(concat(u1.login, ' ', u1.email, ' ', u1.first_name, ' ', u1.last_name)) LIKE '%:search%'`;
  }

}
