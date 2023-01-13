import { InjectModel } from '@nestjs/mongoose';
import { Comment, CommentsDocument } from '../schema/comments.schema';
import { Model } from 'mongoose';
import { PaginationInputDTO } from '../../helpers/dto/helpers.dto';
import { PaginationHelp } from '../../helpers/pagination';
import { Inject, Injectable } from '@nestjs/common';

const options = {
  _id: 0,
  passwordHash: 0,
  postId: 0,
  emailConfirmation: 0,
  __v: 0,
  parentId: 0,
};

@Injectable()
export class CommentsQueryRepository {
  constructor(
    @InjectModel(Comment.name)
    private readonly commentsModel: Model<CommentsDocument>,
    private pagination: PaginationHelp,
  ) {}
  async findAllComments(
    parentId: string,
    paginationInputDTO: PaginationInputDTO,
    userId: string | null,
  ) {
    return this.pagination.pagination(
      parentId,
      paginationInputDTO,
      this.commentsModel,
      userId,
    );
  }
  async findCommentById(id: string) {
    return this.commentsModel.findOne({ id }, options);
  }
  async findCommentByIdWithLikes(id: string, userId: string) {
    const findCommentById = await this.commentsModel.find({ id }, options);
    const commentWithLike = await this.pagination.postWithLikeStatus(
      findCommentById,
      userId,
    );
    return commentWithLike[0];
  }
}
