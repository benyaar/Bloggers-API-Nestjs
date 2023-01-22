import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BanInfo, Blog, BlogsDocument } from '../schemas/blogs.schema';
import { Model } from 'mongoose';
import {
  PaginationBannedUserInputDTO,
  PaginationInputDTO,
  PaginationUserInputDTO,
} from '../../helpers/dto/helpers.dto';
import { PaginationHelp } from '../../helpers/pagination';
import { BanBlogDto } from '../dto/input-bloggers.dto';
import { UsersQueryRepository } from '../../users/repository/users.query-repository';

const options = {
  _id: 0,
  passwordHash: 0,
  postId: 0,
  emailConfirmation: 0,
  __v: 0,
  blogOwnerInfo: 0,
  banInfo: 0,
};
@Injectable()
export class BloggersQueryRepository {
  constructor(
    @InjectModel(Blog.name)
    public blogsModel: Model<BlogsDocument>,
    private pagination: PaginationHelp,
    private userQueryRepository: UsersQueryRepository,
  ) {}
  async findAllBlogs(
    paginationInputType: PaginationInputDTO,
    userId: string | null,
    superAdmin: string,
  ) {
    const findBlogs = await this.pagination.pagination(
      ' ',
      paginationInputType,
      this.blogsModel,
      userId,
      superAdmin,
    );

    return this.pagination.paginationResult(
      findBlogs.pageNumber,
      findBlogs.pageSize,
      findBlogs.getCountDocuments,
      findBlogs.findAndSorteDocuments,
    );
  }
  async findBlogById(id: string) {
    const blog = await this.blogsModel.findOne(
      { id: id, 'banInfo.isBanned': false },
      options,
    );
    if (!blog) throw new NotFoundException([]);
    return blog;
  }
  async findBlogByIdWithUserId(id: string) {
    return this.blogsModel.findOne({ id: id });
  }

  async banBlogById(id: string, banDto: BanBlogDto) {
    const findBlogById = await this.findBlogByIdWithUserId(id);
    if (!findBlogById) throw new NotFoundException([]);
    const banBlogInfo: BanInfo = banDto.isBanned
      ? {
          banDate: new Date(),
          isBanned: banDto.isBanned,
        }
      : { banDate: null, isBanned: banDto.isBanned };
    return this.blogsModel.updateOne(
      { id: id },
      { $set: { banInfo: banBlogInfo } },
    );
  }

  async getAllBannedUserForBlog(
    id: string,
    inputDTO: PaginationUserInputDTO,
    userId: string,
  ) {
    const findBlogById = await this.findBlogByIdWithUserId(id);
    if (!findBlogById) throw new NotFoundException([]);

    if (findBlogById.blogOwnerInfo.userId !== userId)
      throw new ForbiddenException([]);

    const findAllBannedUser = await this.pagination.getAllBannedUserForBlog(
      id,
      inputDTO,
      userId,
    );
    return this.pagination.paginationResult(
      findAllBannedUser.pageNumber,
      findAllBannedUser.pageSize,
      findAllBannedUser.getCountDocuments,
      findAllBannedUser.findAndSortedDocuments,
    );
  }
}
