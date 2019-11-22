import { IsNumber, IsEnum } from 'class-validator';
import { ReactionType } from 'src/enums/reaction-type.enum';

export class AddReactionDto {

  @IsNumber()
  flavourId: number;

  @IsEnum(ReactionType)
  reactionType: ReactionType;

}
