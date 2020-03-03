import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Connection } from 'typeorm';
import { AddFlavourDto } from './dto/add-flavour.dto';
import { IcecreamShop } from '../../entity/icecream-shop.entity';
import { Employment } from '../../entity/employment.entity';
import { UserType } from '../../enums/user-type.enum';
import { ErrorType } from '../../enums/error-type.enum';
import { IcecreamFlavour } from '../../entity/icecream_flavour.entity';
import { FlavourHashtag } from '../../entity/flavour_hashtag.entity';
import { RemoveFlavourDto } from './dto/remove-flavour.dto';
import { EditFlavourDto } from './dto/edit-flavour.dto';
import { AddReactionDto } from './dto/add-reaction.dto';
import { FlavourReaction } from '../../entity/flavour_reaction.entity';
import { RemoveReactionDto } from './dto/remove-reaction.dto';

@Injectable()
export class FlavoursService {

  constructor(private readonly connection: Connection) {}

  async checkPermissions(userType: UserType, userId: number, icecreamShopId: number) {
    const icecreamShopRepository = this.connection.getRepository(IcecreamShop);
    const employmentRepository = this.connection.getRepository(Employment);
    if (userType === UserType.manager) {
      const icecreamShop = await icecreamShopRepository.findOne({owner_id: userId, icecream_shop_id: icecreamShopId});
      if (!icecreamShop) {
        throw new HttpException(ErrorType.accessDenied, HttpStatus.UNAUTHORIZED);
      }
    }
    if (userType === UserType.employee) {
      const employee = await employmentRepository.findOne({user_id: userId, icecream_shop_id: icecreamShopId});
      if (!employee) {
        throw new HttpException(ErrorType.accessDenied, HttpStatus.UNAUTHORIZED);
      }
    }
  }

  async addFlavour(userId: number, userType: number, flavourData: AddFlavourDto) {
    const {icecreamShopId, name, composition, status, hashtags, fileName } = flavourData;
    this.checkPermissions(userType, userId, icecreamShopId);
    const newFlavour = new IcecreamFlavour();
    newFlavour.icecream_shop_id = icecreamShopId;
    newFlavour.name = name;
    newFlavour.composition = composition;
    newFlavour.status = status;
    if (fileName !== undefined) {
      newFlavour.file_name = fileName;
    }
    const icecreamFlavourRepository = this.connection.getRepository(IcecreamFlavour);
    try {
      const flavour = await icecreamFlavourRepository.manager.save(newFlavour);
      if (flavour && hashtags && hashtags.length) {
        const hashtagsObjects = hashtags.map(hashtag => {
          const flavourHashtag = new FlavourHashtag();
          flavourHashtag.hashtag = hashtag.toLowerCase();
          flavourHashtag.icecream_flavour_id = flavour.icecream_flavour_id;
          return flavourHashtag;
        });
        const flavourHashtagRepository = this.connection.getRepository(FlavourHashtag);
        flavour.hashtags = await flavourHashtagRepository.manager.save(hashtagsObjects);
        return flavour;
      }
      return flavour;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async editFlavour(userId: number, userType: number, flavourData: EditFlavourDto) {
    const {icecreamShopId, name, composition, status, hashtags, flavourId, fileName } = flavourData;
    this.checkPermissions(userType, userId, icecreamShopId);
    const icecreamFlavourRepository = this.connection.getRepository(IcecreamFlavour);
    const editedFlavour = await icecreamFlavourRepository.findOne({icecream_flavour_id: flavourId, icecream_shop_id: icecreamShopId});
    if (!editedFlavour) {
      throw new HttpException(ErrorType.notFound, HttpStatus.NOT_FOUND);
    }
    if (name) {
      editedFlavour.name = name;
    }
    if (composition) {
      editedFlavour.composition = composition;
    }
    if (status) {
      editedFlavour.status = status;
    }
    if (fileName !== undefined) {
      editedFlavour.file_name = fileName;
    }
    try {
      const archivalHashtags = [...editedFlavour.hashtags];
      delete editedFlavour.hashtags;
      delete editedFlavour.reactions;
      const flavour = await icecreamFlavourRepository.manager.save(editedFlavour); // Error caused by hashtags from relations
      if (flavour && hashtags && hashtags.length) {
        const hashtagsObjects = hashtags.map(hashtag => {
          const flavourHashtag = new FlavourHashtag();
          flavourHashtag.hashtag = hashtag;
          flavourHashtag.icecream_flavour_id = flavour.icecream_flavour_id;
          return flavourHashtag;
        });
        const flavourHashtagRepository = this.connection.getRepository(FlavourHashtag);
        const hashtagsToRemove = await flavourHashtagRepository.find({icecream_flavour_id: flavour.icecream_flavour_id});
        await flavourHashtagRepository.manager.remove(hashtagsToRemove);
        flavour.hashtags = await flavourHashtagRepository.manager.save(hashtagsObjects);
        return flavour;
      }
      flavour.hashtags = archivalHashtags;
      return flavour;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async removeFlavour(userId: number, userType: number, flavourData: RemoveFlavourDto) {
    const { flavourId, icecreamShopId } = flavourData;
    this.checkPermissions(userType, userId, icecreamShopId);
    const icecreamFlavourRepository = this.connection.getRepository(IcecreamFlavour);
    const icecreamFlavour = await icecreamFlavourRepository.findOne({icecream_flavour_id: flavourId, icecream_shop_id: icecreamShopId});
    if (!icecreamFlavour) {
      throw new HttpException(ErrorType.notFound, HttpStatus.NOT_FOUND);
    }
    try {
      return await icecreamFlavourRepository.remove(icecreamFlavour);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async listFlavours(id: number) {
    const icecreamFlavoursRepository = this.connection.getRepository(IcecreamFlavour);
    return await icecreamFlavoursRepository.find({ where: {icecream_shop_id: id}, relations: ['reactions', 'hashtags'] });
  }

  async getFlavour(id: number) {
    const icecreamFlavoursRepository = this.connection.getRepository(IcecreamFlavour);
    return await icecreamFlavoursRepository.findOne({ where: {icecream_flavour_id: id}, relations: ['reactions', 'hashtags'] });
  }

  async addReaction(userId: number, reactionData: AddReactionDto) {
    const flavourReactionRepository = this.connection.getRepository(FlavourReaction);
    const reaction = new FlavourReaction();
    reaction.icecream_flavour_id = reactionData.flavourId;
    reaction.reaction_type = reactionData.reactionType;
    reaction.user_id = userId;
    try {
      return await flavourReactionRepository.manager.save(reaction);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async removeReaction(userId: number, reactionData: RemoveReactionDto) {
    const flavourReactionRepository = this.connection.getRepository(FlavourReaction);
    const reaction = await flavourReactionRepository.findOne({user_id: userId, icecream_flavour_id: reactionData.flavourId});
    try {
      return await flavourReactionRepository.manager.remove(reaction);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

}
