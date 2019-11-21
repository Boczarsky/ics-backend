import { IsNotEmpty, IsEnum, IsNumber, IsArray } from 'class-validator';
import { FlavourStatus } from '../../../enums/flavour-status.enum';

export class AddFlavourDto {

  @IsNumber()
  icecreamShopId: number;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  composition: string;

  @IsEnum(FlavourStatus)
  status: number;

  @IsArray()
  hashtags: string[];

}
