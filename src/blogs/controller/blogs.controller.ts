import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BlogsService } from '../application/blogs.service';
import { CreateBlogDto, PostInputDTO } from '../dto/input-blog.dto';
import { BlogQueryRepository } from '../repository/blog.query-repository';
import { PaginationInputDTO } from '../../helpers/dto/helpers.dto';
import { BlogsViewModel } from '../schemas/blogs.schema';
import { BasicAuthGuard } from '../../auth/guards/basic-auth.guard';
import { Token } from '../../decorators/token.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { User } from '../../auth/decorator/request.decorator';
import { UserViewType } from '../../users/schemas/user.schema';

@Controller('bloggers/blogs')
export class BlogsController {
  constructor(
    public blogsService: BlogsService,
    public queryBlogRepository: BlogQueryRepository,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createBlog(
    @Body() blogInputType: CreateBlogDto,
    @User() user: UserViewType,
  ): Promise<BlogsViewModel> {
    return this.blogsService.createNewBlog(blogInputType, user);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findBlogs(
    @Query() paginationInputType: PaginationInputDTO,
    @User() user: UserViewType,
  ) {
    return this.queryBlogRepository.findAllBlogs(paginationInputType, user.id);
  }

  @Get(':id')
  async findBlogById(@Param('id') id: string) {
    return this.queryBlogRepository.findBlogById(id);
  }

  @UseGuards(BasicAuthGuard)
  @Put(':id')
  @HttpCode(204)
  async updateBlogById(
    @Param('id') id: string,
    @Body() blogInputType: CreateBlogDto,
  ) {
    return await this.blogsService.updateBlogById(id, blogInputType);
  }

  @UseGuards(BasicAuthGuard)
  @Delete(':id')
  @HttpCode(204)
  async deleteBlogById(@Param('id') id: string) {
    return this.blogsService.deleteBlogById(id);
  }

  @UseGuards(BasicAuthGuard)
  @Post(':id/posts')
  async createPostByBlodId(
    @Param('id') id: string,
    @Body() postInputDTO: PostInputDTO,
  ) {
    return this.blogsService.createPostByBlogId(id, postInputDTO);
  }

  @Get(':id/posts')
  async findAllPostByBlogId(
    @Token() userId: string | null,
    @Param('id') id: string,
    @Query() paginationInputDTO: PaginationInputDTO,
  ) {
    return this.blogsService.findAllPostsByBlogId(
      id,
      paginationInputDTO,
      userId,
    );
  }
}
