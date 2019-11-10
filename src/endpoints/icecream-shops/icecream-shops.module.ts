import { Module } from '@nestjs/common';
import { IcecreamShopsController } from './icecream-shops.controller';
import { IcecreamShopsService } from './icecream-shops.service';

@Module({
  imports: [],
  controllers: [IcecreamShopsController],
  providers: [IcecreamShopsService],
})
export class IcecreamShopsModule {}
