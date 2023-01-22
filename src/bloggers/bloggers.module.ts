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

@Module({
  imports: [
    forwardRef(() => PostsModule),
    PaginationModule,
    MongooseModule.forFeature([
      { name: Blog.name, schema: BlogSchema },
      { name: Post.name, schema: PostSchema },
    ]),
  ],
  controllers: [BloggersController, BlogsController],
  providers: [BloggersService, BloggersRepository, BloggersQueryRepository],
  exports: [BloggersService, BloggersRepository, BloggersQueryRepository],
})
export class BloggersModule {}
