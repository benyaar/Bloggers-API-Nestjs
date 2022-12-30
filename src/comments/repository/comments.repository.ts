import { InjectModel } from '@nestjs/mongoose';
import {
  CommentsDocument,
  Comment,
  CommentDBModalType,
} from '../schema/comments.schema';
import { Model } from 'mongoose';
import { UpdateCommentDto } from '../dto/update-comment.dto';

export class CommentsRepository {
  constructor(
    @InjectModel(Comment.name)
    private readonly commentsModel: Model<CommentsDocument>,
  ) {}
  async saveNewComment(newComment: CommentDBModalType) {
    return this.commentsModel.insertMany(newComment);
  }
  async updateCommentById(id: string, updateCommentDto: UpdateCommentDto) {
    return this.commentsModel.updateOne(
      { id },
      { $set: { content: updateCommentDto.content } },
    );
  }
  async deleteCommentById(id: string) {
    return this.commentsModel.deleteOne({ id });
  }
}
