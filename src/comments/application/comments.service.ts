import { Injectable, NotFoundException } from '@nestjs/common';
import { CommentsRepository } from '../repository/comments.repository';
import { CreateCommentDto } from '../../post/dto/create-comment.dto';
import { CommentDBModalType } from '../schema/comments.schema';
import * as mongoose from 'mongoose';
import ObjectId = mongoose.Types.ObjectId;
import { UpdateCommentDto } from '../dto/update-comment.dto';
import { CommentsQueryRepository } from '../repository/comments.query-repository';
import { UserViewType } from '../../users/schemas/user.schema';
import { LikeStatusType } from '../../post/schemas/like-status.schema';
import { PostsRepository } from '../../post/repository/posts.repository';

@Injectable()
export class CommentsService {
  constructor(
    private commentsRepository: CommentsRepository,
    private commentsQueryRepository: CommentsQueryRepository,
  ) {}
  async createNewComment(
    id: string,
    createCommentDto: CreateCommentDto,
    user: UserViewType,
  ) {
    const newComment: CommentDBModalType = new CommentDBModalType(
      new ObjectId().toString(),
      createCommentDto.content,
      user.id,
      user.login,
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

  async updateLikeStatus(
    user: UserViewType,
    commentId: string,
    likeStatus: string,
  ) {
    const findCommentById = await this.commentsQueryRepository.findCommentById(
      commentId,
    );
    if (!findCommentById) throw new NotFoundException([]);

    const likeStatusModel = new LikeStatusType(
      commentId,
      user.id,
      user.login,
      likeStatus,
      new Date(),
    );

    return this.commentsRepository.updateLikeStatus(likeStatusModel);
  }
}
