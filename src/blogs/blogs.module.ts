import { Module } from '@nestjs/common';

import { Blog, BlogSchema } from './schemas/blogs.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogsController } from './blogs.controller';
import { BlogsService } from './blogs.service';
import { BlogsRepository } from './blogs.repository';
import { BlogQueryRepository } from './blog.query-repository';
import { PostsService } from '../post/posts.service';
import { PostsRepository } from '../post/posts.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }]),
  ],
  controllers: [BlogsController],
  providers: [BlogsService, BlogsRepository, BlogQueryRepository],
})
export class BlogsModule {}
