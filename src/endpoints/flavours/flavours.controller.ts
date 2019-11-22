import { Controller, UseGuards, Request, Body, Post, HttpException, HttpStatus, Get, Param } from '@nestjs/common';
import { FlavoursService } from './flavours.service';
import { AddFlavourDto } from './dto/add-flavour.dto';
import { AuthGuard } from '@nestjs/passport';
import { UserType } from '../../enums/user-type.enum';
import { ErrorType } from '../../enums/error-type.enum';
import { RemoveFlavourDto } from './dto/remove-flavour.dto';
import { EditFlavourDto } from './dto/edit-flavour.dto';
import { AddReactionDto } from './dto/add-reaction.dto';
import { RemoveReactionDto } from './dto/remove-reaction.dto';

@Controller('flavours')
export class FlavoursController {

  constructor(private readonly flavoursService: FlavoursService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('add')
  async addFlavour(@Request() req, @Body() flavourData: AddFlavourDto) {
    const { user_id, user_type } = req.user.userData;
    if (![UserType.manager, UserType.employee].includes(user_type)) {
      throw new HttpException(ErrorType.accessDenied, HttpStatus.UNAUTHORIZED);
    }
    return this.flavoursService.addFlavour(+user_id, user_type, flavourData);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('remove')
  async removeFlavour(@Request() req, @Body() flavourData: RemoveFlavourDto) {
    const { user_id, user_type } = req.user.userData;
    if (![UserType.manager, UserType.employee].includes(user_type)) {
      throw new HttpException(ErrorType.accessDenied, HttpStatus.UNAUTHORIZED);
    }
    return this.flavoursService.removeFlavour(+user_id, user_type, flavourData);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('edit')
  async editFlavour(@Request() req, @Body() flavourData: EditFlavourDto) {
    const { user_id, user_type } = req.user.userData;
    if (![UserType.manager, UserType.employee].includes(user_type)) {
      throw new HttpException(ErrorType.accessDenied, HttpStatus.UNAUTHORIZED);
    }
    return this.flavoursService.editFlavour(+user_id, user_type, flavourData);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('list/:id')
  async listFlavours(@Param('id') id: string) {
    return this.flavoursService.listFlavours(+id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async getFlavour(@Param('id') id: string) {
    return this.flavoursService.getFlavour(+id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('reactions/my')
  async getMyReactions(@Request() req) {
    const { user_id } = req.user.userData;
    return this.flavoursService.getMyReactions(+user_id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('reactions/add')
  async addReaction(@Request() req, @Body() reactionData: AddReactionDto) {
    const { user_id, user_type } = req.user.userData;
    if (UserType.client !== user_type) {
      throw new HttpException(ErrorType.accessDenied, HttpStatus.UNAUTHORIZED);
    }
    return this.flavoursService.addReaction(+user_id, reactionData);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('reactions/remove')
  async removeReaction(@Request() req, @Body() reactionData: RemoveReactionDto) {
    const { user_id, user_type } = req.user.userData;
    if (UserType.client !== user_type) {
      throw new HttpException(ErrorType.accessDenied, HttpStatus.UNAUTHORIZED);
    }
    return this.flavoursService.removeReaction(+user_id, reactionData);
  }

}
