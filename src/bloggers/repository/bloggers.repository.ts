import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Blog,
  BlogsDocument,
  BlogsModelType,
  BlogsViewModel,
} from '../schemas/blogs.schema';
import { CreateBlogDto } from '../dto/input-bloggers.dto';

@Injectable()
export class BloggersRepository {
  constructor(
    @InjectModel(Blog.name)
    private readonly blogModel: BlogsModelType,
  ) {}
  async saveBlogInDB(blog: BlogsDocument): Promise<BlogsViewModel> {
    return blog.save();
  }
  async updateBlogById(
    blogId: string,
    blog: CreateBlogDto,
    userId: string,
  ): Promise<BlogsDocument> {
    return this.blogModel.findOneAndUpdate(
      { id: blogId, 'blogOwnerInfo.userId': userId },
      {
        name: blog.name,
        description: blog.description,
        websiteUrl: blog.websiteUrl,
      },
    );
  }
  async deleteBlogById(id: string, userId: string) {
    return this.blogModel.deleteOne({ id, 'blogOwnerInfo.userId': userId });
  }
}
