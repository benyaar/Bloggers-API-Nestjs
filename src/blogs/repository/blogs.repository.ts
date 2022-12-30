import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Blog,
  BlogsDocument,
  BlogsModelType,
  BlogsViewModel,
} from '../schemas/blogs.schema';
import { BlogInputDTO } from '../dto/input-blog.dto';
import * as mongoose from 'mongoose';
import ObjectId = mongoose.Types.ObjectId;

@Injectable()
export class BlogsRepository {
  constructor(
    @InjectModel(Blog.name)
    private readonly blogModel: BlogsModelType,
  ) {}
  async saveBlogInDB(blog: BlogsDocument): Promise<BlogsViewModel> {
    return blog.save();
  }
  async updateBlogById(
    blogId: string,
    blog: BlogInputDTO,
  ): Promise<BlogsDocument> {
    return this.blogModel.findOneAndUpdate(
      { id: blogId },
      {
        name: blog.name,
        description: blog.description,
        websiteUrl: blog.websiteUrl,
      },
    );
  }
  async deleteBlogById(id: string) {
    return this.blogModel.deleteOne({ id });
  }
}
