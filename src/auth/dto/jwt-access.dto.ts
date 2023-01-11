import { IsNotEmpty } from 'class-validator';

export class JwtAccessDto {
  @IsNotEmpty()
  userId: string;
}
