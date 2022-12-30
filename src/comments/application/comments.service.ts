import { Injectable, NotFoundException } from '@nestjs/common';
import { CommentsRepository } from '../repository/comments.repository';
import { CreateCommentDto } from '../../post/dto/create-comment.dto';
import { CommentDBModalType } from '../schema/comments.schema';
import * as mongoose from 'mongoose';
import ObjectId = mongoose.Types.ObjectId;
import { UpdateCommentDto } from '../dto/update-comment.dto';
import { CommentsQueryRepository } from '../repository/comments.query-repository';

@Injectable()
export class CommentsService {
  constructor(
    private commentsRepository: CommentsRepository,
    private commentsQueryRepository: CommentsQueryRepository,
  ) {}
  async createNewComment(id: string, createCommentDto: CreateCommentDto) {
    const newComment: CommentDBModalType = new CommentDBModalType(
      new ObjectId().toString(),
      createCommentDto.content,
      'null',
      'null',
      new Date(),
      id,
      {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: 'none',
      },
    );
    await this.commentsRepository.saveNewComment(newComment);
    return newComment;
  }
  async updateCommentById(
    commentId: string,
    updateCommentDto: UpdateCommentDto,
  ) {
    const findCommentById = await this.commentsQueryRepository.findCommentById(
      commentId,
    );
    if (!findCommentById) throw new NotFoundException([]);
    return this.commentsRepository.updateCommentById(
      commentId,
      updateCommentDto,
    );
  }
  async deleteCommentById(commentId: string) {
    const findCommentById = await this.commentsQueryRepository.findCommentById(
      commentId,
    );
    if (!findCommentById) throw new NotFoundException([]);
    return this.commentsRepository.deleteCommentById(commentId);
  }
}
