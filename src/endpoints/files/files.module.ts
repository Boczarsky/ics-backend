import { Module } from '@nestjs/common';
import { FilesController } from './files.controller';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../../auth/constants';

@Module({
  imports: [JwtModule.register({
    secret: jwtConstants.secret,
    })],
  controllers: [FilesController],
  providers: [],
})
export class FilesModule {}
