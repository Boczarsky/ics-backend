import { IsNumber } from 'class-validator';

export class DeleteUserDto {

  @IsNumber()
  userId: number;

}
