import { Controller, Post, UseGuards, Request, HttpException, HttpStatus, Body } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/entity/user.entity';
import { UserType } from 'src/enums/user-type.enum';
import { ErrorType } from 'src/enums/error-type.enum';
import { ListEmployeesDto } from './dto/list_employees.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { CreateEmployeeDto } from './dto/create_employee.dto';
import { EditEmployeeDto } from './dto/edit_employee.dto';

@Controller('employees')
export class EmployeesController {

  constructor(private readonly employeesService: EmployeesService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('list')
  async listEmployees(@Request() req, @Body() filters: ListEmployeesDto) {
    const userData: User = req.user.userData;
    const { user_id, user_type } = userData;
    if (user_type !== UserType.manager) {
      throw new HttpException(ErrorType.accessDenied, HttpStatus.UNAUTHORIZED);
    }
    return await this.employeesService.listEmployees(+user_id, filters);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('create')
  async createEmployee(@Request() req, @Body() employeeData: CreateEmployeeDto) {
    const userData: User = req.user.userData;
    const { user_id, user_type } = userData;
    if (user_type !== UserType.manager) {
      throw new HttpException(ErrorType.accessDenied, HttpStatus.UNAUTHORIZED);
    }
    return await this.employeesService.createEmployee(+user_id, employeeData);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('edit')
  async editEmployee(@Request() req, @Body() employeeData: EditEmployeeDto) {
    const userData: User = req.user.userData;
    const { user_id, user_type } = userData;
    if (user_type !== UserType.manager) {
      throw new HttpException(ErrorType.accessDenied, HttpStatus.UNAUTHORIZED);
    }
    return await this.employeesService.editEmployee(+user_id, employeeData);
  }

}
