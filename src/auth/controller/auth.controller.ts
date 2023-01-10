import {
  Controller,
  Post,
  Body,
  UseGuards,
  Res,
  HttpCode,
} from '@nestjs/common';
import { AuthService } from '../application/auth.service';
import { RegistrationDto } from '../dto/registration.dto';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { User } from '../decorator/request.decorator';
import { Response } from 'express';
import { CreateNewPasswordDto } from '../dto/create-new-password.dto';

//
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('registration')
  @HttpCode(204)
  async registration(@Body() registrationDto: RegistrationDto) {
    return this.authService.registration(registrationDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(200)
  async login(@User() user, @Res({ passthrough: true }) response: Response) {
    const JwtPair = await this.authService.login(user);
    response.cookie('refreshToken', JwtPair.refreshToken, {
      httpOnly: true,
      secure: true,
    });
    return JwtPair;
  }

  @Post('registration-email-resending')
  @HttpCode(204)
  async emailResending(@Body('email') email: string) {
    await this.authService.emailResending(email);
    return;
  }

  @Post('registration-confirmation')
  @HttpCode(204)
  async registrationConfirm(@Body('code') code: string) {
    return this.authService.registrationConfirm(code);
  }

  @Post('password-recovery')
  @HttpCode(204)
  async passwordRecovery(@Body('email') email: string) {
    return this.authService.passwordRecovery(email);
  }

  @Post('new-password')
  @HttpCode(204)
  async createNewPassword(@Body() newPasswordDto: CreateNewPasswordDto) {
    return this.authService.createNewPassword(newPasswordDto);
  }

  // @Post('refresh-token')
  // async updateRefreshToken();
}
