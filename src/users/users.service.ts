import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { UserViewType } from './schemas/user.schema';
import { InputUserDto } from './dto/input-user.dto';
import * as mongoose from 'mongoose';
import ObjectId = mongoose.Types.ObjectId;

@Injectable()
export class UsersService {
  constructor(public usersRepository: UsersRepository) {}
  async createUser(inputUserDTO: InputUserDto) {
    const createNewUser = new UserViewType(
      new ObjectId().toString(),
      inputUserDTO.login,
      inputUserDTO.email,
      new Date(),
    );
    await this.usersRepository.createUser(createNewUser);
    return createNewUser;
  }
  async deleteUserById(id: string) {
    return this.usersRepository.deleteUserById(id);
  }
}
