import { DevicesRepository } from '../repository/devices.repository';
import { DeviceType } from '../schemas/devices.schema';
import { verifyTokens } from '../../helpers/verifyTokens';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DevicesService {
  constructor(private readonly devicesRepository: DevicesRepository) {}
  async createNewUserSession(userSession: DeviceType) {
    return this.devicesRepository.createNewUserSession(userSession);
  }
  async findDevices(refreshToken: string) {
    const getDataFromToken = await verifyTokens(refreshToken);
    const userId = getDataFromToken.userId;
    return this.devicesRepository.findDevicesByUserId(userId);
  }
}
