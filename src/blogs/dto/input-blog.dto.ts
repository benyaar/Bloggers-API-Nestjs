import { IsUrl, Length } from 'class-validator';

export class BlogInputDTO {
  @Length(1, 15)
  name: string;
  @Length(1, 500)
  description: string;
  @IsUrl()
  websiteUrl: string;
}
