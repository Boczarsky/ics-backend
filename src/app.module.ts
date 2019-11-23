import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './endpoints/users/users.module';
import { IcecreamShopsModule } from './endpoints/icecream-shops/icecream-shops.module';
import { AuthModule } from './auth/auth.module';
import { EmployeesModule } from './endpoints/employees/employees.module';
import { FlavoursModule } from './endpoints/flavours/flavours.module';
import { OpinionsModule } from './endpoints/opinions/opinions.module';
import { PostsModule } from './endpoints/posts/posts.module';
import { PromotionsModule } from './endpoints/promotions/promotions.module';
import { FilesModule } from './endpoints/files/files.module';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    UsersModule,
    IcecreamShopsModule,
    AuthModule,
    EmployeesModule,
    FlavoursModule,
    OpinionsModule,
    PostsModule,
    PromotionsModule,
    FilesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
