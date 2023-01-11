import { IsNotEmpty, Length } from 'class-validator';

export class CreateNewPasswordDto {
  @Length(6, 20)
  @IsNotEmpty()
  newPassword: string;
  @IsNotEmpty()
  recoveryCode: string;
}
