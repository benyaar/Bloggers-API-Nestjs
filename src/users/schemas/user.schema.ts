import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UsersDocument = HydratedDocument<User>;

export class EmailConfirmation {
  @Prop()
  confirmationCode: string;
  @Prop()
  expirationDate: Date;
  @Prop()
  isConfirmed: boolean;
}

export class BanInfo {
  @Prop()
  banDate: Date | null;
  @Prop()
  banReason: string | null;
  @Prop()
  isBanned: boolean;
}

@Schema()
export class User {
  @Prop()
  id: string;
  @Prop()
  login: string;
  @Prop()
  email: string;
  @Prop()
  passwordHash: string;
  @Prop()
  createdAt: Date;
  @Prop()
  emailConfirmation: EmailConfirmation;
  @Prop()
  banInfo: BanInfo;
}

export const UserSchema = SchemaFactory.createForClass(User);

export class UserViewType {
  constructor(
    public id: string,
    public login: string,
    public email: string,
    public passwordHash: string,
    public createdAt: Date,
    public emailConfirmation: {
      confirmationCode: string;
      expirationDate: Date;
      isConfirmed: boolean;
    },
    public banInfo: {
      banDate: Date | null;
      banReason: string | null;
      isBanned: boolean;
    },
  ) {}
}
