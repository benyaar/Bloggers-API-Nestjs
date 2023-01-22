import { forwardRef, Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';

import { Post, PostSchema } from './schemas/post.schema';
import { PostsController } from './controller/posts.controller';
import { PostsService } from './application/posts.service';
import { PostsRepository } from './repository/posts.repository';
import { Blog, BlogSchema } from '../bloggers/schemas/blogs.schema';
import { PostQueryRepository } from './repository/post.query-repository';
import { CommentsModule } from '../comments/comments.module';
import { LikeStatus, LikeStatusSchema } from './schemas/like-status.schema';
import { PaginationModule } from '../helpers/pagination.module';
import { BlogIdValidator } from './decorators/blog-id-validator';
import { BloggersModule } from '../bloggers/bloggers.module';
import { User, UserSchema } from '../users/schemas/user.schema';

@Module({
  imports: [
    forwardRef(() => BloggersModule),
    CommentsModule,
    PaginationModule,
    MongooseModule.forFeature([
      { name: Post.name, schema: PostSchema },
      { name: Blog.name, schema: BlogSchema },
      { name: User.name, schema: UserSchema },
      { name: LikeStatus.name, schema: LikeStatusSchema },
    ]),
  ],
  controllers: [PostsController],
  providers: [
    PostsService,
    PostsRepository,
    PostQueryRepository,
    BlogIdValidator,
  ],
  exports: [PostsService, PostsRepository, PostQueryRepository],
})
export class PostsModule {}
