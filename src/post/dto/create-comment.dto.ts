import { IsNotEmpty, Length } from 'class-validator';

export class CreateCommentDto {
  @IsNotEmpty()
  @Length(20, 300)
  content: string;
}
