import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AttemptsDocument = HydratedDocument<Attempt>;

@Schema()
export class Attempt {
  @Prop()
  userIP: string;
  @Prop()
  url: string;
  @Prop()
  time: Date;
}

export const AttemptSchema = SchemaFactory.createForClass(Attempt);
