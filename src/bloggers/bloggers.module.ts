import { forwardRef, Module } from '@nestjs/common';

import { Blog, BlogSchema } from './schemas/blogs.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { BloggersController } from './controller/bloggers.controller';
import { BloggersService } from './application/bloggers.service';
import { BloggersRepository } from './repository/bloggers.repository';
import { BloggersQueryRepository } from './repository/bloggers.query-repository';
import { Post, PostSchema } from '../post/schemas/post.schema';
import { PostsModule } from '../post/posts.module';
import { PaginationModule } from '../helpers/pagination.module';
import { BlogsController } from './controller/blogs.controller';
import { BannedUser, BannedUserSchema } from './schemas/banned-User.schema';
import { UsersModule } from '../users/user.module';

@Module({
  imports: [
    forwardRef(() => PostsModule),
    forwardRef(() => UsersModule),
    PaginationModule,
    MongooseModule.forFeature([
      { name: Blog.name, schema: BlogSchema },
      { name: Post.name, schema: PostSchema },
      { name: BannedUser.name, schema: BannedUserSchema },
    ]),
  ],
  controllers: [BloggersController, BlogsController],
  providers: [BloggersService, BloggersRepository, BloggersQueryRepository],
  exports: [BloggersService, BloggersRepository, BloggersQueryRepository],
})
export class BloggersModule {}
