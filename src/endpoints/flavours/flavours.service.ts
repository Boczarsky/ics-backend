import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';

@Injectable()
export class FlavoursService {

  constructor(private readonly connection: Connection) {}

}
