import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Post,
  PostDBType,
  PostsDocument,
  PostViewType,
} from '../schemas/post.schema';
import { Blog, BlogsDocument } from '../../blogs/schemas/blogs.schema';
import { CreatePostDto } from '../dto/create-post.dto';

@Injectable()
export class PostsRepository {
  constructor(
    @InjectModel(Post.name)
    private readonly postsModel: Model<PostsDocument>,
    @InjectModel(Blog.name)
    private readonly blogsModel: Model<BlogsDocument>,
  ) {}
  async createNewPost(newPost: PostDBType) {
    return this.postsModel.create(newPost);
  }
  async updatePostById(id: string, inputPostDTO: CreatePostDto) {
    return this.postsModel.findOneAndUpdate(
      { id },
      {
        $set: {
          title: inputPostDTO.title,
          shortDescription: inputPostDTO.shortDescription,
          content: inputPostDTO.content,
          blogId: inputPostDTO.blogId,
        },
      },
    );
  }
  async deletePostById(id: string) {
    return this.postsModel.deleteOne({ id });
  }
}
