import { IsIn, Length } from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';

export class BanUserDto {
  @IsIn([true, false])
  @Transform(({ value }: TransformFnParams) => value?.trim())
  isBanned: true;
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Length(20)
  banReason: string;
}
