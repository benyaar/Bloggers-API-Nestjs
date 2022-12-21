import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';

import { Post, PostSchema } from './schemas/post.schema';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { PostsRepository } from './posts.repository';
import { Blog, BlogSchema } from '../blogs/schemas/blogs.schema';
import { PostQueryRepository } from './post.query-repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Post.name, schema: PostSchema },
      { name: Blog.name, schema: BlogSchema },
    ]),
  ],
  controllers: [PostsController],
  providers: [PostsService, PostsRepository, PostQueryRepository],
})
export class PostsModule {}
