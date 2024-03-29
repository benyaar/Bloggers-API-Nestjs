import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

class LikesInfo {
  @Prop()
  likesCount: number;
  @Prop()
  dislikesCount: number;
  @Prop()
  myStatus: string;
}
class PostInfo {
  @Prop()
  title: string;
  @Prop()
  blogId: string;
  @Prop()
  blogName: string;
}

@Schema()
export class Comment {
  @Prop()
  id: string;
  @Prop()
  content: string;
  @Prop()
  userId: string;
  @Prop()
  userLogin: string;
  @Prop()
  createdAt: Date;
  @Prop()
  parentId: string;
  @Prop()
  likesInfo: LikesInfo;
  @Prop()
  postInfo: PostInfo;
}

export const CommentsSchema = SchemaFactory.createForClass(Comment);
export type CommentsDocument = HydratedDocument<Comment>;

export class CommentDBModalType {
  constructor(
    public id: string,
    public content: string,
    public userId: string,
    public userLogin: string,
    public createdAt: Date,
    public parentId: string,
    public likesInfo: {
      likesCount: number;
      dislikesCount: number;
      myStatus: string;
    },
    public postInfo: {
      title: string;
      blogId: string;
      blogName: string;
    },
  ) {}
}

export class CommentViewType {
  constructor(
    public id: string,
    public content: string,
    public userId: string,
    public userLogin: string,
    public createdAt: Date,
    public likesInfo: {
      likesCount: number;
      dislikesCount: number;
      myStatus: string;
    },
  ) {}
}
