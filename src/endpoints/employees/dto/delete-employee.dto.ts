import { IsNumber } from 'class-validator';

export class DeleteEmployeeDto {

  @IsNumber()
  userId: number;

}
