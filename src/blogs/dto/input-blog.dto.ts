import { IsUrl, Length } from 'class-validator';

export class BlogInputDTO {
  @Length(1, 15)
  name: string;
  @Length(1, 500)
  description: string;
  @IsUrl()
  websiteUrl: string;
}

export class PostInputDTO {
  @Length(1, 30)
  title: string;
  @Length(1, 1000)
  shortDescription: string;
  @Length(1, 1000)
  content: string;
}
