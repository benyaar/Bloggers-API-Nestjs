import { IsNotEmpty, Length } from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty()
  @Length(1, 30)
  title: string;
  @Length(1, 1000)
  @IsNotEmpty()
  shortDescription: string;
  @Length(1, 1000)
  @IsNotEmpty()
  content: string;
  blogId: string;
}
