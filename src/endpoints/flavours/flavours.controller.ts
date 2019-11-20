import { Controller } from '@nestjs/common';
import { FlavoursService } from './flavours.service';

@Controller('flavours')
export class FlavoursController {

  constructor(private readonly flavoursService: FlavoursService) {}

}
