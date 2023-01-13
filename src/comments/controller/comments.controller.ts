import {
  Controller,
  Get,
  Body,
  Param,
  Delete,
  NotFoundException,
  Put,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { CommentsService } from '../application/comments.service';
import { CommentsQueryRepository } from '../repository/comments.query-repository';
import { UpdateCommentDto } from '../dto/update-comment.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../../auth/decorator/request.decorator';
import { LikeStatusDto } from '../../post/dto/like-status.dto';
import { Token } from '../../decorators/token.decorator';

@Controller('comments')
export class CommentsController {
  constructor(
    private readonly commentsService: CommentsService,
    private readonly commentsQueryRepository: CommentsQueryRepository,
  ) {}

  @Get(':id')
  async findCommentById(
    @Param('id') id: string,
    @Token() userId: string | null,
  ) {
    const findComment =
      await this.commentsQueryRepository.findCommentByIdWithLikes(id, userId);
    if (!findComment) throw new NotFoundException([]);
    return findComment;
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':commentId')
  @HttpCode(204)
  async updateCommentById(
    @Param('commentId') commentId: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    return this.commentsService.updateCommentById(commentId, updateCommentDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':commentId')
  @HttpCode(204)
  async deleteCommentById(@Param('commentId') commentId: string) {
    return this.commentsService.deleteCommentById(commentId);
  }

  @UseGuards(AuthGuard('jwt'))
  @HttpCode(204)
  @Put(':id/like-status')
  async updateLikeStatus(
    @User() user,
    @Param('id') id: string,
    @Body() likeStatusDto: LikeStatusDto,
  ) {
    return this.commentsService.updateLikeStatus(
      user,
      id,
      likeStatusDto.likeStatus,
    );
  }
}
