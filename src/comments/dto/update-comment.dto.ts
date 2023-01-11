import { Length } from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';

export class UpdateCommentDto {
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Length(20, 300)
  content: string;
}
