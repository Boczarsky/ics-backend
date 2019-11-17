import { IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';

export class CreateIcecreamShopDto {

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsNumber()
  owner_id: number;

}
