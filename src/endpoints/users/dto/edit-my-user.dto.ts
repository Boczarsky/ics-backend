import { IsOptional, IsNotEmpty, ValidateIf } from 'class-validator';

export class EditMyUserDto {

  @IsOptional()
  @IsNotEmpty()
  firstName: string;

  @IsOptional()
  @IsNotEmpty()
  lastName: string;

  @IsOptional()
  @IsNotEmpty()
  avatar: string;

  @ValidateIf(o => o.password)
  @IsNotEmpty()
  oldPassword: string;

  @IsOptional()
  @IsNotEmpty()
  password: string;

}
