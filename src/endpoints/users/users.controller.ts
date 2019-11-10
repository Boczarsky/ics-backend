import { Controller, Post, Body, Patch } from '@nestjs/common';
import { CreateUserDto } from './create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './update-user.dto';

@Controller('users')
export class UsersController {

  constructor(private readonly usersService: UsersService) {}

  @Post()
  async createUser(@Body() user: CreateUserDto) {
    return await this.usersService.createUser(user);
  }

  @Patch()
  async updateUser(@Body() user: UpdateUserDto) {
    return await this.usersService.updateUser(user);
  }

}
