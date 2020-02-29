import { IcecreamShop } from './../../entity/icecream-shop.entity';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Connection } from 'typeorm';
import { ListEmployeesDto } from './dto/list-employees.dto';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { User } from '../../entity/user.entity';
import { UserType } from '../../enums/user-type.enum';
import { PasswordHelper } from '../../common/password-helper';
import { ErrorType } from '../../enums/error-type.enum';
import { EditEmployeeDto } from './dto/edit-employee.dto';
import { DeleteEmployeeDto } from './dto/delete-employee.dto';
import { AssignEmployeeDto } from './dto/assign-employee.dto';
import { Employment } from '../../entity/employment.entity';

@Injectable()
export class EmployeesService {

  passwordHelper = new PasswordHelper();

  constructor(private readonly connection: Connection) {}

  async listEmployees(manager_id: number, filters: ListEmployeesDto) {
    const {fullName, login, email, workplaces, workplaceName, limit, offset} = filters;
    const where = [];
    if (fullName) {
      where.push(`lower(full_name) LIKE '%${fullName.toLowerCase()}%'`);
    }
    if (login) {
      where.push(`lower(login) LIKE '%${login.toLowerCase()}%'`);
    }
    if (email) {
      where.push(`lower(email) LIKE '%${email.toLowerCase()}%'`);
    }
    if (workplaces && workplaces.length) {
      where.push(`workplace_id IN (${workplaces.join(',')})`);
    }
    if (workplaceName) {
      where.push(`lower(workplace_name) LIKE '%${workplaceName}%'`);
    }
    const whereString = where.length ? `WHERE manager_id = '${manager_id}' AND ` + where.join(' AND ') : `WHERE manager_id = '${manager_id}'`;
    const query = `
      WITH count_employee AS (SELECT DISTINCT user_id, manager_id FROM employee ${whereString})
      SELECT
        (select count(*) as count FROM count_employee) as total,
        user_id,
        first_name,
        last_name,
        login,
        email,
        full_name,
        json_agg(json_build_object('name', "workplace_name", 'id' , "workplace_id")) AS workplaces
        FROM employee ${whereString}
      GROUP BY
        user_id,
        first_name,
        last_name,
        login,
        email,
        full_name
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
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getShopsToAssign(managerId: number) {
    const icecreamShopsRepositiory = this.connection.getRepository(IcecreamShop);
    return await icecreamShopsRepositiory.find({
      select: ['icecream_shop_id', 'name', 'city', 'street'],
      where: {
        owner_id: managerId,
      },
    });
  }

  async createEmployee(managerId: number, employeeData: CreateEmployeeDto) {
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
    newEmployee.manager_id = managerId;
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
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async editEmployee(managerId: number, employeeData: EditEmployeeDto) {
    const userRepository = this.connection.getRepository(User);
    let employee: User;
    employee = await userRepository.findOne({user_id: employeeData.userId, manager_id: managerId});
    if (employeeData.password) {
      employee.password = this.passwordHelper.hash(employeeData.password);
    }
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
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteEmployee(managerId: number, employeeData: DeleteEmployeeDto) {
    const userRepository = this.connection.getRepository(User);
    const user = await userRepository.findOne({user_id: employeeData.userId, manager_id: managerId});
    if (user) {
      try {
        const result = await userRepository.remove(user);
        const { password, ...response } = result;
        return response;
      } catch (error) {
        throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
    throw new HttpException(ErrorType.userNotFound, HttpStatus.NOT_FOUND);
  }

  async assignEmployee(managerId: number, assignData: AssignEmployeeDto) {
    const userRepository = this.connection.getRepository(User);
    const employee = userRepository.findOne({user_id: assignData.employeeId, manager_id: managerId});
    if (!employee) {
      throw new HttpException(ErrorType.userNotFound, HttpStatus.NOT_FOUND);
    }
    const employmentRepository = this.connection.getRepository(Employment);
    const employment = new Employment();
    employment.user_id = assignData.employeeId;
    employment.icecream_shop_id = assignData.icecreamShopId;
    try {
      return await employmentRepository.manager.save(employment);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async unassignEmployee(managerId: number, assignData: AssignEmployeeDto) {
    const userRepository = this.connection.getRepository(User);
    const employee = userRepository.findOne({user_id: assignData.employeeId, manager_id: managerId});
    if (!employee) {
      throw new HttpException(ErrorType.userNotFound, HttpStatus.NOT_FOUND);
    }
    const employmentRepository = this.connection.getRepository(Employment);
    const employment = await employmentRepository.findOne({user_id: assignData.employeeId, icecream_shop_id: assignData.icecreamShopId});
    if (!employment) {
      throw new HttpException(ErrorType.notFound, HttpStatus.NOT_FOUND);
    }
    try {
      return await employmentRepository.manager.remove(employment);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

}
