import { IsUrl, Length } from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';

export class CreateBlogDto {
  @Length(1, 15)
  @Transform(({ value }: TransformFnParams) => value?.trim())
  name: string;
  @Length(1, 500)
  @Transform(({ value }: TransformFnParams) => value?.trim())
  description: string;
  @IsUrl()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  websiteUrl: string;
}

export class PostInputDTO {
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Length(1, 30)
  title: string;
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Length(1, 100)
  shortDescription: string;
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Length(1, 1000)
  content: string;
}
