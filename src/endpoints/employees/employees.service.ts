import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Connection } from 'typeorm';
import { ListEmployeesDto } from './dto/list_employees.dto';
import { CreateEmployeeDto } from './dto/create_employee.dto';
import { User } from 'src/entity/user.entity';
import { UserType } from 'src/enums/user-type.enum';
import { PasswordHelper } from 'src/common/password-helper';
import { ErrorType } from 'src/enums/error-type.enum';
import { EditEmployeeDto } from './dto/edit_employee.dto';

@Injectable()
export class EmployeesService {

  passwordHelper = new PasswordHelper();

  constructor(private readonly connection: Connection) {}

  async listEmployees(manager_id: number, filters: ListEmployeesDto) {
    const {full_name, login, email, icecream_shops, limit, offset} = filters;
    const where = [];
    if (full_name) {
      where.push(`lower(full_name) LIKE '%${full_name.toLowerCase()}%'`);
    }
    if (login) {
      where.push(`lower(login) LIKE '%${login.toLowerCase()}%'`);
    }
    if (email) {
      where.push(`lower(email) LIKE '%${email.toLowerCase()}%'`);
    }
    if (icecream_shops) {
      where.push(`icecream_shop_id IN (${icecream_shops.join(',')})`);
    }
    const whereString = where.length ? `WHERE manager_id = '${manager_id}' AND ` + where.join(' AND ') : '';
    const query = `
      SELECT DISTINCT
        (SELECT COUNT(*) FROM search_user ${whereString}) as total,
        full_name,
        login,
        email,
        workplaces,
        user_id
        FROM search_employee ${whereString}
      LIMIT ${limit}
      OFFSET ${offset}
    `;
    try {
      const queryResult = await this.connection.query(query);
      return queryResult.reduce((prev, curr) => {
        const {total, ...result} = curr;
        if (!prev.total) {
          prev.total = total;
        }
        prev.result.push(result);
        return prev;
      }, { result: [], total: 0 });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async createEmployee(manager_id: number, employeeData: CreateEmployeeDto) {
    const userRepository = this.connection.getRepository(User);
    const user = await userRepository.findOne({login: employeeData.login});
    if (user) {
      throw new HttpException(ErrorType.loginExist, HttpStatus.FORBIDDEN);
    }
    const email = await userRepository.findOne({email: employeeData.email});
    if (email) {
      throw new HttpException(ErrorType.emailExist, HttpStatus.FORBIDDEN);
    }
    const newEmployee = new User();
    newEmployee.login = employeeData.login;
    newEmployee.email = employeeData.email;
    newEmployee.user_type = UserType.employee;
    newEmployee.manager_id = manager_id;
    newEmployee.password = this.passwordHelper.hash(employeeData.password);
    if (employeeData.firstName) {
      newEmployee.first_name = employeeData.firstName;
    }
    if (employeeData.lastName) {
      newEmployee.last_name = employeeData.lastName;
    }
    try {
      const {password, ...result } = await userRepository.manager.save(newEmployee);
      return result;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async editEmployee(manager_id: number, employeeData: EditEmployeeDto) {
    const userRepository = this.connection.getRepository(User);
    const employee = await userRepository.findOne({user_id: employeeData.user_id, manager_id});
    employee.password = this.passwordHelper.hash(employeeData.password);
    if (employeeData.firstName) {
      employee.first_name = employeeData.firstName;
    }
    if (employeeData.lastName) {
      employee.last_name = employeeData.lastName;
    }
    try {
      const {password, ...result } = await userRepository.manager.save(employee);
      return result;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

}
