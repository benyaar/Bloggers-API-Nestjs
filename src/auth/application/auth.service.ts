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
import { JWT } from '../constants';
import { AuthRepository } from '../repository/auth.repository';
import { IpDto } from '../dto/ip.dto';
import jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly devicesService: DevicesService,
    private readonly authRepository: AuthRepository,
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

  async login(userId: any, ip: string, title: string) {
    const deviceId = new ObjectId().toString();
    const payload = { userId: userId, deviceId: deviceId };

    const jwtPair = {
      accessToken: this.jwtService.sign(payload, {
        expiresIn: '200s',
        secret: JWT.jwt_secret,
      }),
      refreshToken: this.jwtService.sign(payload, {
        expiresIn: '500s',
        secret: JWT.jwt_secret,
      }),
    };
    const userSession = new DeviceType(ip, title, new Date(), deviceId, userId);
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

  async logoutUser(refreshToken: string) {
    return this.authRepository.addTokenInBlackList(refreshToken);
  }
  async verifyToken(token: string) {
    try {
      const result: any = jwt.verify(token, JWT.jwt_secret);
      return result.userId;
    } catch (error) {
      return null;
    }
  }

  async updateToken(refreshToken: string, ip: IpDto) {
    const verifyToken = await this.verifyToken(refreshToken);
    if (!verifyToken) throw new UnauthorizedException([]);

    const createNewTokenPair = await this.login(verifyToken, ip.ip, ip.title);

    await this.authRepository.addTokenInBlackList(refreshToken);
    return createNewTokenPair;
  }
}
