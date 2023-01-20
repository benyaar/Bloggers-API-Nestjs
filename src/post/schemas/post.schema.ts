import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PostsDocument = HydratedDocument<Post>;

class LikesInfo {
  @Prop()
  likesCount: number;
  @Prop()
  dislikesCount: number;
  @Prop()
  myStatus: string;
  @Prop()
  newestLikes: [];
}

@Schema()
export class Post {
  @Prop()
  id: string;
  @Prop()
  title: string;
  @Prop()
  shortDescription: string;
  @Prop()
  content: string;
  @Prop()
  blogId: string;
  @Prop()
  parentId: string;
  @Prop()
  blogName: string;
  @Prop()
  createdAt: Date;
  @Prop()
  userId: string;
  @Prop()
  extendedLikesInfo: LikesInfo;
}

export const PostSchema = SchemaFactory.createForClass(Post);

export class PostDBType {
  constructor(
    public id: string,
    public title: string,
    public shortDescription: string,
    public content: string,
    public blogId: string,
    public parentId: string,
    public blogName: string,
    public createdAt: Date,
    public userId: string,
    public extendedLikesInfo: {
      likesCount: number;
      dislikesCount: number;
      myStatus: string;
      newestLikes: [];
    },
  ) {}
}

export class PostViewType {
  constructor(
    public id: string,
    public title: string,
    public shortDescription: string,
    public content: string,
    public blogId: string,
    public blogName: string,
    public createdAt: Date,
    public extendedLikesInfo: {
      likesCount: number;
      dislikesCount: number;
      myStatus: string;
      newestLikes: [];
    },
  ) {}
}
