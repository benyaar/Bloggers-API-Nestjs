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
}
