import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TokenBlackListDocument = HydratedDocument<TokenBlackList>;

@Schema()
export class TokenBlackList {
  @Prop()
  refreshToken: string;
}

export const TokenBlackListSchema =
  SchemaFactory.createForClass(TokenBlackList);
