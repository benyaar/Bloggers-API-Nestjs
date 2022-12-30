import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersRepository } from '../repository/users.repository';
import { UserViewType } from '../schemas/user.schema';
import { InputUserDto } from '../dto/input-user.dto';
import * as mongoose from 'mongoose';
import ObjectId = mongoose.Types.ObjectId;
import * as bcrypt from 'bcrypt';
import { UsersQueryRepository } from '../repository/users.query-repository';

@Injectable()
export class UsersService {
  constructor(
    private usersRepository: UsersRepository,
    private usersQueryRepository: UsersQueryRepository,
  ) {}
  async createUser(inputUserDTO: InputUserDto) {
    const findUserByLogin = await this.usersQueryRepository.findUserByLogin(
      inputUserDTO.login,
    );
    if (findUserByLogin)
      throw new BadRequestException([
        { message: 'Invalid login', field: 'login' },
      ]);
    const findUserByEmail = await this.usersQueryRepository.findUserByEmail(
      inputUserDTO.email,
    );
    if (findUserByEmail)
      throw new BadRequestException([
        { message: 'Invalid email', field: 'email' },
      ]);

    const password = inputUserDTO.password;
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(password, salt);
    const createNewUser = new UserViewType(
      new ObjectId().toString(),
      inputUserDTO.login,
      inputUserDTO.email,
      hash,
      new Date(),
    );
    await this.usersRepository.createUser(createNewUser);
    const { passwordHash, ...userViewModal } = createNewUser;
    return userViewModal;
  }
  async deleteUserById(id: string) {
    return this.usersRepository.deleteUserById(id);
  }
  async findUserByLoginOrEmail(loginOrEmail: string) {
    return this.usersQueryRepository.findUserByLoginOrEmail(loginOrEmail);
  }
}
