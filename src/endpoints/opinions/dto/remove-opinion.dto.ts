import { IsNumber } from 'class-validator';

export class RemoveOpinionDto {

  @IsNumber()
  opinionId: number;

}
