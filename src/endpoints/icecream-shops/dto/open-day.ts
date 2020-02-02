import { IsNumber, IsString } from 'class-validator';

export class OpenDay {

  @IsNumber()
  from: number;

  @IsNumber()
  to: number;

  @IsString()
  hourFrom: string;

  @IsString()
  hourTo: string;

}
