import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';

@Injectable()
export class FilesService {

  constructor(private readonly connection: Connection) {}

}
