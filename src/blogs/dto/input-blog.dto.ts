import { IsNotEmpty, IsUrl, Length } from 'class-validator';

export class BlogInputDTO {
  @Length(1, 15)
  @IsNotEmpty()
  name: string;
  @Length(1, 500)
  @IsNotEmpty()
  description: string;
  @IsUrl()
  @IsNotEmpty()
  websiteUrl: string;
}

export class PostInputDTO {
  @IsNotEmpty()
  @Length(1, 30)
  title: string;
  @IsNotEmpty()
  @Length(1, 1000)
  shortDescription: string;
  @IsNotEmpty()
  @Length(1, 1000)
  content: string;
}
