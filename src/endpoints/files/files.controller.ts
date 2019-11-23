import { Controller, UseGuards, Post, UseInterceptors, UploadedFile, Res, Get, Param, HttpException, HttpStatus } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { JwtService } from '@nestjs/jwt';
import * as uuid from 'uuid';
import { ErrorType } from 'src/enums/error-type.enum';

@Controller('files')
export class FilesController {

  constructor(private readonly jwtService: JwtService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('upload')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './files',
      filename: (req, file, callback) => {
        const fileExtName = extname(file.originalname);
        callback(null, `${uuid()}${fileExtName}`);
      },
    }),
  }))
  async uploadIcecreamShopPhoto(@UploadedFile() file) {
    return {fileName: file.filename};
  }

  @Get(':session/:fileName')
  async serveFile(@Param('fileName') fileName, @Param('session') session, @Res() res) {
    try {
      this.jwtService.verify(session);
    } catch (error) {
      throw new HttpException(ErrorType.accessDenied, HttpStatus.UNAUTHORIZED);
    }
    return res.sendFile(fileName, {root: './files'});
  }

}
