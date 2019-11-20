import { Controller } from '@nestjs/common';
import { LocalizationsService } from './localizations.service';

@Controller('localizations')
export class LocalizationsController {

  constructor(private readonly localizationsService: LocalizationsService) {}

}
