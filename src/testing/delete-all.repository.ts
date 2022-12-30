import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Blog, BlogsDocument } from '../blogs/schemas/blogs.schema';
import { Post, PostsDocument } from '../post/schemas/post.schema';
import { User, UsersDocument } from '../users/schemas/user.schema';
import { Comment, CommentsDocument } from '../comments/schema/comments.schema';

@Injectable()
export class DeleteAllRepository {
  constructor(
    @InjectModel(Post.name)
    private readonly postsModel: Model<PostsDocument>,
    @InjectModel(Blog.name)
    private readonly blogsModel: Model<BlogsDocument>,
    @InjectModel(User.name)
    private readonly usersModel: Model<UsersDocument>,
    @InjectModel(Comment.name)
    private readonly commentsModel: Model<CommentsDocument>,
  ) {}
  async deleteAll() {
    await this.blogsModel.deleteMany();
    await this.postsModel.deleteMany();
    await this.usersModel.deleteMany();
    await this.commentsModel.deleteMany();
    return;
  }
}
