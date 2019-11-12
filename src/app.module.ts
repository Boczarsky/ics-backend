import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './endpoints/users/users.module';
import { IcecreamShopsModule } from './endpoints/icecream-shops/icecream-shops.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [TypeOrmModule.forRoot(), UsersModule, IcecreamShopsModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
