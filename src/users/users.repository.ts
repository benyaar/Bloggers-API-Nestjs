import { Injectable } from '@nestjs/common';
import { UsersType } from './users.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectModel(UsersType.name)
    private readonly usersModel: Model<UsersType>,
  ) {}
  async createUser(user: UsersType) {
    const count = await this.usersModel.countDocuments({});
    console.log(count);
    return this.usersModel.create({ ...user });
  }
}
