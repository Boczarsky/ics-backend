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
  @IsNotEmpty()
  logo_file_name: string;

  @IsOptional()
  @IsNotEmpty()
  photo_file_name: string;

  @IsOptional()
  @ValidateNested()
  localization: LocalizationDto;

}
