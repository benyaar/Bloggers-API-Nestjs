import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogsDocument } from '../../blogs/schemas/blogs.schema';
import { Model } from 'mongoose';
import { Post, PostsDocument } from '../schemas/post.schema';
import { PaginationInputDTO } from '../../helpers/dto/helpers.dto';
import { pagination, paginationResult } from '../../helpers/pagination';

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
  ) {}
  async findBlogById(blogId: string) {
    return this.blogsModel.findOne({ id: blogId });
  }
  async findAllPosts(paginationInputDTO: PaginationInputDTO) {
    return pagination(null, paginationInputDTO, this.postsModel);
  }
  async findPostById(id: string) {
    return this.postsModel.findOne({ id }, options);
  }
  async findBlogsPosts(paginationInputDTO: PaginationInputDTO, blogId: string) {
    return pagination(blogId, paginationInputDTO, this.postsModel);
  }
}
