import { Controller, Post, UseGuards, Request, HttpException, HttpStatus, Body } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../../entity/user.entity';
import { UserType } from '../../enums/user-type.enum';
import { ErrorType } from '../../enums/error-type.enum';
import { ListEmployeesDto } from './dto/list-employees.dto';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { EditEmployeeDto } from './dto/edit-employee.dto';
import { DeleteEmployeeDto } from './dto/delete-employee.dto';
import { AssignEmployeeDto } from './dto/assign-employee.dto';

@Controller('employees')
export class EmployeesController {

  constructor(private readonly employeesService: EmployeesService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('list')
  async listEmployees(@Request() req, @Body() filters: ListEmployeesDto) {
    const userData = req.user.userData;
    const { user_id, user_type } = userData;
    if (user_type !== UserType.manager) {
      throw new HttpException(ErrorType.accessDenied, HttpStatus.UNAUTHORIZED);
    }
    return await this.employeesService.listEmployees(+user_id, filters);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('create')
  async createEmployee(@Request() req, @Body() employeeData: CreateEmployeeDto) {
    const userData = req.user.userData;
    const { user_id, user_type } = userData;
    if (user_type !== UserType.manager) {
      throw new HttpException(ErrorType.accessDenied, HttpStatus.UNAUTHORIZED);
    }
    return await this.employeesService.createEmployee(+user_id, employeeData);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('edit')
  async editEmployee(@Request() req, @Body() employeeData: EditEmployeeDto) {
    const userData = req.user.userData;
    const { user_id, user_type } = userData;
    if (user_type !== UserType.manager) {
      throw new HttpException(ErrorType.accessDenied, HttpStatus.UNAUTHORIZED);
    }
    return await this.employeesService.editEmployee(+user_id, employeeData);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('delete')
  async deleteEmployee(@Request() req, @Body() employeeData: DeleteEmployeeDto) {
    const userData = req.user.userData;
    const { user_id, user_type } = userData;
    if (user_type !== UserType.manager) {
      throw new HttpException(ErrorType.accessDenied, HttpStatus.UNAUTHORIZED);
    }
    return await this.employeesService.deleteEmployee(+user_id, employeeData);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('assign')
  async assignEmployee(@Request() req, @Body() assignData: AssignEmployeeDto) {
    const userData = req.user.userData;
    const { user_id, user_type } = userData;
    if (user_type !== UserType.manager) {
      throw new HttpException(ErrorType.accessDenied, HttpStatus.UNAUTHORIZED);
    }
    return await this.employeesService.assignEmployee(+user_id, assignData);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('unassign')
  async unassignEmployee(@Request() req, @Body() assignData: AssignEmployeeDto) {
    const userData = req.user.userData;
    const { user_id, user_type } = userData;
    if (user_type !== UserType.manager) {
      throw new HttpException(ErrorType.accessDenied, HttpStatus.UNAUTHORIZED);
    }
    return await this.employeesService.unassignEmployee(+user_id, assignData);
  }

}
