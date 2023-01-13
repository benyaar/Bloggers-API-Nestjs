import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogsDocument } from '../../blogs/schemas/blogs.schema';
import { Model } from 'mongoose';
import { Post, PostsDocument } from '../schemas/post.schema';
import { PaginationInputDTO } from '../../helpers/dto/helpers.dto';
import { PaginationHelp } from '../../helpers/pagination';
import { Inject } from '@nestjs/common';

const options = {
  _id: 0,
  passwordHash: 0,
  postId: 0,
  emailConfirmation: 0,
  __v: 0,
  parentId: 0,
};

export class PostQueryRepository {
  constructor(
    @InjectModel(Post.name)
    private readonly postsModel: Model<PostsDocument>,
    @InjectModel(Blog.name)
    private readonly blogsModel: Model<BlogsDocument>,
    private pagination: PaginationHelp,
  ) {}
  async findBlogById(blogId: string) {
    return this.blogsModel.findOne({ id: blogId });
  }
  async findAllPosts(
    paginationInputDTO: PaginationInputDTO,
    userId: string | null,
  ) {
    return this.pagination.pagination(
      null,
      paginationInputDTO,
      this.postsModel,
      userId,
    );
  }
  async findPostById(id: string) {
    return this.postsModel.findOne({ id }, options);
  }
  async findBlogsPosts(paginationInputDTO: PaginationInputDTO, blogId: string) {
    return this.pagination.pagination(
      blogId,
      paginationInputDTO,
      this.postsModel,
      null,
    );
  }
}
