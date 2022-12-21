import { Length } from 'class-validator';

export class CreateUserDto {
  @Length(5, 10)
  id: string;
  @Length(3, 5)
  title: string;
  description: string;
}
