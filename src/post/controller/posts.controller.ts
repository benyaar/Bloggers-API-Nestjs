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
import { PostsService } from '../application/posts.service';
import { CreatePostDto } from '../dto/create-post.dto';
import { PostQueryRepository } from '../repository/post.query-repository';
import { PaginationInputDTO } from '../../helpers/dto/helpers.dto';
import { CreateCommentDto } from '../dto/create-comment.dto';

@Controller('posts')
export class PostsController {
  constructor(
    public postsService: PostsService,
    public postQueryRepository: PostQueryRepository,
  ) {}

  @Post()
  async createPost(@Body() createPostDto: CreatePostDto) {
    return this.postsService.createNewPost(createPostDto);
  }

  @Get()
  async findAllPosts(@Query() paginationInputDTO: PaginationInputDTO) {
    return this.postQueryRepository.findAllPosts(paginationInputDTO);
  }

  @Get(':id')
  async findPostById(@Param('id') id: string) {
    const findPostById = await this.postQueryRepository.findPostById(id);
    if (!findPostById) throw new NotFoundException([]);

    return findPostById;
  }

  @Put(':id')
  @HttpCode(204)
  async updatePostById(
    @Param('id') id: string,
    @Body() createPostDto: CreatePostDto,
  ) {
    return this.postsService.updatePostById(id, createPostDto);
  }

  @Delete(':id')
  @HttpCode(204)
  async deletePostById(@Param('id') id: string) {
    return this.postsService.deletePostById(id);
  }

  @Post(':id/comments')
  async createCommentForPost(
    @Param('id') id: string,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return this.postsService.createNewCommentByPostId(id, createCommentDto);
  }
  @Get(':id/comments')
  async findAllCommentsForPost(
    @Param('id') id: string,
    @Query() paginationInputDTO: PaginationInputDTO,
  ) {
    return this.postsService.findAllCommentsForPost(id, paginationInputDTO);
  }
}
