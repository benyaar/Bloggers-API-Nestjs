import { InjectModel } from '@nestjs/mongoose';
import { Comment, CommentsDocument } from '../schema/comments.schema';
import { Model } from 'mongoose';
import { PaginationInputDTO } from '../../helpers/dto/helpers.dto';
import { pagination, paginationResult } from '../../helpers/pagination';

const options = {
  _id: 0,
  passwordHash: 0,
  postId: 0,
  emailConfirmation: 0,
  __v: 0,
};

export class CommentsQueryRepository {
  constructor(
    @InjectModel(Comment.name)
    private readonly commentsModel: Model<CommentsDocument>,
  ) {}
  async findAllComments(
    parentId: string,
    paginationInputDTO: PaginationInputDTO,
  ) {
    return pagination(parentId, paginationInputDTO, this.commentsModel);
  }
  async findCommentById(id: string) {
    return this.commentsModel.findOne({ id }, options);
  }
}
