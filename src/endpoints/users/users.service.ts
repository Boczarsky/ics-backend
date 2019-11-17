import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateUserDto } from './create-user.dto';
import { Connection, Repository } from 'typeorm';
import { User } from '../../entity/user.entity';
import { UpdateUserDto } from './update-user.dto';
import { PasswordHelper } from '../../common/password-helper';
import { UserType } from '../../enums/user-type.enum';
import { ErrorType } from '../../enums/error-type.enum';
import { ListUsersDto } from './list-users.dto';

@Injectable()
export class UsersService {

  passwordHelper = new PasswordHelper();

  constructor(private readonly connection: Connection) {}

  async createUser(userData: CreateUserDto, creatorId: number, creatorType: number) {
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
    if (userData.firstName) {
      newUser.first_name = userData.firstName;
    }
    if (userData.lastName) {
      newUser.last_name = userData.lastName;
    }
    newUser.login = userData.login;
    newUser.password = this.passwordHelper.hash(userData.password);
    newUser.email = userData.email;
    if (creatorType === UserType.manager) {
      newUser.manager_id = creatorId;
      newUser.user_type = UserType.employee;
    }
    if (creatorType === UserType.admin) {
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

  async updateUser(id: number, userData: UpdateUserDto, updaterId: number, updaterType: number) {
    const userRepositiory: Repository<User> = this.connection.getRepository(User);
    const user = await userRepositiory.findOne({user_id: id});
    if (!user) {
      throw new HttpException(ErrorType.userNotFound, HttpStatus.NOT_FOUND);
    }
    if (updaterType !== UserType.admin && ![user.user_id, user.manager_id].includes(updaterId)) {
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
      } else if (updaterType === UserType.admin) {
        user.password = this.passwordHelper.hash(userData.password);
      } else {
        throw new HttpException(ErrorType.passwordMathFailed, HttpStatus.BAD_REQUEST);
      }
    }
    if (updaterType === UserType.admin) {
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
