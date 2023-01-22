import { Controller, Get, Param, Query } from '@nestjs/common';
import { BloggersService } from '../application/bloggers.service';
import { BloggersQueryRepository } from '../repository/bloggers.query-repository';
import { PaginationInputDTO } from '../../helpers/dto/helpers.dto';
import { Token } from '../../decorators/token.decorator';

@Controller('/blogs')
export class BlogsController {
  constructor(
    public blogsService: BloggersService,
    public queryBlogRepository: BloggersQueryRepository,
  ) {}

  @Get()
  async findBlogs(
    @Token() userId: string | null,
    @Query() paginationInputType: PaginationInputDTO,
  ) {
    return this.blogsService.findAllBlogs(paginationInputType, userId);
  }

  @Get(':id')
  async findBlogById(@Token() userId: string | null, @Param('id') id: string) {
    return this.queryBlogRepository.findBlogById(id);
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
