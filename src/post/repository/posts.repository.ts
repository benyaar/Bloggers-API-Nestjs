import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post, PostDBType, PostsDocument } from '../schemas/post.schema';
import { Blog, BlogsDocument } from '../../bloggers/schemas/blogs.schema';
import { CreatePostDto } from '../dto/create-post.dto';
import {
  LikeStatus,
  LikeStatusDocument,
  LikeStatusType,
} from '../schemas/like-status.schema';

@Injectable()
export class PostsRepository {
  constructor(
    @InjectModel(Post.name)
    private readonly postsModel: Model<PostsDocument>,
    @InjectModel(Blog.name)
    private readonly blogsModel: Model<BlogsDocument>,
    @InjectModel(LikeStatus.name)
    private readonly likeStatusModel: Model<LikeStatusDocument>,
  ) {}
  async createNewPost(newPost: PostDBType) {
    return this.postsModel.create(newPost);
  }
  async updatePostById(
    id: string,
    userId: string,
    inputPostDTO: CreatePostDto,
  ) {
    return this.postsModel.findOneAndUpdate(
      { id, userId },
      {
        $set: {
          title: inputPostDTO.title,
          shortDescription: inputPostDTO.shortDescription,
          content: inputPostDTO.content,
        },
      },
    );
  }
  async deletePostById(id: string, userId: string) {
    return this.postsModel.deleteOne({ id, userId });
  }

  async updateLikeStatus(likeStatus: LikeStatusType) {
    return this.likeStatusModel.findOneAndUpdate(
      { parentId: likeStatus.parentId, userId: likeStatus.userId },
      { ...likeStatus },
      { upsert: true },
    );
  }
}
