import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { UsersService } from '../../users/application/users.service';
import { JwtService } from '@nestjs/jwt';
import { RegistrationDto } from '../dto/registration.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}
  async registration(registrationDto: RegistrationDto) {
    return this.usersService.createUser(registrationDto);
  }
  async validateUser(loginOrEmail: string, pass: string) {
    const findUserByLoginOrEmail =
      await this.usersService.findUserByLoginOrEmail(loginOrEmail);
    if (!findUserByLoginOrEmail) throw new UnauthorizedException([]);
    const passwordSalt = findUserByLoginOrEmail.passwordHash.slice(0, 29);
    const hash = await bcrypt.hash(pass, passwordSalt);
    if (findUserByLoginOrEmail.passwordHash !== hash)
      throw new UnauthorizedException([]);
    return findUserByLoginOrEmail;
  }

  async login(user: any) {
    const payload = { userId: user.id };
    return {
      accessToken: this.jwtService.sign(payload, { expiresIn: '200s' }),
      refreshToken: this.jwtService.sign(payload, { expiresIn: '500s' }),
    };
  }
  async emailResending(email: string) {
    const findUserByLoginOrEmail =
      await this.usersService.findUserByLoginOrEmail(email);
    if (
      findUserByLoginOrEmail === null ||
      !findUserByLoginOrEmail ||
      findUserByLoginOrEmail.emailConfirmation.isConfirmed
    ) {
      throw new NotFoundException([]);
    }
    await this.usersService.updateUserEmailConfirm(findUserByLoginOrEmail);
    return;
  }
}
