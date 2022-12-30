import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from '../post/schemas/post.schema';
import { Blog, BlogSchema } from '../blogs/schemas/blogs.schema';
import { DeleteAllController } from './delete-all.controller';
import { DeleteAllRepository } from './delete-all.repository';
import { User, UserSchema } from '../users/schemas/user.schema';
import { Comment, CommentsSchema } from '../comments/schema/comments.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Post.name, schema: PostSchema },
      { name: Blog.name, schema: BlogSchema },
      { name: User.name, schema: UserSchema },
      { name: Comment.name, schema: CommentsSchema },
    ]),
  ],
  controllers: [DeleteAllController],
  providers: [DeleteAllRepository],
})
export class DeleteAllModule {}
