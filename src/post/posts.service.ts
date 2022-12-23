import { Injectable } from '@nestjs/common';
import { PostsRepository } from './posts.repository';
import { PostViewType } from './schemas/post.schema';
import * as mongoose from 'mongoose';
import ObjectId = mongoose.Types.ObjectId;
import { InputPostDTO } from './dto/input-post.dto';
import { BlogsViewType } from '../blogs/schemas/blogs.schema';
import { PaginationInputDTO } from '../helpers/dto/helpers.dto';

@Injectable()
export class PostsService {
  constructor(public postsRepository: PostsRepository) {}
  async createNewPost(blog: BlogsViewType, inputPostDTO: InputPostDTO) {
    const newPost = new PostViewType(
      new ObjectId().toString(),
      inputPostDTO.title,
      inputPostDTO.shortDescription,
      inputPostDTO.content,
      blog.id,
      blog.name,
      new Date(),
      {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: 'None',
        newestLikes: [],
      },
    );
    await this.postsRepository.createNewPost(newPost);
    return newPost;
  }
  async updatePostById(id: string, inputPostDTO: InputPostDTO) {
    return this.postsRepository.updatePostById(id, inputPostDTO);
  }
  async deletePostById(id: string) {
    return this.postsRepository.deletePostById(id);
  }
}
