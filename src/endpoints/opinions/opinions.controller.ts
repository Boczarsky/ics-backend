import { Controller, UseGuards, Post, Request, Body } from '@nestjs/common';
import { OpinionsService } from './opinions.service';
import { AuthGuard } from '@nestjs/passport';
import { AddOpinionDto } from './dto/add-opinion.dto';
import { RemoveOpinionDto } from './dto/remove-opinion.dto';
import { editOpinionDto } from './dto/edit-opinion.dto';
import { AddOpinionCommentDto } from './dto/add-opinion-comment.dto';
import { RemoveOpinionCommentDto } from './dto/remove-opinion-comment.dto';

@Controller('opinions')
export class OpinionsController {

  constructor(private readonly opinionsService: OpinionsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('add')
  async addOpinion(@Request() req, @Body() opinionData: AddOpinionDto) {
    const { user_type, user_id } = req.user.userData;
    return this.opinionsService.addOpinion(+user_id, user_type, opinionData);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('remove')
  async removeOpinion(@Request() req, @Body() opinionData: RemoveOpinionDto) {
    const { user_type, user_id } = req.user.userData;
    return this.opinionsService.removeOpinion(+user_id, user_type, opinionData);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('edit')
  async editOpinion(@Request() req, @Body() opinionData: editOpinionDto) {
    const { user_type, user_id } = req.user.userData;
    return this.opinionsService.editOpinion(+user_id, user_type, opinionData);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('comment')
  async addOpinionComment(@Request() req, @Body() opinionData: AddOpinionCommentDto) {
    const { user_type, user_id } = req.user.userData;
    return this.opinionsService.addOpinionComment(+user_id, user_type, opinionData);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('removeComment')
  async removeOpinionComment(@Request() req, @Body() opinionData: RemoveOpinionCommentDto) {
    const { user_type, user_id } = req.user.userData;
    return this.opinionsService.removeOpinionComment(+user_id, user_type, opinionData);
  }

}
