import {
  Controller,
  Get,
  Body,
  Param,
  Delete,
  NotFoundException,
  Put,
  HttpCode,
} from '@nestjs/common';
import { CommentsService } from '../application/comments.service';
import { CommentsQueryRepository } from '../repository/comments.query-repository';
import { UpdateCommentDto } from '../dto/update-comment.dto';

@Controller('comments')
export class CommentsController {
  constructor(
    private readonly commentsService: CommentsService,
    private readonly commentsQueryRepository: CommentsQueryRepository,
  ) {}
  @Get(':id')
  async findCommentById(@Param('id') id: string) {
    const findComment = await this.commentsQueryRepository.findCommentById(id);
    if (!findComment) throw new NotFoundException([]);
    return findComment;
  }
  @Put(':commentId')
  @HttpCode(204)
  async updateCommentById(
    @Param('commentId') commentId: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    return this.commentsService.updateCommentById(commentId, updateCommentDto);
  }
  @Delete(':commentId')
  @HttpCode(204)
  async deleteCommentById(@Param('commentId') commentId: string) {
    return this.commentsService.deleteCommentById(commentId);
  }
}
