import { IsNumber } from 'class-validator';

export class RemoveReactionDto {

  @IsNumber()
  flavourId: number;

}
