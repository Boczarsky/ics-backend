import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { UserType } from 'src/enums/user-type.enum';
import { AddOpinionDto } from './dto/add-opinion.dto';
import { RemoveOpinionDto } from './dto/remove-opinion.dto';
import { editOpinionDto } from './dto/edit-opinion.dto';
import { AddOpinionCommentDto } from './dto/add-opinion-comment.dto';
import { RemoveOpinionCommentDto } from './dto/remove-opinion-comment.dto';

@Injectable()
export class OpinionsService {

  constructor(private readonly connection: Connection) {}

  async addOpinion(userId: number, userType: UserType, opinionData: AddOpinionDto) {

  }

  async removeOpinion(userId: number, userType: UserType, opinionData: RemoveOpinionDto) {

  }

  async editOpinion(userId: number, userType: UserType, opinionData: editOpinionDto) {

  }

  async addOpinionComment(userId: number, userType: UserType, opinionData: AddOpinionCommentDto) {

  }

  async removeOpinionComment(userId: number, userType: UserType, opinionData: RemoveOpinionCommentDto) {

  }

}
