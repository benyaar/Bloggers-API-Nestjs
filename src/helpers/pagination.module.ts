import { Module } from '@nestjs/common';

import { PaginationHelp } from './pagination';
import { MongooseModule } from '@nestjs/mongoose';
import {
  LikeStatus,
  LikeStatusSchema,
} from '../post/schemas/like-status.schema';
import {
  BannedUser,
  BannedUserSchema,
} from '../bloggers/schemas/banned-User.schema';
import { Post, PostSchema } from '../post/schemas/post.schema';
import { Blog, BlogSchema } from '../bloggers/schemas/blogs.schema';
import { Comment, CommentsSchema } from '../comments/schema/comments.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: LikeStatus.name, schema: LikeStatusSchema },
      { name: BannedUser.name, schema: BannedUserSchema },
      { name: Post.name, schema: PostSchema },
      { name: Blog.name, schema: BlogSchema },
      { name: Comment.name, schema: CommentsSchema },
    ]),
  ],
  providers: [PaginationHelp],
  exports: [PaginationHelp],
})
export class PaginationModule {}
