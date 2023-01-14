import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DevicesController } from './controller/devices.controller';
import { DevicesService } from './application/devices.service';
import { DevicesRepository } from './repository/devices.repository';
import { Device, DeviceSchema } from './schemas/devices.schema';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    MongooseModule.forFeature([{ name: Device.name, schema: DeviceSchema }]),
  ],
  controllers: [DevicesController],
  providers: [DevicesService, DevicesRepository],
  exports: [DevicesService, DevicesRepository],
})
export class DeviceModule {}
