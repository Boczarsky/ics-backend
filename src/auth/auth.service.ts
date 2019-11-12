import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/endpoints/users/users.service';
import { PasswordHelper } from 'src/common/password-helper';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

  passwordHelper = new PasswordHelper();

  constructor(private readonly usersService: UsersService, private readonly jwtService: JwtService) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.getUser(username);
    if (user && this.passwordHelper.compare(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
