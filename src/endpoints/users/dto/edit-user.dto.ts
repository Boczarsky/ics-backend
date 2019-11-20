import { IsNotEmpty, IsEmail, IsOptional, Length, ValidateIf, IsNumber } from 'class-validator';
import { UserType } from 'src/enums/user-type.enum';

export class EditUserDto {

  @IsNotEmpty()
  @IsNumber()
  user_id: number;

  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsNotEmpty()
  password: string;

  @IsOptional()
  @Length(1, 20)
  firstName: string;

  @IsOptional()
  @Length(1, 60)
  lastName: string;

  @ValidateIf(o => o.userType === UserType.employee)
  @IsNotEmpty()
  managerId: number;

  @IsOptional()
  @IsNotEmpty()
  userType: UserType;

}
