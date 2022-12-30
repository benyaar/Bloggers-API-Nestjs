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
import { BlogsService } from '../application/blogs.service';
import { BlogInputDTO, PostInputDTO } from '../dto/input-blog.dto';
import { BlogQueryRepository } from '../repository/blog.query-repository';
import { PaginationInputDTO } from '../../helpers/dto/helpers.dto';
import { BlogsViewModel } from '../schemas/blogs.schema';
import { PostsService } from '../../post/application/posts.service';
import { PostQueryRepository } from '../../post/repository/post.query-repository';

@Controller('blogs')
export class BlogsController {
  constructor(
    public blogsService: BlogsService,
    public queryBlogRepository: BlogQueryRepository,
  ) {}

  @Post()
  async createBlog(
    @Body() blogInputType: BlogInputDTO,
  ): Promise<BlogsViewModel> {
    return this.blogsService.createNewUser(blogInputType);
  }

  @Get()
  async findBlogs(@Query() paginationInputType: PaginationInputDTO) {
    return this.queryBlogRepository.findAllBlogs(paginationInputType);
  }

  @Get(':id')
  async findBlogById(@Param('id') id: string) {
    return this.queryBlogRepository.findBlogById(id);
  }

  @Put(':id')
  @HttpCode(204)
  async updateBlogById(
    @Param('id') id: string,
    @Body() blogInputType: BlogInputDTO,
  ) {
    return await this.blogsService.updateBlogById(id, blogInputType);
  }
  @Delete(':id')
  @HttpCode(204)
  async deleteBlogById(@Param('id') id: string) {
    return await this.blogsService.deleteBlogById(id);
  }

  @Post(':id/posts')
  async createPostByBlodId(
    @Param('id') id: string,
    @Body() postInputDTO: PostInputDTO,
  ) {
    return this.blogsService.createPostByBlogId(id, postInputDTO);
  }

  @Get(':id/posts')
  async findAllPostByBlogId(
    @Param('id') id: string,
    @Query() paginationInputDTO: PaginationInputDTO,
  ) {
    return this.blogsService.findAllPostsByBlogId(id, paginationInputDTO);
  }
}
