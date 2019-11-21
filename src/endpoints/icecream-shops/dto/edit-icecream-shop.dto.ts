import { IsNumber, IsNotEmpty, IsString, IsOptional, ValidateNested } from 'class-validator';
import { LocalizationDto } from './localization.dto';

export class EditIcecreamShopDto {

  @IsNumber()
  icecreamShopId: number;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  city: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  postal_code: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  street: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  description: string;

  @IsOptional()
  @IsNumber()
  photo_id: number;

  @IsOptional()
  @IsNumber()
  logo_id: number;

  @IsOptional()
  @ValidateNested()
  localization: LocalizationDto;

}
