import { IsIn } from 'class-validator';

export class LikeStatusDto {
  @IsIn(['None', 'Like', 'Dislike'])
  likeStatus: string;
}
