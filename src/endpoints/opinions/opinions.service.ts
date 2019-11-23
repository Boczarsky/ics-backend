import { Injectable, HttpException, HttpStatus, Param } from '@nestjs/common';
import { Connection } from 'typeorm';
import { UserType } from '../../enums/user-type.enum';
import { AddOpinionDto } from './dto/add-opinion.dto';
import { RemoveOpinionDto } from './dto/remove-opinion.dto';
import { editOpinionDto } from './dto/edit-opinion.dto';
import { AddOpinionCommentDto } from './dto/add-opinion-comment.dto';
import { RemoveOpinionCommentDto } from './dto/remove-opinion-comment.dto';
import { Opinion } from '../../entity/opinion.entity';
import { ErrorType } from '../../enums/error-type.enum';
import { Employment } from '../../entity/employment.entity';
import { IcecreamShop } from '../../entity/icecream-shop.entity';
import { OpinionComment } from '../../entity/opinion_comment.entity';

@Injectable()
export class OpinionsService {

  constructor(private readonly connection: Connection) {}

  async addOpinion(userId: number, opinionData: AddOpinionDto) {
    const { icecreamShopId, content, grade } = opinionData;
    const opinionRepository = this.connection.getRepository(Opinion);
    const currentOpinion = await opinionRepository.findOne({user_id: userId, icecream_shop_id: icecreamShopId});
    if (currentOpinion) {
      throw new HttpException(ErrorType.alreadyExist, HttpStatus.BAD_REQUEST);
    }
    const opinion = new Opinion();
    opinion.user_id = userId;
    opinion.icecream_shop_id = icecreamShopId;
    opinion.content = content;
    opinion.grade = grade;
    opinion.created_at = new Date().toISOString();
    try {
      return await opinionRepository.manager.save(opinion);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async removeOpinion(userId: number, userType: UserType, opinionData: RemoveOpinionDto) {
    const { opinionId } = opinionData;
    const opinionRepository = this.connection.getRepository(Opinion);
    const opinion = await opinionRepository.findOne({opinion_id: opinionId});
    if (!opinion) {
      throw new HttpException(ErrorType.notFound, HttpStatus.NOT_FOUND);
    }
    if (userType === UserType.admin) {
      try {
        return await opinionRepository.remove(opinion);
      } catch (error) {
        throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    } else {
      if (opinion.user_id !== userId) {
        throw new HttpException(ErrorType.accessDenied, HttpStatus.UNAUTHORIZED);
      }
      try {
        return await opinionRepository.remove(opinion);
      } catch (error) {
        throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }

  async editOpinion(userId: number, opinionData: editOpinionDto) {
    const { opinionId, content, grade } = opinionData;
    const opinionRepository = this.connection.getRepository(Opinion);
    const opinion = await opinionRepository.findOne({opinion_id: opinionId, user_id: userId});
    if (!opinion) {
      throw new HttpException(ErrorType.notFound, HttpStatus.NOT_FOUND);
    }
    if (content) {
      opinion.content = content;
    }
    if (grade) {
      opinion.grade = grade;
    }
    try {
      return await opinionRepository.manager.save(opinion);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async addOpinionComment(userId: number, userType: UserType, opinionData: AddOpinionCommentDto) {
    const { opinionId, content } = opinionData;
    const opinionRepository = this.connection.getRepository(Opinion);
    const opinion = await opinionRepository.findOne({opinion_id: opinionId});
    if (!opinion) {
      throw new HttpException(ErrorType.notFound, HttpStatus.NOT_FOUND);
    }
    if (userType === UserType.client) {
      if (opinion.user_id !== userId) {
        throw new HttpException(ErrorType.accessDenied, HttpStatus.UNAUTHORIZED);
      }
    }
    if (userType === UserType.employee) {
      const employmentRepository = this.connection.getRepository(Employment);
      const employment = await employmentRepository.findOne({user_id: userId, icecream_shop_id: opinion.icecream_shop_id});
      if (!employment) {
        throw new HttpException(ErrorType.accessDenied, HttpStatus.UNAUTHORIZED);
      }
    }
    if (userType === UserType.manager) {
      const icecreamShopRepository = this.connection.getRepository(IcecreamShop);
      const icecreamShop = await icecreamShopRepository.findOne({icecream_shop_id: opinion.icecream_shop_id, owner_id: userId});
      if (!icecreamShop) {
        throw new HttpException(ErrorType.accessDenied, HttpStatus.UNAUTHORIZED);
      }
    }
    const comment = new OpinionComment();
    comment.content = content;
    comment.user_id = userId;
    comment.opinion_id = opinionId;
    if ([UserType.manager, UserType.employee].includes(userType)) {
      comment.icecream_shop_id = opinion.icecream_shop_id;
    }
    const opinionCommentRepository = this.connection.getRepository(OpinionComment);
    try {
      return await opinionCommentRepository.manager.save(comment);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async removeOpinionComment(userId: number, userType: UserType, opinionData: RemoveOpinionCommentDto) {
    const { opinionId, commentId } = opinionData;
    const opinionRepository = this.connection.getRepository(Opinion);
    const opinion = await opinionRepository.findOne({opinion_id: opinionId});
    const opinionCommentRepository = this.connection.getRepository(OpinionComment);
    const comment = await opinionCommentRepository.findOne({opinion_comment_id: commentId});
    if (!opinion || !comment) {
      throw new HttpException(ErrorType.notFound, HttpStatus.NOT_FOUND);
    }
    if (userType === UserType.client && comment) {
      if (opinion.user_id !== userId || comment.user_id !== userId) {
        throw new HttpException(ErrorType.accessDenied, HttpStatus.UNAUTHORIZED);
      }
    }
    if (userType === UserType.employee && comment) {
      const employmentRepository = this.connection.getRepository(Employment);
      const employment = await employmentRepository.findOne({user_id: userId, icecream_shop_id: opinion.icecream_shop_id});
      if (!employment || comment.icecream_shop_id !== opinion.icecream_shop_id) {
        throw new HttpException(ErrorType.accessDenied, HttpStatus.UNAUTHORIZED);
      }
    }
    if (userType === UserType.manager && comment) {
      const icecreamShopRepository = this.connection.getRepository(IcecreamShop);
      const icecreamShop = await icecreamShopRepository.findOne({icecream_shop_id: opinion.icecream_shop_id, owner_id: userId});
      if (!icecreamShop || comment.icecream_shop_id !== opinion.icecream_shop_id) {
        throw new HttpException(ErrorType.accessDenied, HttpStatus.UNAUTHORIZED);
      }
    }
    try {
      return await opinionCommentRepository.manager.remove(comment);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

}
