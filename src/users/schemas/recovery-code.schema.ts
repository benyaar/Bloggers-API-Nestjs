import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type RecoveryCodeDocument = HydratedDocument<RecoveryCode>;

@Schema()
export class RecoveryCode {
  @Prop()
  email: string;
  @Prop()
  recoveryCode: string;
}

export const RecoveryCodeSchema = SchemaFactory.createForClass(RecoveryCode);

export type RecoveryCodeType = {
  email: string;
  recoveryCode: string;
};
