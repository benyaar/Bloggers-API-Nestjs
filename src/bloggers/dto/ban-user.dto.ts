import { IsBoolean, Length } from 'class-validator';

export class BanUserDto {
  @IsBoolean()
  isBanned: boolean;
  @Length(20)
  banReason: string;
  @Length(1)
  blogId: string;
}
