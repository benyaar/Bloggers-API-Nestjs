import { forwardRef, Module } from '@nestjs/common';

import { Blog, BlogSchema } from './schemas/blogs.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogsController } from './controller/blogs.controller';
import { BlogsService } from './application/blogs.service';
import { BlogsRepository } from './repository/blogs.repository';
import { BlogQueryRepository } from './repository/blog.query-repository';
import { Post, PostSchema } from '../post/schemas/post.schema';
import { PostsModule } from '../post/posts.module';
import { PaginationModule } from '../helpers/pagination.module';
import { PostsService } from '../post/application/posts.service';
import { PostQueryRepository } from '../post/repository/post.query-repository';

@Module({
  imports: [
    forwardRef(() => PostsModule),
    PaginationModule,
    MongooseModule.forFeature([
      { name: Blog.name, schema: BlogSchema },
      { name: Post.name, schema: PostSchema },
    ]),
  ],
  controllers: [BlogsController],
  providers: [BlogsService, BlogsRepository, BlogQueryRepository],
  exports: [BlogsService, BlogsRepository, BlogQueryRepository],
})
export class BlogsModule {}
