import { IsNumber } from 'class-validator';

export class LocalizationDto {

  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;

}
