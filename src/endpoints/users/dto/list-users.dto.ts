import { IsNumber, IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { UserType } from '../../../enums/user-type.enum';

export class ListUsersDto {

  @IsOptional()
  @IsEnum(UserType, {each: true})
  userType: number[];

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  login: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  manager: string;

  @IsNumber()
  limit: number;

  @IsNumber()
  offset: number;
}
