import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';

@Injectable()
export class LocalizationsService {

  constructor(private readonly connection: Connection) {}

}
