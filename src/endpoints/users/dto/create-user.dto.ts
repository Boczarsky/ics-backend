import { UserType } from 'src/enums/user-type.enum';
import { IsNotEmpty, IsEnum, IsEmail, IsOptional, Length } from 'class-validator';

export class CreateUserDto {

  @IsNotEmpty()
  login: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsOptional()
  @Length(1, 20)
  firstName: string;

  @IsOptional()
  @Length(1, 60)
  lastName: string;

  @IsOptional()
  @IsEnum(UserType)
  userType: UserType;

  @IsOptional()
  @IsNotEmpty()
  managerId: number;

}
