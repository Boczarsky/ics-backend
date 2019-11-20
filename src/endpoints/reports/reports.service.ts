import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';

@Injectable()
export class ReportsService {

  constructor(private readonly connection: Connection) {}

}
