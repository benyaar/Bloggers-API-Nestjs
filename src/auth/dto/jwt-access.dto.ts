import { IsNotEmpty } from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';

export class JwtAccessDto {
  @Transform(({ value }: TransformFnParams) => value?.trim())
  userId: string;
}
