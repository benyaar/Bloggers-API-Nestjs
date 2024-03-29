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
import { BloggersService } from '../application/bloggers.service';
import { CreateBlogDto, PostInputDTO } from '../dto/input-bloggers.dto';
import { BloggersQueryRepository } from '../repository/bloggers.query-repository';
import {
  PaginationBannedUserInputDTO,
  PaginationInputDTO,
  PaginationUserInputDTO,
} from '../../helpers/dto/helpers.dto';
import { BlogsViewModel } from '../schemas/blogs.schema';
import { Token } from '../../decorators/token.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { User } from '../../auth/decorator/request.decorator';
import { UserViewType } from '../../users/schemas/user.schema';
import { CreatePostDto } from '../../post/dto/create-post.dto';
import { BanUserDto } from '../dto/ban-user.dto';

@Controller('blogger')
export class BloggersController {
  constructor(
    public blogsService: BloggersService,
    public queryBlogRepository: BloggersQueryRepository,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('/blogs')
  async createBlog(
    @Body() blogInputType: CreateBlogDto,
    @User() user: UserViewType,
  ): Promise<BlogsViewModel> {
    return this.blogsService.createNewBlog(blogInputType, user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/blogs')
  async findBlogs(
    @Query() paginationInputType: PaginationInputDTO,
    @User() user: UserViewType,
  ) {
    return this.blogsService.findAllBlogs(paginationInputType, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('blogs/comments')
  @HttpCode(200)
  async getCommentsForBlog(
    @Query() inputDTO: PaginationInputDTO,
    @User() user: UserViewType,
  ) {
    return this.queryBlogRepository.getCommentsForBlog(inputDTO, user.id);
  }

  @Get('/blogs/:id')
  async findBlogById(@Param('id') id: string) {
    return this.queryBlogRepository.findBlogById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put('blogs/:id')
  @HttpCode(204)
  async updateBlogById(
    @Param('id') id: string,
    @Body() blogInputType: CreateBlogDto,
    @User() user: UserViewType,
  ) {
    return this.blogsService.updateBlogById(id, blogInputType, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('blogs/:id')
  @HttpCode(204)
  async deleteBlogById(@Param('id') id: string, @User() user: UserViewType) {
    return this.blogsService.deleteBlogById(id, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('blogs/:id/posts')
  async createPostByBlogId(
    @Param('id') id: string,
    @Body() postInputDTO: PostInputDTO,
    @User() user: UserViewType,
  ) {
    return this.blogsService.createPostByBlogId(id, postInputDTO, user.id);
  }

  @Get('blogs/:id/posts')
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

  @UseGuards(JwtAuthGuard)
  @Put('blogs/:id/posts/:postId')
  @HttpCode(204)
  async updatePostById(
    @Param('id') id: string,
    @Param('postId') postId: string,
    @Body() createPostDto: CreatePostDto,
    @User() user: UserViewType,
  ) {
    return this.blogsService.updateBlogPostById(
      id,
      postId,
      user.id,
      createPostDto,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete('blogs/:id/posts/:postId')
  @HttpCode(204)
  async deletePostById(
    @Param('id') id: string,
    @Param('postId') postId: string,
    @User() user: UserViewType,
  ) {
    return this.blogsService.deleteBlogPostById(id, postId, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Put('users/:id/ban')
  @HttpCode(204)
  async addUserInBan(
    @Param('id') id: string,
    @Body() banUserDto: BanUserDto,
    @User() user: UserViewType,
  ) {
    return this.blogsService.addUserInBan(id, banUserDto, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('users/blog/:id')
  @HttpCode(200)
  async getAllBannedUserForBlog(
    @Param('id') id: string,
    @Query() inputDTO: PaginationUserInputDTO,
    @User() user: UserViewType,
  ) {
    return this.queryBlogRepository.getAllBannedUserForBlog(
      id,
      inputDTO,
      user.id,
    );
  }
}
