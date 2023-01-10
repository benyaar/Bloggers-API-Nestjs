import { Length } from 'class-validator';

export class CreateNewPasswordDto {
  @Length(6, 20)
  newPassword: string;
  recoveryCode: string;
}
