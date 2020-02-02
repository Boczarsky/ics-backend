import { IsNotEmpty, IsNumber, IsString, IsOptional, ValidateNested } from 'class-validator';
import { OpenDay } from './open-day';
import { SpecialDay } from './special-day';

export class CreateIcecreamShopDto {

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  city: string;

  @IsNotEmpty()
  @IsString()
  postalCode: string;

  @IsNotEmpty()
  @IsString()
  street: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  logoFileName: string;

  @IsOptional()
  @IsString()
  backgroundFileName: string;

  @IsOptional()
  @IsString()
  googleMapLink: string;

  @IsOptional()
  @IsNumber()
  ownerId: number;

  @ValidateNested({each: true})
  openDays: OpenDay[];

  @ValidateNested({each: true})
  specialDays: SpecialDay[];

}
