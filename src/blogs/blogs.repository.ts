import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Blog, BlogsDocument, BlogsViewType } from './schemas/blogs.schema';
import { BlogInputDTO } from './dto/input-blog.dto';

@Injectable()
export class BlogsRepository {
  constructor(
    @InjectModel(Blog.name)
    private readonly blogModel: Model<BlogsDocument>,
  ) {}
  async createNewUser(blog: BlogsViewType) {
    return this.blogModel.create(blog);
  }
  async updateBlogById(
    blogId: string,
    blog: BlogInputDTO,
  ): Promise<BlogsDocument> {
    return this.blogModel.findByIdAndUpdate(
      { id: blogId },
      {
        name: blog.name,
        description: blog.description,
        websiteUrl: blog.websiteUrl,
      },
    );
    // const blogResult = await this.blogModel.findOne({ _id: blogId });
    // const newBlog = new this.blogModel({ name: '123' });
    // newBlog.updateName('').save();
    // newBlog;
    // blogResult.save();
  }
  async deleteBlogById(id: string) {
    return this.blogModel.findByIdAndDelete({ id });
  }
}
