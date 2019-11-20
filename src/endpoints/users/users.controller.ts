import { Controller, Post, Body, Patch, Request, UseGuards, Param, Get, HttpException, HttpStatus } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { EditUserDto } from './dto/edit-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { ListUsersDto } from './dto/list-users.dto';
import { UserType } from '../../enums/user-type.enum';
import { ErrorType } from '../../enums/error-type.enum';
import { User } from 'src/entity/user.entity';

@Controller('users')
export class UsersController {

  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('create')
  async createUser(@Body() user: CreateUserDto, @Request() req) {
    const userData: User = req.user.userData;
    const { user_type, user_id } = userData;
    if (user_type !== UserType.admin) {
      throw new HttpException(ErrorType.accessDenied, HttpStatus.UNAUTHORIZED);
    }
    return await this.usersService.createUser(user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('list')
  async listUser(@Body() filters: ListUsersDto, @Request() req) {
    const userData: User = req.user.userData;
    const { user_type } = userData;
    if (user_type !== UserType.admin) {
      throw new HttpException(ErrorType.accessDenied, HttpStatus.UNAUTHORIZED);
    }
    return await this.usersService.listUsers(filters);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('edit')
  async updateUser(@Body() user: EditUserDto, @Request() req) {
    const userData: User = req.user.userData;
    const { user_type } = userData;
    if (user_type !== UserType.admin) {
      throw new HttpException(ErrorType.accessDenied, HttpStatus.UNAUTHORIZED);
    }
    return await this.usersService.updateUser(user);
  }

}
