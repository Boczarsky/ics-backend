import { IsNotEmpty, IsEnum, IsNumber, IsArray, IsOptional, IsString } from 'class-validator';
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

  @IsOptional()
  fileName: string;

}
