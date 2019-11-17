import { Controller, Post, Body, Patch, Request, UseGuards, Param, Get, HttpException, HttpStatus } from '@nestjs/common';
import { CreateUserDto } from './create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { ListUsersDto } from './list-users.dto';
import { UserType } from '../../enums/user-type.enum';
import { ErrorType } from '../../enums/error-type.enum';

@Controller('users')
export class UsersController {

  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async createUser(@Body() user: CreateUserDto, @Request() req) {
    const { user_type, user_id } = req.user.userData;
    if (![UserType.manager, UserType.admin].includes(user_type)) {
      throw new HttpException(ErrorType.accessDenied, HttpStatus.UNAUTHORIZED);
    }
    return await this.usersService.createUser(user, user_id, user_type);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('list')
  async listUser(@Body() filters: ListUsersDto, @Request() req) {
    const { user_type } = req.user.userData;
    if (user_type !== UserType.admin) {
      throw new HttpException(ErrorType.accessDenied, HttpStatus.UNAUTHORIZED);
    }
    return await this.usersService.listUsers(filters);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('manager/my')
  async listEmployees(@Request() req) {
    const { user_type, user_id } = req.user.userData;
    if (user_type !== UserType.manager) {
      throw new HttpException(ErrorType.accessDenied, HttpStatus.UNAUTHORIZED);
    }
    return await this.usersService.listEmployees(user_id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  async updateUser(@Param('id') id: string, @Body() user: UpdateUserDto, @Request() req) {
    const { user_id, user_type } = req.user.userData;
    return await this.usersService.updateUser(+id, user, user_id, user_type);
  }

}
