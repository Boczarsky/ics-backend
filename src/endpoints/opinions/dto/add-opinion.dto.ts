import { IsNumber, IsNotEmpty } from 'class-validator';

export class AddOpinionDto {

  @IsNumber()
  icecreamShopId: number;

  @IsNumber()
  userId: number;

  @IsNotEmpty()
  content: string;

  @IsNumber()
  grade: number;

}
