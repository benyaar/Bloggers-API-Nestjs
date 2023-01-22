import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { HydratedDocument } from 'mongoose';

@Schema()
export class BannedUser {
  @Prop()
  id: string;
  @Prop()
  blogId: string;
  @Prop()
  userId: string;
}

export const BannedUserSchema = SchemaFactory.createForClass(BannedUser);
export type BannedUserDocument = HydratedDocument<BannedUser>;

export class BannedUserType {
  constructor(
    public id: string,
    public blogId: string,
    public userId: string,
  ) {}
}
