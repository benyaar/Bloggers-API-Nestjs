import { InjectModel } from '@nestjs/mongoose';
import { Comment, CommentsDocument } from '../schema/comments.schema';
import { Model } from 'mongoose';
import { PaginationInputDTO } from '../../helpers/dto/helpers.dto';
import { PaginationHelp } from '../../helpers/pagination';
import { Inject, Injectable } from '@nestjs/common';
import { User, UsersDocument } from '../../users/schemas/user.schema';

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
    @InjectModel(User.name)
    private readonly userModel: Model<UsersDocument>,
  ) {}

  async findAllComments(
    parentId: string,
    paginationInputDTO: PaginationInputDTO,
    userId: string | null,
  ) {
    const findAndSortedDocuments = await this.pagination.pagination(
      parentId,
      paginationInputDTO,
      this.commentsModel,
      userId,
    );

    const findCommentsWithLikes = await this.pagination.commentsWithLikeStatus(
      findAndSortedDocuments.findAndSorteDocuments,
      userId,
    );
    return this.pagination.paginationResult(
      findAndSortedDocuments.pageNumber,
      findAndSortedDocuments.pageSize,
      findAndSortedDocuments.getCountDocuments,
      findCommentsWithLikes,
    );
  }

  async findCommentById(id: string) {
    return this.commentsModel.findOne({ id }, options);
  }

  async findCommentByIdWithLikes(id: string, userId: string) {
    const bannedUsersIds = await this.userModel.distinct('id', {
      'banInfo.isBanned': true,
    });
    const findCommentById = await this.commentsModel.find(
      { id, userId: { $nin: bannedUsersIds } },
      options,
    );
    const commentWithLike = await this.pagination.commentsWithLikeStatus(
      findCommentById,
      userId,
    );
    return commentWithLike[0];
  }
}
