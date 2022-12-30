import { InjectModel } from '@nestjs/mongoose';
import {
  CommentsDocument,
  Comment,
  CommentDBModalType,
} from '../schema/comments.schema';
import { Model } from 'mongoose';

export class CommentsRepository {
  constructor(
    @InjectModel(Comment.name)
    private readonly commentsModel: Model<CommentsDocument>,
  ) {}
  async saveNewComment(newComment: CommentDBModalType) {
    return this.commentsModel.insertMany(newComment);
  }
}
