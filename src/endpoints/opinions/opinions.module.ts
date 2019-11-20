import { Module } from '@nestjs/common';
import { OpinionsController } from './opinions.controller';
import { OpinionsService } from './opinions.service';

@Module({
  imports: [],
  controllers: [OpinionsController],
  providers: [OpinionsService],
})
export class OpinionsModule {}
