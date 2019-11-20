import { IsNotEmpty, IsEmail, IsOptional, Length } from 'class-validator';

export class CreateEmployeeDto {

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

}
