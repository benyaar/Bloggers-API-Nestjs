import { InjectModel } from '@nestjs/mongoose';
import { Device, DeviceDocument, DeviceType } from '../schemas/devices.schema';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';

const options = {
  _id: 0,
  __v: 0,
};

@Injectable()
export class DevicesRepository {
  constructor(
    @InjectModel(Device.name)
    private readonly deviceModel: Model<DeviceDocument>,
  ) {}
  async createNewUserSession(userSession: DeviceType) {
    return this.deviceModel.insertMany(userSession);
  }
  async findDevicesByUserId(userId: string) {
    return this.deviceModel.find({ userId: userId });
  }
}
