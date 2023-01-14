import { InjectModel } from '@nestjs/mongoose';
import { Device, DeviceDocument, DeviceType } from '../schemas/devices.schema';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';

const options = {
  _id: 0,
  __v: 0,
  userId: 0,
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
    return this.deviceModel.find({ userId: userId }, options);
  }
  async deleteUserSessions(userId, deviceId) {
    return this.deviceModel.deleteMany({ userId, deviceId: { $ne: deviceId } });
  }

  async findDeviceByDeviceId(id: string) {
    return this.deviceModel.findOne({ deviceId: id });
  }

  async deleteUserSessionById(userId: string, deviceId: string) {
    return this.deviceModel.deleteOne({ userId, deviceId });
  }
}
