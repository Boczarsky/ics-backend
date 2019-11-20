import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { Connection, Repository } from 'typeorm';
import { User } from '../../entity/user.entity';
import { EditUserDto } from './dto/edit-user.dto';
import { PasswordHelper } from '../../common/password-helper';
import { UserType } from '../../enums/user-type.enum';
import { ErrorType } from '../../enums/error-type.enum';
import { ListUsersDto } from './dto/list-users.dto';

@Injectable()
export class UsersService {

  passwordHelper = new PasswordHelper();

  constructor(private readonly connection: Connection) {}

  async createUser(userData: CreateUserDto) {
    const userRepositiory = this.connection.getRepository(User);
    const newUser = new User();
    const login = await userRepositiory.findOne({login: userData.login});
    if (login) {
      throw new HttpException(ErrorType.loginExist, HttpStatus.FORBIDDEN);
    }
    const email = await userRepositiory.findOne({email: userData.email});
    if (email) {
      throw new HttpException(ErrorType.emailExist, HttpStatus.FORBIDDEN);
    }
    if (userData.firstName) {
      newUser.first_name = userData.firstName;
    }
    if (userData.lastName) {
      newUser.last_name = userData.lastName;
    }
    newUser.login = userData.login;
    newUser.password = this.passwordHelper.hash(userData.password);
    newUser.email = userData.email;
    if (userData.managerId) {
      newUser.manager_id = userData.managerId;
    }
    newUser.user_type = userData.userType;
    try {
      const result = await userRepositiory.manager.save(newUser);
      return {userId: result.user_id};
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async updateUser(userData: EditUserDto) {
    const userRepositiory = this.connection.getRepository(User);
    const user = await userRepositiory.findOne({user_id: userData.user_id});
    if (!user) {
      throw new HttpException(ErrorType.userNotFound, HttpStatus.NOT_FOUND);
    }
    if (userData.password) {
      user.password = this.passwordHelper.hash(userData.password);
    }
    if (userData.managerId) {
      user.manager_id = userData.managerId;
    }
    if (userData.userType) {
      user.user_type = userData.userType;
    }
    if (userData.email) {
      const email = await userRepositiory.findOne({email: userData.email});
      if (email) {
        throw new HttpException(ErrorType.emailExist, HttpStatus.FORBIDDEN);
      }
      user.email = userData.email;
    }
    if (userData.firstName) {
      user.first_name = userData.firstName;
    }
    if (userData.lastName) {
      user.last_name = userData.lastName;
    }
    try {
      const result = await userRepositiory.manager.save(user);
      const { password, ...response } = result;
      return response;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getUser(userId: number) {
    const userRepositiory = this.connection.getRepository(User);
    const user = await userRepositiory.findOne({user_id: userId});
    if (!user) {
      throw new HttpException(ErrorType.userNotFound, HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async listUsers(filters: ListUsersDto) {
    const {full_name, manager, login, email, user_type, limit, offset} = filters;
    const where = [];
    if (user_type) {
      where.push(`user_type IN (${user_type.join(',')})`);
    }
    if (full_name) {
      where.push(`lower(full_name) LIKE '%${full_name.toLowerCase()}%'`);
    }
    if (manager) {
      where.push(`lower(manager) LIKE '%${manager.toLowerCase()}%'`);
    }
    if (login) {
      where.push(`lower(login) LIKE '%${login.toLowerCase()}%'`);
    }
    if (email) {
      where.push(`lower(email) LIKE '%${email.toLowerCase()}%'`);
    }
    const whereString = where.length > 0 ? 'WHERE ' + where.join(' AND ') : '';
    const query = `
      SELECT
      (SELECT COUNT(*) FROM search_user ${whereString}) as total,
      * FROM search_user ${whereString}
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
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async listEmployees(userId: number) {
    return await this.connection.getRepository(User).find({
      where: {manager_id: userId},
      select: ['user_id', 'login', 'email', 'first_name', 'last_name'],
    });
  }

}
