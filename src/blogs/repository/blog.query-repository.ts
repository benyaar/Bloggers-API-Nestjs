import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogsDocument } from '../schemas/blogs.schema';
import { Model } from 'mongoose';
import { PaginationInputDTO } from '../../helpers/dto/helpers.dto';
import { pagination, paginationResult } from '../../helpers/pagination';

const options = {
  _id: 0,
  passwordHash: 0,
  postId: 0,
  emailConfirmation: 0,
  __v: 0,
};
@Injectable()
export class BlogQueryRepository {
  constructor(
    @InjectModel(Blog.name)
    public blogsModel: Model<BlogsDocument>,
  ) {}
  async findAllBlogs(paginationInputType: PaginationInputDTO) {
    return pagination(' ', paginationInputType, this.blogsModel);
  }
  async findBlogById(id: string) {
    const blog = await this.blogsModel.findOne({ id: id }, options);
    if (!blog) throw new NotFoundException([]);
    return blog;
  }
}
