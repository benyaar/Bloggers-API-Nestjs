import { IsBoolean, IsIn, Length } from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';

export class BanUserDto {
  @IsBoolean()
  isBanned: boolean;
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Length(20)
  banReason: string;
}
