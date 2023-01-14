import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Blog, BlogsDocument } from '../blogs/schemas/blogs.schema';
import { Post, PostsDocument } from '../post/schemas/post.schema';
import { User, UsersDocument } from '../users/schemas/user.schema';
import { Comment, CommentsDocument } from '../comments/schema/comments.schema';
import { Attempt, AttemptsDocument } from '../auth/schemas/attempts.schema';
import {
  TokenBlackList,
  TokenBlackListDocument,
} from '../auth/schemas/token-blacklist.schema';
import { Device, DeviceDocument } from '../devices/schemas/devices.schema';

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
    @InjectModel(Attempt.name)
    private readonly attemptModel: Model<AttemptsDocument>,
    @InjectModel(TokenBlackList.name)
    private readonly tokenBlackListModel: Model<TokenBlackListDocument>,
    @InjectModel(Device.name)
    private readonly deviceModel: Model<DeviceDocument>,
  ) {}
  async deleteAll() {
    await this.blogsModel.deleteMany();
    await this.postsModel.deleteMany();
    await this.usersModel.deleteMany();
    await this.commentsModel.deleteMany();
    await this.attemptModel.deleteMany();
    await this.tokenBlackListModel.deleteMany();
    await this.deviceModel.deleteMany();
    return;
  }
}
