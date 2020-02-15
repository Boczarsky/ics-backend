import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { Connection } from 'typeorm';
import { User } from '../../entity/user.entity';
import { EditUserDto } from './dto/edit-user.dto';
import { PasswordHelper } from '../../common/password-helper';
import { ErrorType } from '../../enums/error-type.enum';
import { ListUsersDto } from './dto/list-users.dto';
import { EditMyUserDto } from './dto/edit-my-user.dto';
import { DeleteUserDto } from './dto/delete-user.dto';

@Injectable()
export class UsersService {

  passwordHelper = new PasswordHelper();

  constructor(private readonly connection: Connection) {}

  async createUser(userData: CreateUserDto) {
    const userRepository = this.connection.getRepository(User);
    const login = await userRepository.findOne({login: userData.login});
    if (login) {
      throw new HttpException(ErrorType.loginExist, HttpStatus.FORBIDDEN);
    }
    const email = await userRepository.findOne({email: userData.email});
    if (email) {
      throw new HttpException(ErrorType.emailExist, HttpStatus.FORBIDDEN);
    }
    const newUser = new User();
    if (userData.firstName) {
      newUser.first_name = userData.firstName;
    }
    if (userData.lastName) {
      newUser.last_name = userData.lastName;
    }
    if (userData.avatar) {
      newUser.avatar_file_name = userData.avatar;
    }
    newUser.login = userData.login;
    newUser.password = this.passwordHelper.hash(userData.password);
    newUser.email = userData.email;
    if (userData.managerId) {
      newUser.manager_id = userData.managerId;
    }
    newUser.user_type = userData.userType;
    try {
      const { password, ...result } = await userRepository.manager.save(newUser);
      return result;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async editUser(userData: EditUserDto) {
    const userRepository = this.connection.getRepository(User);
    const user = await userRepository.findOne({user_id: userData.userId});
    if (!user) {
      throw new HttpException(ErrorType.userNotFound, HttpStatus.NOT_FOUND);
    }
    if (userData.password) {
      user.password = this.passwordHelper.hash(userData.password);
    }
    if (userData.managerId) {
      user.manager_id = userData.managerId;
    }
    if (userData.userType) {
      user.user_type = userData.userType;
    }
    if (userData.email) {
      const email = await userRepository.findOne({email: userData.email});
      if (email) {
        throw new HttpException(ErrorType.emailExist, HttpStatus.FORBIDDEN);
      }
      user.email = userData.email;
    }
    if (userData.login) {
      const login = await userRepository.findOne({login: userData.login});
      if (login) {
        throw new HttpException(ErrorType.loginExist, HttpStatus.FORBIDDEN);
      }
      user.login = userData.login;
    }
    if (userData.firstName) {
      user.first_name = userData.firstName;
    }
    if (userData.lastName) {
      user.last_name = userData.lastName;
    }
    if (userData.avatar) {
      user.avatar_file_name = userData.avatar;
    }
    try {
      const result = await userRepository.manager.save(user);
      const { password, ...response } = result;
      return response;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async listUsers(filters: ListUsersDto) {
    const {fullName, manager, login, email, userType, limit, offset} = filters;
    const where = [];
    if (userType) {
      where.push(`user_type IN (${userType.join(',')})`);
    }
    if (fullName) {
      where.push(`lower(full_name) LIKE '%${fullName.toLowerCase()}%'`);
    }
    if (manager) {
      where.push(`lower(manager) LIKE '%${manager.toLowerCase()}%'`);
    }
    if (login) {
      where.push(`lower(login) LIKE '%${login.toLowerCase()}%'`);
    }
    if (email) {
      where.push(`lower(email) LIKE '%${email.toLowerCase()}%'`);
    }
    const whereString = where.length > 0 ? 'WHERE ' + where.join(' AND ') : '';
    const query = `
      SELECT
      (SELECT COUNT(*) FROM search_user ${whereString}) as total,
      * FROM search_user ${whereString}
      LIMIT ${limit}
      OFFSET ${offset}
    `;
    try {
      const queryResult = await this.connection.query(query);
      return queryResult.reduce((prev, curr) => {
        const {total, ...result} = curr;
        if (!prev.total) {
          prev.total = total;
        }
        prev.result.push(result);
        return prev;
      }, { result: [], total: 0 });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getMyUser(userId: number) {
    const userRepository = this.connection.getRepository(User);
    const user = await userRepository.findOne({
      where: { user_id: userId },
      relations: [
        'manager',
        'workplaces',
        'icecream_shops',
        'favorites',
        'opinion_comments',
        'opinions',
        'flavour_reactions',
        'post_reactions',
      ],
    });
    if (!user) {
      throw new HttpException(ErrorType.userNotFound, HttpStatus.NOT_FOUND);
    }
    const {
      password,
      manager,
      workplaces,
      icecream_shops,
      favorites,
      opinion_comments,
      opinions,
      flavour_reactions,
      post_reactions,
      ...result } = user;
    return {
      ...result,
      manager: manager && {
        manager_id: manager.user_id,
        first_name: manager.first_name,
        last_name: manager.last_name,
      },
      workplaces: workplaces.map(workplace => workplace.icecream_shop_id),
      icecream_shops: icecream_shops.map(icecreamShop => ({id: icecreamShop.icecream_shop_id, name: icecreamShop.name})),
      favorites: favorites.map(favorite => favorite.icecream_shop_id),
      opinion_comments: opinion_comments.map(comment => comment.opinion_comment_id),
      opinions: opinions.map(opinion => opinion.opinion_id),
      flavour_reactions: flavour_reactions.map(reaction => ({flavour_id: reaction.icecream_flavour_id, reactionType: reaction.reaction_type})),
      post_reactions: post_reactions.map(reaction => ({post_id: reaction.post_id, reactionType: reaction.reaction_type})),
    };
  }

  async editMyUser(userId: number, editData: EditMyUserDto) {
    const { oldPassword, firstName, lastName, avatar } = editData;
    const userRepository = this.connection.getRepository(User);
    const user = await userRepository.findOne({user_id: userId});
    if (!user) {
      throw new HttpException(ErrorType.userNotFound, HttpStatus.NOT_FOUND);
    }
    if (editData.password) {
      if (this.passwordHelper.compare(oldPassword, user.password)) {
        user.password = this.passwordHelper.hash(editData.password);
      } else {
        throw new HttpException(ErrorType.passwordMatchFailed, HttpStatus.BAD_REQUEST);
      }
    }
    user.first_name = firstName;
    user.last_name = lastName;
    if (avatar) {
      user.avatar_file_name = avatar;
    }
    try {
      const result = await userRepository.manager.save(user);
      const { password, ...response } = result;
      return response;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteUser(deleteData: DeleteUserDto) {
    const userRepository = this.connection.getRepository(User);
    const user = await userRepository.findOne({user_id: deleteData.userId});
    if (user) {
      try {
        const result = await userRepository.remove(user);
        const { password, ...response } = result;
        return response;
      } catch (error) {
        throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
    throw new HttpException(ErrorType.userNotFound, HttpStatus.NOT_FOUND);

  }

}
