import { IsNotEmpty, IsEmail, IsOptional, Length, ValidateIf, IsNumber } from 'class-validator';
import { UserType } from 'src/enums/user-type.enum';

export class UpdateUserDto {

  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsNotEmpty()
  password: string;

  @ValidateIf(o => o.password)
  @IsNotEmpty()
  oldPassword: string;

  @IsOptional()
  @Length(1, 20)
  firstName: string;

  @IsOptional()
  @Length(1, 60)
  lastName: string;

  @IsOptional()
  @IsNotEmpty()
  managerId: number;

  @IsOptional()
  @IsNotEmpty()
  userType: UserType;

}
