import { IsNumber, IsOptional, IsNotEmpty, ValidateNested } from 'class-validator';
import { LocalizationSearchDto } from './localization-search.dto';

export class ListIcecreamShopsDto {

  @IsNumber()
  limit: number;

  @IsNumber()
  offset: number;

  @IsOptional()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsNotEmpty()
  city: string;

  @IsOptional()
  @IsNotEmpty({each: true})
  hashtags: string[];

  @IsOptional()
  @ValidateNested()
  localization: LocalizationSearchDto;

}
