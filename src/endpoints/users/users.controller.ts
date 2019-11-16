import { Controller, Post, Body, Patch, Request, UseGuards, Param } from '@nestjs/common';
import { CreateUserDto } from './create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './update-user.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UsersController {

  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async createUser(@Body() user: CreateUserDto, @Request() req) {
    const { userData } = req.user;
    return await this.usersService.createUser(user, userData);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  async updateUser(@Param('id') id: string, @Body() user: UpdateUserDto, @Request() req) {
    const { userData } = req.user;
    return await this.usersService.updateUser(+id, user, userData);
  }

}
