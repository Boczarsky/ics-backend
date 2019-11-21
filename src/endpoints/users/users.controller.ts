import { Controller, Post, Body, Request, UseGuards, Get, HttpException, HttpStatus } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { EditUserDto } from './dto/edit-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { ListUsersDto } from './dto/list-users.dto';
import { UserType } from '../../enums/user-type.enum';
import { ErrorType } from '../../enums/error-type.enum';
import { User } from '../../entity/user.entity';
import { EditMyUserDto } from './dto/edit-my-user.dto';
import { DeleteUserDto } from './dto/delete-user.dto';

@Controller('users')
export class UsersController {

  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('my')
  async getMyUser(@Request() req) {
    const userData: User = req.user.userData;
    const { user_id } = userData;
    return await this.usersService.getMyUser(+user_id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('my')
  async editMyUser(@Body() editData: EditMyUserDto, @Request() req) {
    const userData: User = req.user.userData;
    const { user_id } = userData;
    return await this.usersService.editMyUser(+user_id, editData);
  }

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
  async editUser(@Body() user: EditUserDto, @Request() req) {
    const userData: User = req.user.userData;
    const { user_type } = userData;
    if (user_type !== UserType.admin) {
      throw new HttpException(ErrorType.accessDenied, HttpStatus.UNAUTHORIZED);
    }
    return await this.usersService.editUser(user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('delete')
  async deleteUser(@Body() user: DeleteUserDto, @Request() req) {
    const userData: User = req.user.userData;
    const { user_type } = userData;
    if (user_type !== UserType.admin) {
      throw new HttpException(ErrorType.accessDenied, HttpStatus.UNAUTHORIZED);
    }
    return await this.usersService.deleteUser(user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('my/delete')
  async deleteMyUser(@Request() req) {
    const userData: User = req.user.userData;
    const { user_id } = userData;
    const user = { userId: +user_id };
    return await this.usersService.deleteUser(user);
  }

}
