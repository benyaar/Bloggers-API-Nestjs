import { InjectModel } from '@nestjs/mongoose';
import { User, UsersDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import { PaginationInputDTO } from '../helpers/dto/helpers.dto';
import { paginationResult } from '../helpers/pagination';

const options = {
  _id: 0,
  passwordHash: 0,
  postId: 0,
  emailConfirmation: 0,
  __v: 0,
};

export class QueryUsersRepository {
  constructor(
    @InjectModel(User.name) private readonly usersModel: Model<UsersDocument>,
  ) {}
  async findAllUsers(paginationInputDTO: PaginationInputDTO) {
    const searchNameTerm: string = paginationInputDTO.searchNameTerm;
    const sortBy: string = paginationInputDTO.sortBy;
    const pageNumber: number = +paginationInputDTO.pageNumber;
    const pageSize: number = +paginationInputDTO.pageSize;
    let sortDirection: any = paginationInputDTO.sortDirection;

    if (sortDirection !== ('asc' || 'desc')) sortDirection = 'desc';

    const findAndSortedUsers = await this.usersModel
      .find({ name: { $regex: searchNameTerm, $options: 'i' } }, options)
      .lean()
      .sort({ [sortBy]: sortDirection })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize);

    const getCountUsers = await this.usersModel.countDocuments({
      name: { $regex: searchNameTerm, $options: 'i' },
    });

    return paginationResult(
      pageNumber,
      pageSize,
      getCountUsers,
      findAndSortedUsers,
    );
  }
  async findUserById(id: string) {
    return this.usersModel.findOne({ id });
  }
}
