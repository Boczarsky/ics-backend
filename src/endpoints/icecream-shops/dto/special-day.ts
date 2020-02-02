import { IsString, ValidateIf, IsNumber } from 'class-validator';

export class SpecialDay {

  @IsNumber()
  closed: number;

  @IsString()
  from: string;

  @IsString()
  to: string;

  @ValidateIf(o => o.closed === 0)
  @IsString()
  hourFrom: string;

  @ValidateIf(o => o.closed === 0)
  @IsString()
  hourTo: string;

}
