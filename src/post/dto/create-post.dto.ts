import { IsNotEmpty, Length } from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';

export class CreatePostDto {
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Length(1, 30)
  title: string;
  @Length(1, 100)
  @Transform(({ value }: TransformFnParams) => value?.trim())
  shortDescription: string;
  @Length(1, 1000)
  @Transform(({ value }: TransformFnParams) => value?.trim())
  content: string;
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Length(1, 30)
  blogId: string;
}
