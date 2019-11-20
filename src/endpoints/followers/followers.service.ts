import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';

@Injectable()
export class FollowersService {

  constructor(private readonly connection: Connection) {}

}
