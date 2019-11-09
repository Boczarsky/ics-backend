import { UserType } from 'src/enums/user-type.enum';
import { IsNotEmpty, IsEnum, IsEmail, ValidateIf, IsNumber, IsOptional, Length } from 'class-validator';

export class CreateUserDto {

  @IsEnum(UserType)
  userType: UserType;

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

  @ValidateIf(o => UserType.employee === o.userType)
  @IsNumber()
  icsId: number;

}
