import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';

@Injectable()
export class PromotionsService {

  constructor(private readonly connection: Connection) {}

}
