import { IsNumber, IsNotEmpty, IsDateString } from 'class-validator';

export class CreatePromotionDto {

  @IsNotEmpty()
  info: string;

  @IsNumber()
  limit: number;

  @IsNotEmpty()
  prize: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

}
