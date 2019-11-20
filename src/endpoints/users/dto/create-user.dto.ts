import { UserType } from 'src/enums/user-type.enum';
import { IsNotEmpty, IsEnum, IsEmail, IsOptional, Length, ValidateIf } from 'class-validator';

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

  @IsEnum(UserType)
  userType: UserType;

  @ValidateIf(o => o.userType === UserType.employee)
  @IsNotEmpty()
  managerId: number;

}
