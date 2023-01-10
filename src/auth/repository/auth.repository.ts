import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  TokenBlackList,
  TokenBlackListDocument,
} from '../schemas/token-blacklist.schema';

export class AuthRepository {
  constructor(
    @InjectModel(TokenBlackList.name)
    private readonly tokenBlackListModel: Model<TokenBlackListDocument>,
  ) {}
  addTokenInBlackList(token: string) {
    return this.tokenBlackListModel.insertMany({ refreshToken: token });
  }
  findTokenInBlackList(token: string) {
    return this.tokenBlackListModel.findOne({ refreshToken: token });
  }
}
