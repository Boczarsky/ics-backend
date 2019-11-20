import { IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';

export class CreateIcecreamShopDto {

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  city: string;

  @IsNotEmpty()
  @IsString()
  postal_code: string;

  @IsNotEmpty()
  @IsString()
  street: string;

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
  @IsNumber()
  owner_id: number;

}
