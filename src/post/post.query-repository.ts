import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogsDocument } from '../blogs/schemas/blogs.schema';
import { Model } from 'mongoose';
import { Post, PostsDocument } from './schemas/post.schema';

export class PostQueryRepository {
  constructor(
    @InjectModel(Post.name)
    private readonly postsModel: Model<PostsDocument>,
    @InjectModel(Blog.name)
    private readonly blogsModel: Model<BlogsDocument>,
  ) {}
  async findBlogById(blogId: string) {
    return this.blogsModel.findOne({ id: blogId });
  }
}
