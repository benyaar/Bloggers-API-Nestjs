import { Module } from '@nestjs/common';

import { PaginationHelp } from './pagination';
import { MongooseModule } from '@nestjs/mongoose';
import {
  LikeStatus,
  LikeStatusSchema,
} from '../post/schemas/like-status.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: LikeStatus.name, schema: LikeStatusSchema },
    ]),
  ],
  providers: [PaginationHelp],
  exports: [PaginationHelp],
})
export class PaginationModule {}
