import { Module } from '@nestjs/common';
import { FlavoursController } from './flavours.controller';
import { FlavoursService } from './flavours.service';

@Module({
  imports: [],
  controllers: [FlavoursController],
  providers: [FlavoursService],
})
export class FlavoursModule {}
