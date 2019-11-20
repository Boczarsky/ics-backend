import { IsNumber, IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class ListEmployeesDto {

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  full_name: string;

  @IsOptional()
  @IsNumber({}, {each: true})
  icecream_shops: number[];

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  login: string;

  @IsNumber()
  limit: number;

  @IsNumber()
  offset: number;
}
