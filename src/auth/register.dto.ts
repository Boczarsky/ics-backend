import { UserType } from '../enums/user-type.enum';
import { IsNotEmpty, IsEnum, IsEmail, ValidateIf, Equals, IsNotIn } from 'class-validator';
import { jwtConstants } from './constants';

export class RegisterDto {

  @IsNotEmpty()
  login: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @ValidateIf(o => o.userType === UserType.manager)
  @IsNotEmpty()
  firstName: string;

  @ValidateIf(o => o.userType === UserType.manager)
  @IsNotEmpty()
  lastName: string;

  @IsEnum(UserType)
  @IsNotIn([UserType.guest, UserType.employee])
  userType: UserType;

  @ValidateIf(o => o.userType === UserType.admin)
  @Equals(jwtConstants.adminSecret)
  adminSecret: string;

}
