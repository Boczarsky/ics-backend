import { IsNumber, IsNotEmpty, IsOptional } from 'class-validator';

export class editOpinionDto {

  @IsNumber()
  opinionId: number;

  @IsNumber()
  icecreamShopId: number;

  @IsNumber()
  userId: number;

  @IsOptional()
  @IsNotEmpty()
  content: string;

  @IsOptional()
  @IsNumber()
  grade: number;

}
