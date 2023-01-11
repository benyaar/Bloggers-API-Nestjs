import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type LikeStatusDocument = HydratedDocument<LikeStatus>;

@Schema()
export class LikeStatus {
  @Prop()
  parentId: string;
  @Prop()
  userId: string;
  @Prop()
  login: string;
  @Prop()
  likeStatus: string;
  @Prop()
  addedAt: Date;
}

export const LikeStatusSchema = SchemaFactory.createForClass(LikeStatus);

export class LikeStatusType {
  constructor(
    public parentId: string,
    public userId: string,
    public login: string,
    public likeStatus: string,
    public addedAt: Date,
  ) {}
}
