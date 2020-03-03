import { IsNumber, IsNotEmpty, IsEnum, IsArray, IsOptional } from 'class-validator';
import { FlavourStatus } from '../../../enums/flavour-status.enum';

export class EditFlavourDto {

  @IsNumber()
  flavourId: number;

  @IsNumber()
  icecreamShopId: number;

  @IsOptional()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsNotEmpty()
  composition: string;

  @IsOptional()
  @IsEnum(FlavourStatus)
  status: number;

  @IsOptional()
  @IsArray()
  hashtags: string[];

  @IsOptional()
  fileName: string;

}
