import { Length } from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsMongoIdBlogDecorator } from '../decorators/is-mongoId-blog.decorator';

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
  //@IsMongoIdBlogDecorator()
  //@Transform(({ value }: TransformFnParams) => value?.trim())
  //@Length(1, 30)
  //blogId: string;
}

export class CreatePostDtoWithUserId {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  userId: string;
}
