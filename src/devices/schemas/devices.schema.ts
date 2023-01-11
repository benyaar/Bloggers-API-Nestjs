import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type DeviceDocument = HydratedDocument<Device>;
@Schema()
export class Device {
  @Prop()
  ip: string;
  @Prop()
  title: string;
  @Prop()
  lastActiveDate: Date;
  @Prop()
  deviceId: string;
  @Prop()
  userId: string;
}
export const DeviceSchema = SchemaFactory.createForClass(Device);

export class DeviceType {
  constructor(
    public ip: string,
    public title: string,
    public lastActiveDate: Date,
    public deviceId: string,
    public userId: string,
  ) {}
}
