import { IsNotEmpty, Length } from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';

export class CreateNewPasswordDto {
  @Length(6, 20)
  @Transform(({ value }: TransformFnParams) => value?.trim())
  newPassword: string;
  @Transform(({ value }: TransformFnParams) => value?.trim())
  recoveryCode: string;
}
