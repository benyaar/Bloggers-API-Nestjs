import { IsEmail, Length } from 'class-validator';

export class InputUserDto {
  @Length(3, 10)
  login: string;
  @Length(6, 20)
  password: string;
  @IsEmail()
  email: string;
}
