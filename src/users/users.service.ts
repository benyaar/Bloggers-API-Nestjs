import { Injectable } from '@nestjs/common';
import { UsersType } from './users.model';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(public usersRepository: UsersRepository) {}
  async createUser(user: UsersType) {
    const createNewUser = new UsersType(user.id, user.title, user.description);
    return this.usersRepository.createUser(createNewUser);
  }
}
