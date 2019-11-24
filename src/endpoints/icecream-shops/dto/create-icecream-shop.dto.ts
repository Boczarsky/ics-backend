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
  @IsNotEmpty()
  logo_file_name: string;

  @IsOptional()
  @IsNotEmpty()
  photo_file_name: string;

  @IsOptional()
  @IsNumber()
  owner_id: number;

}
