import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UsersDocument, UserViewType } from '../schemas/user.schema';
import {
  RecoveryCode,
  RecoveryCodeDocument,
} from '../schemas/recovery-code.schema';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectModel(User.name)
    private readonly usersModel: Model<UsersDocument>,
    @InjectModel(RecoveryCode.name)
    private readonly recoveryCode: Model<RecoveryCodeDocument>,
  ) {}
  async createUser(newUser: UserViewType) {
    return this.usersModel.create(newUser);
  }
  async deleteUserById(id: string) {
    return this.usersModel.deleteOne({ id });
  }
  async saveUser(user: UsersDocument) {
    return user.save();
  }
  async passwordRecovery(code: RecoveryCode) {
    return this.recoveryCode.insertMany(code);
  }
}
