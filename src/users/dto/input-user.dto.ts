import { IsEmail, Length, Matches } from 'class-validator';

export class InputUserDto {
  @Matches('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$\n')
  @Length(3, 10)
  login: string;
  @Length(6, 20)
  password: string;
  @IsEmail()
  email: string;
}
