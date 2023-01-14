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
  async updateCommentById(
    id: string,
    updateCommentDto: UpdateCommentDto,
    userId: string,
  ) {
    const updateComment = await this.commentsModel.updateOne(
      { id, userId },
      { $set: { content: updateCommentDto.content } },
    );
    return true;
  }
  async deleteCommentById(id: string, userId: string) {
    const deleteComment = await this.commentsModel.deleteOne({ id, userId });
    return true;
  }

  async updateLikeStatus(likeStatus: LikeStatusType) {
    console.log(likeStatus);
    return this.likeStatusModel.findOneAndUpdate(
      { parentId: likeStatus.parentId, userId: likeStatus.userId },
      { ...likeStatus },
      { upsert: true },
    );
  }
}
