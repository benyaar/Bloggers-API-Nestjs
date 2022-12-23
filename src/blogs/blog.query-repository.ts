import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogsDocument } from './schemas/blogs.schema';
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
@Injectable()
export class BlogQueryRepository {
  constructor(
    @InjectModel(Blog.name)
    public blogsModel: Model<BlogsDocument>,
  ) {}
  async findAllBlogs(paginationInputType: PaginationInputDTO) {
    const searchNameTerm: string = paginationInputType.searchNameTerm;
    const sortBy: string = paginationInputType.sortBy;
    const pageNumber: number = +paginationInputType.pageNumber;
    const pageSize: number = +paginationInputType.pageSize;
    let sortDirection: any = paginationInputType.sortDirection;

    if (sortDirection !== ('asc' || 'desc')) sortDirection = 'desc';

    const findAndSortedBlogs = await this.blogsModel
      .find({ name: { $regex: searchNameTerm, $options: 'i' } }, options)
      .lean()
      .sort({ [sortBy]: sortDirection })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize);

    const getCountBlogs = await this.blogsModel.countDocuments({
      name: { $regex: searchNameTerm, $options: 'i' },
    });

    return paginationResult(
      pageNumber,
      pageSize,
      getCountBlogs,
      findAndSortedBlogs,
    );
  }
  async findBlogById(id: string) {
    return this.blogsModel.findOne({ id: id }, options);
  }
}
