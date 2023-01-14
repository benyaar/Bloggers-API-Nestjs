import { DevicesService } from '../application/devices.service';
import { Controller, Delete, Get, HttpCode, Param, Req } from '@nestjs/common';
import { Cookies } from '../../auth/decorator/cookies.decorator';

@Controller('devices')
export class DevicesController {
  constructor(private readonly devicesService: DevicesService) {}

  @Get('/')
  async findDevices(@Cookies() cookies) {
    return this.devicesService.findDevices(cookies.refreshToken);
  }

  @Delete('/')
  @HttpCode(204)
  deleteUserSessions(@Cookies() cookies) {
    return this.devicesService.deleteUserSessions(cookies.refreshToken);
  }

  @Delete('/:id')
  @HttpCode(204)
  deleteUserSessionById(@Cookies() cookies, @Param('id') id: string) {
    return this.devicesService.deleteUserSessionById(cookies.refreshToken, id);
  }
}
