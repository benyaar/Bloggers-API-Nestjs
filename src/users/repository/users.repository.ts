import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UsersDocument, UserViewType } from '../schemas/user.schema';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectModel(User.name)
    private readonly usersModel: Model<UsersDocument>,
  ) {}
  async createUser(newUser: UserViewType) {
    return this.usersModel.create(newUser);
  }
  async deleteUserById(id: string) {
    return this.usersModel.deleteOne({ id });
  }
}
