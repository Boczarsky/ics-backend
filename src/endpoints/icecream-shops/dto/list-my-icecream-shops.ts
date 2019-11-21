import { IsNumber, IsOptional, IsNotEmpty } from 'class-validator';

export class ListMyIcecreamShopsDto {

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

}
