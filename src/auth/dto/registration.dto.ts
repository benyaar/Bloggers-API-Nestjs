import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class RegistrationDto {
  @IsNotEmpty()
  @Length(3, 10)
  login: string;
  @Length(6, 20)
  @IsNotEmpty()
  password: string;
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
