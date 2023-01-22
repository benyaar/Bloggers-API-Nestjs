import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogsDocument } from '../schemas/blogs.schema';
import { Model } from 'mongoose';
import { PaginationInputDTO } from '../../helpers/dto/helpers.dto';
import { PaginationHelp } from '../../helpers/pagination';

const options = {
  _id: 0,
  passwordHash: 0,
  postId: 0,
  emailConfirmation: 0,
  __v: 0,
  blogOwnerInfo: 0,
};
@Injectable()
export class BloggersQueryRepository {
  constructor(
    @InjectModel(Blog.name)
    public blogsModel: Model<BlogsDocument>,
    private pagination: PaginationHelp,
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
    const blog = await this.blogsModel.findOne({ id: id }, options);
    if (!blog) throw new NotFoundException([]);
    return blog;
  }
}
