import { InjectModel } from '@nestjs/mongoose';
import { User, UsersDocument } from '../schemas/user.schema';
import { Model } from 'mongoose';
import { PaginationUserInputDTO } from '../../helpers/dto/helpers.dto';
import { PaginationHelp } from '../../helpers/pagination';
import {
  RecoveryCode,
  RecoveryCodeDocument,
} from '../schemas/recovery-code.schema';
import { Inject, Injectable } from '@nestjs/common';

const options = {
  _id: 0,
  passwordHash: 0,
  postId: 0,
  emailConfirmation: 0,
  __v: 0,
};

@Injectable()
export class UsersQueryRepository {
  constructor(
    @InjectModel(User.name) private readonly usersModel: Model<UsersDocument>,
    @InjectModel(RecoveryCode.name)
    private readonly recoveryCodeModel: Model<RecoveryCodeDocument>,
    private pagination: PaginationHelp,
  ) {}
  async findAllUsers(paginationInputDTO: PaginationUserInputDTO) {
    const searchLoginTerm: string = paginationInputDTO.searchLoginTerm;
    const searchEmailTerm: string = paginationInputDTO.searchEmailTerm;
    const sortBy: string = paginationInputDTO.sortBy;
    const pageNumber: number = +paginationInputDTO.pageNumber;
    const pageSize: number = +paginationInputDTO.pageSize;
    let sortDirection: any = paginationInputDTO.sortDirection;

    if (sortDirection !== ('asc' || 'desc')) sortDirection = 'desc';

    const findAndSortedUsers = await this.usersModel
      .find(
        {
          $or: [
            { login: { $regex: searchLoginTerm, $options: 'i' } },
            { email: { $regex: searchEmailTerm, $options: 'i' } },
          ],
        },
        options,
      )
      .lean()
      .sort({ [sortBy]: sortDirection })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize);

    const getCountUsers = await this.usersModel.countDocuments({
      $or: [
        { login: { $regex: searchLoginTerm, $options: 'i' } },
        { email: { $regex: searchEmailTerm, $options: 'i' } },
      ],
    });

    return this.pagination.paginationResult(
      pageNumber,
      pageSize,
      getCountUsers,
      findAndSortedUsers,
    );
  }
  async findUserById(id: string) {
    return this.usersModel.findOne({ id }, options);
  }
  async findUserByLogin(login: string) {
    return this.usersModel.findOne({ login }, options);
  }
  async findUserByEmail(email: string) {
    return this.usersModel.findOne({ email }, options);
  }
  async findUserByLoginOrEmail(loginOrEmail: string) {
    return this.usersModel.findOne({
      $or: [{ login: loginOrEmail }, { email: loginOrEmail }],
    });
  }
  async findUserByConfirmCode(code: string) {
    return this.usersModel.findOne({
      'emailConfirmation.confirmationCode': code,
    });
  }
  async findRecoveryCode(code: string) {
    return this.recoveryCodeModel.findOne({ recoveryCode: code });
  }
}
