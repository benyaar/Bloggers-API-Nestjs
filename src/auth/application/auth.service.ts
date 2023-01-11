import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { UsersService } from '../../users/application/users.service';
import { JwtService } from '@nestjs/jwt';
import { RegistrationDto } from '../dto/registration.dto';
import * as bcrypt from 'bcrypt';
import { CreateNewPasswordDto } from '../dto/create-new-password.dto';
import { DevicesService } from '../../devices/application/devices.service';
import * as mongoose from 'mongoose';
import ObjectId = mongoose.Types.ObjectId;
import { DeviceType } from '../../devices/schemas/devices.schema';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly devicesService: DevicesService,
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

  async login(user: any, ip: string, title: string) {
    const deviceId = new ObjectId().toString();
    const payload = { userId: user.id, deviceId: deviceId };

    const jwtPair = {
      accessToken: this.jwtService.sign(payload, { expiresIn: '200s' }),
      refreshToken: this.jwtService.sign(payload, { expiresIn: '500s' }),
    };
    const userSession = new DeviceType(
      ip,
      title,
      new Date(),
      deviceId,
      user.id,
    );
    await this.devicesService.createNewUserSession(userSession);
    return jwtPair;
  }
  async emailResending(email: string) {
    const findUserByLoginOrEmail =
      await this.usersService.findUserByLoginOrEmail(email);
    if (
      findUserByLoginOrEmail === null ||
      !findUserByLoginOrEmail ||
      findUserByLoginOrEmail.emailConfirmation.isConfirmed
    ) {
      throw new BadRequestException([
        { message: 'something wrong', field: 'email' },
      ]);
    }
    await this.usersService.updateUserEmailConfirm(findUserByLoginOrEmail);
    return;
  }

  async registrationConfirm(code: string) {
    return this.usersService.findUserByConfirmCode(code);
  }

  async passwordRecovery(email: string) {
    return this.usersService.passwordRecovery(email);
  }

  async createNewPassword(password: CreateNewPasswordDto) {
    return this.usersService.createNewPassword(password);
  }
}
