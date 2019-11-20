import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';

@Injectable()
export class PostsService {

  constructor(private readonly connection: Connection) {}

}
