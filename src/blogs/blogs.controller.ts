import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { BlogInputDTO, PostInputDTO } from './dto/input-blog.dto';
import { BlogQueryRepository } from './blog.query-repository';
import { PaginationInputDTO } from '../helpers/dto/helpers.dto';
import { BlogsViewType } from './schemas/blogs.schema';
import { PostsService } from '../post/posts.service';
import { PostQueryRepository } from '../post/post.query-repository';

@Controller('blogs')
export class BlogsController {
  constructor(
    public blogsService: BlogsService,
    public postsService: PostsService,
    public queryBlogRepository: BlogQueryRepository,
    public queryPostRepository: PostQueryRepository,
  ) {}
  @Post()
  async createBlog(@Body() blogInputType: BlogInputDTO) {
    const createNewUser = await this.blogsService.createNewUser(blogInputType);
    return new BlogsViewType(
      createNewUser.id,
      createNewUser.name,
      createNewUser.description,
      createNewUser.websiteUrl,
      createNewUser.createdAt,
    );
  }
  @Get()
  async findBlogs(@Query() paginationInputType: PaginationInputDTO) {
    return this.queryBlogRepository.findAllBlogs(paginationInputType);
  }
  @Get(':id')
  async findBlogById(@Param('id') id: string) {
    const findBlogById = await this.queryBlogRepository.findBlogById(id);
    if (!findBlogById) throw new NotFoundException();

    return findBlogById;
  }
  @Put(':id')
  @HttpCode(204)
  async updateBlogById(
    @Param('id') id: string,
    @Body() blogInputType: BlogInputDTO,
  ) {
    const findBlogById = await this.queryBlogRepository.findBlogById(id);
    if (!findBlogById) throw new NotFoundException();

    await this.blogsService.updateBlogById(findBlogById.id, blogInputType);
    return;
  }
  @Delete(':id')
  @HttpCode(204)
  async deleteBlogById(@Param('id') id: string) {
    const findBlogById = await this.queryBlogRepository.findBlogById(id);

    if (!findBlogById) throw new NotFoundException();

    await this.blogsService.deleteBlogById(id);
    return;
  }

  @Post(':id/posts')
  async createPostByBlodId(
    @Param('id') id: string,
    @Body() postInputDTO: PostInputDTO,
  ) {
    const findBlogById = await this.queryBlogRepository.findBlogById(id);
    if (!findBlogById) throw new NotFoundException();
    const postData = { ...postInputDTO, blogId: id };

    return this.postsService.createNewPost(findBlogById, postData);
  }
  @Get(':id/posts')
  async findAllPostByBlogId(
    @Param('id') id: string,
    @Body() paginationInputDTO: PaginationInputDTO,
  ) {
    const findBlogById = await this.queryBlogRepository.findBlogById(id);
    if (!findBlogById) throw new NotFoundException();
    return await this.queryPostRepository.findBlogsPosts(
      paginationInputDTO,
      id,
    );
  }
}
