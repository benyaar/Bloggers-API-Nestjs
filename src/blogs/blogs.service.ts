import { Injectable } from '@nestjs/common';
import { BlogsRepository } from './blogs.repository';
import { BlogInputDTO } from './dto/input-blog.dto';
import { BlogsViewType } from './schemas/blogs.schema';
import * as mongoose from 'mongoose';
import ObjectId = mongoose.Types.ObjectId;

@Injectable()
export class BlogsService {
  constructor(public blogsRepository: BlogsRepository) {}
  async createNewUser(blog: BlogInputDTO) {
    const newBlog = new BlogsViewType(
      new ObjectId().toString(),
      blog.name,
      blog.description,
      blog.websiteUrl,
      new Date(),
    );

    return this.blogsRepository.createNewUser(newBlog);
  }
  async updateBlogById(blogId: string, blog: BlogInputDTO) {
    return this.blogsRepository.updateBlogById(blogId, blog);
  }
  async deleteBlogById(id: string) {
    return this.blogsRepository.deleteBlogById(id);
  }
}
