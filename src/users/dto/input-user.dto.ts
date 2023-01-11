import { IsEmail, IsNotEmpty, Length } from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';

export class InputUserDto {
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Length(3, 10)
  login: string;
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Length(6, 20)
  password: string;
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsEmail()
  email: string;
}
