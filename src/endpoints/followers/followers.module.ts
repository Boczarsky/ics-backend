import { Module } from '@nestjs/common';
import { FollowersController } from './followers.controller';
import { FollowersService } from './followers.service';

@Module({
  imports: [],
  controllers: [FollowersController],
  providers: [FollowersService],
})
export class FollowersModule {}
