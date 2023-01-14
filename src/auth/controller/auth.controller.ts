import {
  Controller,
  Post,
  Body,
  UseGuards,
  Res,
  HttpCode,
  Req,
  Get,
} from '@nestjs/common';
import { AuthService } from '../application/auth.service';
import { RegistrationDto } from '../dto/registration.dto';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { User } from '../decorator/request.decorator';
import { Request, Response } from 'express';
import { CreateNewPasswordDto } from '../dto/create-new-password.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { Cookies } from '../decorator/cookies.decorator';
import { IpDto } from '../dto/ip.dto';
import { Ip } from '../decorator/ip.decorator';

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
  async login(
    @User() user,
    @Req() req: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const ip = req.ip;
    const title = req.headers['user-agent'] || 'browser not found';
    const JwtPair = await this.authService.login(user.id, ip, title);
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

  @UseGuards(JwtAuthGuard)
  @Get('/me')
  async getSome(@User() user) {
    return { userId: user.id, login: user.login, email: user.email };
  }

  @UseGuards(JwtAuthGuard)
  @Post('/logout')
  async logout(@Cookies() refreshToken: string) {
    return this.authService.logoutUser(refreshToken);
  }

  @Post('/refresh-token')
  async updateToken(
    @Cookies() refreshToken: string,
    @Ip() ip: IpDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const updateToken = await this.authService.updateToken(refreshToken, ip);

    response.cookie('refreshToken', updateToken.refreshToken, {
      httpOnly: true,
      secure: true,
    });
    return updateToken;
  }
}
