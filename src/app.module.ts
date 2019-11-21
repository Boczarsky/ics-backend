import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './endpoints/users/users.module';
import { IcecreamShopsModule } from './endpoints/icecream-shops/icecream-shops.module';
import { AuthModule } from './auth/auth.module';
import { EmployeesModule } from './endpoints/employees/employees.module';
import { FlavoursModule } from './endpoints/flavours/flavours.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    UsersModule,
    IcecreamShopsModule,
    AuthModule,
    EmployeesModule,
    FlavoursModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
