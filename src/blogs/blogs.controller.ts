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
import { BlogInputDTO } from './dto/input-blog.dto';
import { BlogQueryRepository } from './blog.query-repository';
import { PaginationInputDTO } from '../helpers/dto/helpers.dto';
import { BlogsViewType } from './schemas/blogs.schema';
import { PostsService } from '../post/posts.service';
import { InputPostDTO } from '../post/dto/input-post.dto';

@Controller('blogs')
export class BlogsController {
  constructor(
    public blogsService: BlogsService,
    public queryRepository: BlogQueryRepository,
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
    return this.queryRepository.findAllBlogs(paginationInputType);
  }
  @Get(':id')
  async findBlogById(@Param('id') id: string) {
    const findBlogById = await this.queryRepository.findBlogById(id);
    if (!findBlogById) throw new NotFoundException();

    return findBlogById;
  }
  @Put(':id')
  @HttpCode(204)
  async updateBlogById(
    @Param('id') id: string,
    @Body() blogInputType: BlogInputDTO,
  ) {
    const findBlogById = await this.queryRepository.findBlogById(id);
    if (!findBlogById) throw new NotFoundException();

    await this.blogsService.updateBlogById(findBlogById.id, blogInputType);
    return;
  }
  @Delete(':id')
  @HttpCode(204)
  async deleteBlogById(@Param('id') id: string) {
    const findBlogById = await this.queryRepository.findBlogById(id);

    if (!findBlogById) throw new NotFoundException();

    await this.blogsService.deleteBlogById(id);
    return;
  }

  // @Post(':id/posts')
  // async createPostByBlodId(
  //   @Param('id') id: string,
  //   @Body() inputPostDTO: InputPostDTO,
  // ) {
  //   const findBlogById = await this.queryRepository.findBlogById(id);
  //   if (!findBlogById) throw new NotFoundException();
  //
  //   return this.postService.createNewPost(findBlogById, inputPostDTO);
  // }
}
