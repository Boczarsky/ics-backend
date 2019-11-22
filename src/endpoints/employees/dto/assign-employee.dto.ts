import { IsNumber } from 'class-validator';

export class AssignEmployeeDto {

  @IsNumber()
  employeeId: number;

  @IsNumber()
  icecreamShopId: number;

}
