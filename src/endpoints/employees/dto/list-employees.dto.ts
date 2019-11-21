import { IsNumber, IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class ListEmployeesDto {

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsOptional()
  @IsNumber({}, {each: true})
  workplaces: number[];

  @IsOptional()
  @IsNotEmpty()
  workplaceName: string;

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
