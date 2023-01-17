import { IsIn, Length } from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';

export class BanUserDto {
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Length(2)
  isBanned: boolean;
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Length(20)
  banReason: string;
}
