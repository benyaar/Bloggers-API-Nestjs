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
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { InputPostDTO } from './dto/input-post.dto';
import { PostQueryRepository } from './post.query-repository';
import { PaginationInputDTO } from '../helpers/dto/helpers.dto';

@Controller('posts')
export class PostsController {
  constructor(
    public postsService: PostsService,
    public postQueryRepository: PostQueryRepository,
  ) {}
  @Post()
  async createPost(@Body() inputPostDTO: InputPostDTO) {
    const findBlogById = await this.postQueryRepository.findBlogById(
      inputPostDTO.blogId,
    );

    if (!findBlogById)
      throw new NotFoundException([
        { message: 'blogId undefined', field: 'createNewPost' },
      ]);

    const createNewBlog = await this.postsService.createNewPost(
      findBlogById,
      inputPostDTO,
    );
    return createNewBlog;
  }
  @Get()
  async findAllPosts(@Body() paginationInputDTO: PaginationInputDTO) {
    return this.postQueryRepository.findAllPosts(paginationInputDTO);
  }
  @Get(':id')
  async findPostById(@Param('id') id: string) {
    return this.postQueryRepository.findPostById(id);
  }
  @Put(':id')
  @HttpCode(204)
  async updatePostById(
    @Param('id') id: string,
    @Body() inputPostDTO: InputPostDTO,
  ) {
    const findPostById = await this.postQueryRepository.findPostById(id);
    if (!findPostById) throw new NotFoundException([]);

    return this.postsService.updatePostById(id, inputPostDTO);
  }
  @Delete(':id')
  @HttpCode(204)
  async deletePostById(@Param('id') id: string) {
    const findPostById = await this.postQueryRepository.findPostById(id);
    if (!findPostById) throw new NotFoundException([]);

    return this.postsService.deletePostById(id);
  }
}
