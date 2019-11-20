import { Controller } from '@nestjs/common';
import { OpinionsService } from './opinions.service';

@Controller('opinions')
export class OpinionsController {

  constructor(private readonly opinionsService: OpinionsService) {}

}
