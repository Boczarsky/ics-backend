import { IsNumber, IsNotEmpty } from 'class-validator';

export class AddOpinionDto {

  @IsNumber()
  icecreamShopId: number;

  @IsNotEmpty()
  content: string;

  @IsNumber()
  grade: number;

}
