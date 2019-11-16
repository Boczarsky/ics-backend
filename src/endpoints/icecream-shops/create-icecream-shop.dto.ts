import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateIcecreamShopDto {

  @IsNotEmpty()
  @IsString()
  name: string;

}
