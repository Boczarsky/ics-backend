import { IsNumber } from 'class-validator';

export class LocalizationSearchDto {

  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;

  @IsNumber()
  radius: number;

}
