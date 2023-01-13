import { InjectModel } from '@nestjs/mongoose';
import {
  CommentsDocument,
  Comment,
  CommentDBModalType,
} from '../schema/comments.schema';
import { Model } from 'mongoose';
import { UpdateCommentDto } from '../dto/update-comment.dto';
import {
  LikeStatus,
  LikeStatusDocument,
  LikeStatusType,
} from '../../post/schemas/like-status.schema';

export class CommentsRepository {
  constructor(
    @InjectModel(Comment.name)
    private readonly commentsModel: Model<CommentsDocument>,
    @InjectModel(LikeStatus.name)
    private readonly likeStatusModel: Model<LikeStatusDocument>,
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

  async updateLikeStatus(likeStatus: LikeStatusType) {
    return this.likeStatusModel.findOneAndUpdate(
      { parentId: likeStatus.parentId, userId: likeStatus.userId },
      { ...likeStatus },
      { upsert: true },
    );
  }
}
