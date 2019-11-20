import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';

@Injectable()
export class OpinionsService {

  constructor(private readonly connection: Connection) {}

}
