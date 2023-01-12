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
  Req,
  UseGuards,
} from '@nestjs/common';
import { PostsService } from '../application/posts.service';
import { CreatePostDto } from '../dto/create-post.dto';
import { PostQueryRepository } from '../repository/post.query-repository';
import { PaginationInputDTO } from '../../helpers/dto/helpers.dto';
import { CreateCommentDto } from '../dto/create-comment.dto';
import { User } from '../../auth/decorator/request.decorator';
import { UserViewType } from '../../users/schemas/user.schema';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { Cookies } from '../../auth/decorator/cookies.decorator';
import { Request } from 'express';
import { BasicAuthGuard } from '../../auth/guards/basic-auth.guard';
import { LikeStatusDto } from '../dto/like-status.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('posts')
export class PostsController {
  constructor(
    public postsService: PostsService,
    public postQueryRepository: PostQueryRepository,
  ) {}

  @UseGuards(BasicAuthGuard)
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

  @UseGuards(BasicAuthGuard)
  @Put(':id')
  @HttpCode(204)
  async updatePostById(
    @Param('id') id: string,
    @Body() createPostDto: CreatePostDto,
  ) {
    return this.postsService.updatePostById(id, createPostDto);
  }

  @UseGuards(BasicAuthGuard)
  @Delete(':id')
  @HttpCode(204)
  async deletePostById(@Param('id') id: string) {
    return this.postsService.deletePostById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/comments')
  async createCommentForPost(
    @Param('id') id: string,
    @Body() createCommentDto: CreateCommentDto,
    @User() user: UserViewType,
    @Cookies('refreshToken') refreshToken: any,
    @Req() request: Request,
  ) {
    console.log(refreshToken);
    console.log(request.cookies);
    return this.postsService.createNewCommentByPostId(
      id,
      createCommentDto,
      user,
    );
  }
  @Get(':id/comments')
  async findAllCommentsForPost(
    @Param('id') id: string,
    @Query() paginationInputDTO: PaginationInputDTO,
  ) {
    return this.postsService.findAllCommentsForPost(id, paginationInputDTO);
  }

  @UseGuards(AuthGuard('jwt'))
  @HttpCode(204)
  @Put(':id/like-status')
  async updateLikeStatus(
    @User() user,
    @Param('id') id: string,
    @Body() likeStatusDto: LikeStatusDto,
  ) {
    return this.postsService.updateLikeStatus(
      user,
      id,
      likeStatusDto.likeStatus,
    );
  }
}
