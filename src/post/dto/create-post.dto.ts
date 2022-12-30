import { Length } from 'class-validator';

export class CreatePostDto {
  @Length(1, 30)
  title: string;
  @Length(1, 1000)
  shortDescription: string;
  @Length(1, 1000)
  content: string;
  blogId: string;
}
