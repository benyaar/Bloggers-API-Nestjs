import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogsDocument } from '../blogs/schemas/blogs.schema';
import { Model } from 'mongoose';
import { Post, PostsDocument } from './schemas/post.schema';
import { PaginationInputDTO } from '../helpers/dto/helpers.dto';
import { paginationResult } from '../helpers/pagination';
import { InputPostDTO } from './dto/input-post.dto';

const options = {
  _id: 0,
  passwordHash: 0,
  postId: 0,
  emailConfirmation: 0,
  __v: 0,
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
    const searchNameTerm: string = paginationInputDTO.searchNameTerm;
    const sortBy: string = paginationInputDTO.sortBy;
    const pageNumber: number = +paginationInputDTO.pageNumber;
    const pageSize: number = +paginationInputDTO.pageSize;
    let sortDirection: any = paginationInputDTO.sortDirection;

    if (sortDirection !== ('asc' || 'desc')) sortDirection = 'desc';

    const findAndSortedPosts = await this.postsModel
      .find({ name: { $regex: searchNameTerm, $options: 'i' } }, options)
      .lean()
      .sort({ [sortBy]: sortDirection })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize);

    const getCountBlogs = await this.postsModel.countDocuments({
      name: { $regex: searchNameTerm, $options: 'i' },
    });

    return paginationResult(
      pageNumber,
      pageSize,
      getCountBlogs,
      findAndSortedPosts,
    );
  }
  async findPostById(id: string) {
    return this.postsModel.findOne({ id }, options);
  }
}
