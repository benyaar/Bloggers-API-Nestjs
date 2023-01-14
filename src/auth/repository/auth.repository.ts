import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  TokenBlackList,
  TokenBlackListDocument,
} from '../schemas/token-blacklist.schema';
import { Device, DeviceDocument } from '../../devices/schemas/devices.schema';

export class AuthRepository {
  constructor(
    @InjectModel(TokenBlackList.name)
    private readonly tokenBlackListModel: Model<TokenBlackListDocument>,
    @InjectModel(Device.name)
    private readonly deviceModel: Model<DeviceDocument>,
  ) {}
  async addTokenInBlackList(token: string) {
    return this.tokenBlackListModel.insertMany({ refreshToken: token });
  }
  async findTokenInBlackList(token: string) {
    return this.tokenBlackListModel.findOne({ refreshToken: token });
  }
  async updateUserSession(
    userId: string,
    ip: string,
    title: string,
    deviceId: string,
    date: Date,
  ) {
    return this.deviceModel.updateOne(
      { userId, deviceId },
      { $set: { lastActiveDate: date, ip, title } },
    );
  }
  async deleteUserSessionByDeviceId(userId: string, deviceId: string) {
    return this.deviceModel.deleteOne({ userId, deviceId });
  }
}
