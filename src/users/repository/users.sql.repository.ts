import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  BanInfo,
  EmailConfirmation,
  User,
  UsersDocument,
  UserViewType,
} from '../schemas/user.schema';
import {
  RecoveryCode,
  RecoveryCodeDocument,
} from '../schemas/recovery-code.schema';
import { DataSource } from 'typeorm';
import { format } from 'date-fns';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectModel(User.name)
    private readonly usersModel: Model<UsersDocument>,
    @InjectModel(RecoveryCode.name)
    private readonly recoveryCode: Model<RecoveryCodeDocument>,
    private dataSource: DataSource,
  ) {}
  async createUser(newUser: UserViewType) {
    const result = format(newUser.createdAt, "yyyy-MM-dd'T'HH:mm:ss");
    const expDate = format(
      newUser.emailConfirmation.expirationDate,
      "yyyy-MM-dd'T'HH:mm:ss",
    );
    await this.dataSource.query(
      `
    INSERT INTO public.user_entity( id, login, email, "passwordHash", "createdAt")
    VALUES ($1, $2, $3, $4, $5)
   `,
      [
        `${newUser.id}`,
        `${newUser.login}`,
        `${newUser.email}`,
        `${newUser.passwordHash}`,
        `${result}`,
      ],
    );
    await this.dataSource.query(
      `
    INSERT INTO public.ban_info_entity("isBanned", "userId")
    VALUES ($1, $2)
   `,
      [`${newUser.banInfo.isBanned}`, `${newUser.id}`],
    );
    await this.dataSource.query(
      `
    INSERT INTO public.email_confirmation_entity("confirmationCode", "expirationDate", "isConfirmed", "userId")
    VALUES ($1, $2, $3, $4)
   `,
      [
        `${newUser.emailConfirmation.confirmationCode}`,
        `${expDate}`,
        `${newUser.emailConfirmation.isConfirmed}`,
        `${newUser.id}`,
      ],
    );

    return true;
  }
  async deleteUserById(id: string) {
    return this.usersModel.deleteOne({ id });
  }
  async passwordRecovery(code: RecoveryCode) {
    return this.recoveryCode.insertMany(code);
  }

  async updateConfirmCode(user: UsersDocument) {
    return this.usersModel.updateOne(
      { id: user.id },
      { $set: { 'emailConfirmation.isConfirmed': true } },
    );
  }
  async updateUserHash(user: UsersDocument, hash: string) {
    return this.usersModel.updateOne(
      { id: user.id },
      { $set: { passwordHash: hash } },
    );
  }
  async updateEmailConfirmation(
    user: UsersDocument,
    newEmailConfirmation: EmailConfirmation,
  ) {
    return this.usersModel.updateOne(
      { id: user.id },
      { $set: { emailConfirmation: newEmailConfirmation } },
    );
  }

  async findUserById(id: string) {
    return this.usersModel.findOne({ id });
  }

  async banUserById(id: string, banInfo: BanInfo) {
    return this.usersModel.updateOne(
      { id: id },
      { $set: { banInfo: banInfo } },
    );
  }
}
