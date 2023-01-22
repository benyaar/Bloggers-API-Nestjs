import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { HydratedDocument } from 'mongoose';

export class BanUserInfo {
  @Prop()
  isBanned: false;
  @Prop()
  banDate: Date;
  @Prop()
  banReason: string;
}

@Schema()
export class BannedUser {
  @Prop()
  id: string;
  @Prop()
  login: string;
  @Prop()
  blogId: string;
  @Prop()
  banInfo: BanUserInfo;
}

export const BannedUserSchema = SchemaFactory.createForClass(BannedUser);
export type BannedUserDocument = HydratedDocument<BannedUser>;

export class BannedUserType {
  constructor(
    public id: string,
    public login: string,
    public blogId: string,
    public banInfo: {
      isBanned: boolean;
      banDate: Date;
      banReason: string;
    },
  ) {}
}
