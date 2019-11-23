import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PasswordHelper } from '../common/password-helper';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './register.dto';
import { Connection } from 'typeorm';
import { User } from '../entity/user.entity';

@Injectable()
export class AuthService {

  passwordHelper = new PasswordHelper();

  constructor(private readonly connection: Connection, private readonly jwtService: JwtService) {}

  async validateUser(login: string, pass: string) {
    const userRepositiory = this.connection.getRepository(User);
    let user;
    try {
      user = await userRepositiory.findOne({where: [{login}, {email: login}]});
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    if (user && this.passwordHelper.compare(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  login(user: any) {
    const payload = { userData: user };
    return {
      access_token: this.jwtService.sign(payload, {expiresIn: '1d'}),
    };
  }

  async register(registerData: RegisterDto) {
    const userRepositiory = this.connection.getRepository(User);
    const login = await userRepositiory.findOne({login: registerData.login});
    if (login) {
      throw new HttpException('LoginExist', HttpStatus.FORBIDDEN);
    }
    const email = await userRepositiory.findOne({email: registerData.email});
    if (email) {
      throw new HttpException('EmailExist', HttpStatus.FORBIDDEN);
    }
    const newUser = new User();
    newUser.user_type = registerData.userType;
    newUser.password = this.passwordHelper.hash(registerData.password);
    newUser.login = registerData.login;
    newUser.email = registerData.email;
    try {
      const {password, ...result} = await userRepositiory.manager.save(newUser);
      return result;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
