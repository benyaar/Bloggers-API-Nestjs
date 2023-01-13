import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BlogsRepository } from '../repository/blogs.repository';
import { BlogInputDTO, PostInputDTO } from '../dto/input-blog.dto';
import { Blog, BlogsModelType, BlogsViewModel } from '../schemas/blogs.schema';
import { InjectModel } from '@nestjs/mongoose';
import { BlogQueryRepository } from '../repository/blog.query-repository';
import { PostsService } from '../../post/application/posts.service';
import { PaginationInputDTO } from '../../helpers/dto/helpers.dto';
import { PostQueryRepository } from '../../post/repository/post.query-repository';

@Injectable()
export class BlogsService {
  constructor(
    private blogsRepository: BlogsRepository,
    private postsService: PostsService,
    @InjectModel(Blog.name)
    private BlogModel: BlogsModelType,
    private blogQueryRepository: BlogQueryRepository,
    public postQueryRepository: PostQueryRepository,
  ) {}
  async createNewUser(blog: BlogInputDTO): Promise<BlogsViewModel> {
    const newBlog = this.BlogModel.createNewBlog(blog, this.BlogModel);

    const savedBlog = await this.blogsRepository.saveBlogInDB(newBlog);
    if (!savedBlog) throw new BadRequestException();
    return new BlogsViewModel(
      savedBlog.id,
      savedBlog.name,
      savedBlog.description,
      savedBlog.websiteUrl,
      savedBlog.createdAt,
    );
  }

  async updateBlogById(blogId: string, blog: BlogInputDTO) {
    const findBlogById = await this.blogQueryRepository.findBlogById(blogId);
    if (!findBlogById) throw new NotFoundException([]);
    return this.blogsRepository.updateBlogById(blogId, blog);
  }

  async deleteBlogById(id: string) {
    const findBlogById = await this.blogQueryRepository.findBlogById(id);

    if (!findBlogById) throw new NotFoundException([]);
    await this.blogsRepository.deleteBlogById(id);
    return;
  }

  async createPostByBlogId(id: string, postInputDTO: PostInputDTO) {
    const findBlogById = await this.blogQueryRepository.findBlogById(id);
    if (!findBlogById) throw new NotFoundException([]);
    const postData = { ...postInputDTO, blogId: id };
    return this.postsService.createNewPost(postData);
  }

  async findAllPostsByBlogId(
    id: string,
    paginationInputDTO: PaginationInputDTO,
    userId: string | null,
  ) {
    const findBlogById = await this.blogQueryRepository.findBlogById(id);
    if (!findBlogById) throw new NotFoundException([]);

    return await this.postQueryRepository.findBlogsPosts(
      paginationInputDTO,
      id,
      userId,
    );
  }
}
