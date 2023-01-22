import {
  Body,
  Controller,
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
import { PostQueryRepository } from '../repository/post.query-repository';
import { PaginationInputDTO } from '../../helpers/dto/helpers.dto';
import { CreateCommentDto } from '../dto/create-comment.dto';
import { User } from '../../auth/decorator/request.decorator';
import { UserViewType } from '../../users/schemas/user.schema';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { Cookies } from '../../auth/decorator/cookies.decorator';
import { Request } from 'express';
import { LikeStatusDto } from '../dto/like-status.dto';
import { AuthGuard } from '@nestjs/passport';
import { Token } from '../../decorators/token.decorator';

@Controller('posts')
export class PostsController {
  constructor(
    public postsService: PostsService,
    public postQueryRepository: PostQueryRepository,
  ) {}

  @Get()
  async findAllPosts(
    @Token() userId: string | null,
    @Query() paginationInputDTO: PaginationInputDTO,
  ) {
    console.log(userId);
    return this.postQueryRepository.findAllPosts(paginationInputDTO, userId);
  }

  @Get(':id')
  async findPostById(@Param('id') id: string, @Token() userId: string | null) {
    const findPostById = await this.postQueryRepository.findPostByIdWithLike(
      id,
      userId,
    );
    if (!findPostById) throw new NotFoundException([]);
    return findPostById;
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
    @Token() userId: string | null,
  ) {
    return this.postsService.findAllCommentsForPost(
      id,
      paginationInputDTO,
      userId,
    );
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
