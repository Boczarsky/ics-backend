import { IsNumber, IsEnum } from 'class-validator';
import { ReactionType } from 'src/enums/reaction-type.enum';

export class AddPostReactionDto {

  @IsNumber()
  postId: number;

  @IsEnum(ReactionType)
  reactionType: ReactionType;

}
