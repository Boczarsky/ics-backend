import { IsNumber, IsOptional, IsNotEmpty } from 'class-validator';

export class ListIcecreamShopsDto {

  @IsNumber()
  limit: number;

  @IsNumber()
  offset: number;

  @IsOptional()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsNumber()
  managerId: number;

  @IsOptional()
  @IsNumber()
  employeeId: number;

  @IsOptional()
  @IsNotEmpty()
  city: string;

  @IsOptional()
  @IsNotEmpty({each: true})
  hashtags: string[];

}
