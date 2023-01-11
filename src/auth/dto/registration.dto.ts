import { IsEmail, IsNotEmpty, Length } from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';

export class RegistrationDto {
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Length(3, 10)
  login: string;
  @Length(6, 20)
  @Transform(({ value }: TransformFnParams) => value?.trim())
  password: string;
  @IsEmail()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  email: string;
}
