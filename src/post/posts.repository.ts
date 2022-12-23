import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post, PostsDocument, PostViewType } from './schemas/post.schema';
import { Blog, BlogsDocument } from '../blogs/schemas/blogs.schema';
import { InputPostDTO } from './dto/input-post.dto';

@Injectable()
export class PostsRepository {
  constructor(
    @InjectModel(Post.name)
    private readonly postsModel: Model<PostsDocument>,
    @InjectModel(Blog.name)
    private readonly blogsModel: Model<BlogsDocument>,
  ) {}
  async createNewPost(newPost: PostViewType) {
    return this.postsModel.create(newPost);
  }
  async updatePostById(id: string, inputPostDTO: InputPostDTO) {
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
