import { IsNumber, IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { UserType } from 'src/enums/user-type.enum';

export class ListUsersDto {

  @IsOptional()
  @IsEnum(UserType)
  user_type: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  search: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  manager: string;

  @IsNumber()
  limit: number;

  @IsNumber()
  offset: number;
}
