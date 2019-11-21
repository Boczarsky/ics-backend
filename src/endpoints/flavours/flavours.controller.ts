import { Controller, UseGuards, Request, Body, Post, HttpException, HttpStatus } from '@nestjs/common';
import { FlavoursService } from './flavours.service';
import { AddFlavourDto } from './dto/add-flavour.dto';
import { AuthGuard } from '@nestjs/passport';
import { UserType } from 'src/enums/user-type.enum';
import { ErrorType } from 'src/enums/error-type.enum';

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

}
