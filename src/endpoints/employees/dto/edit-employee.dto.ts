import { IsNotEmpty, IsOptional, Length, IsNumber } from 'class-validator';

export class EditEmployeeDto {

  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsOptional()
  @IsNotEmpty()
  password: string;

  @IsOptional()
  @Length(1, 20)
  firstName: string;

  @IsOptional()
  @Length(1, 60)
  lastName: string;

}
