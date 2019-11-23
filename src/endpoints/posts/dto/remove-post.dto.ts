import { IsNumber } from 'class-validator';

export class RemovePostDto {

  @IsNumber()
  postId: number;

  @IsNumber()
  icecreamShopId: number;

}
