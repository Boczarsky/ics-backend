import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateUserDto } from './create-user.dto';
import { Connection, Repository } from 'typeorm';
import { User } from 'src/entity/user.entity';
import { UserType } from 'src/enums/user-type.enum';

@Injectable()
export class UsersService {

  constructor(private readonly connection: Connection) {}

  async createUser(userData: CreateUserDto) {
    const userRepositiory: Repository<User> = this.connection.getRepository(User);
    const newUser = new User();
    switch (userData.userType) {
      case UserType.client :
        newUser.login = userData.login;
        newUser.password = userData.password;
        newUser.email = userData.email;
        newUser.userType = UserType.client;
        break;
      default:
    }
    try {
      const result = await userRepositiory.manager.save(newUser);
      return {userId: result.userId};
    } catch (error) {
      switch (error.code) {
        case '23505':
          throw new HttpException('User exists', HttpStatus.FORBIDDEN);
        default:
          throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
    }
  }

}
