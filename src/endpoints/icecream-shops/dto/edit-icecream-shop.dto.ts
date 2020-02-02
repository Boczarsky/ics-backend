import { SpecialDay } from './special-day';
import { OpenDay } from './open-day';
import { IsNumber, IsNotEmpty, IsString, IsOptional, ValidateNested } from 'class-validator';

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
  postalCode: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  street: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  description: string;

  @IsOptional()
  logoFileName: string;

  @IsOptional()
  backgroundFileName: string;

  @IsOptional()
  googleMapLink: string;

  @IsOptional()
  @ValidateNested({each: true})
  openDays: OpenDay[];

  @IsOptional()
  @ValidateNested({each: true})
  specialDays: SpecialDay[];

}
