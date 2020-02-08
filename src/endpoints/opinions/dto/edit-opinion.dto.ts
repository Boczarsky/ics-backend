import { IsNumber, IsNotEmpty, IsOptional } from 'class-validator';

export class EditOpinionDto {

  @IsNumber()
  opinionId: number;

  @IsOptional()
  @IsNotEmpty()
  content: string;

  @IsOptional()
  @IsNumber()
  grade: number;

}
