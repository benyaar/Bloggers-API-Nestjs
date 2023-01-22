import { Module } from '@nestjs/common';

import { PaginationHelp } from './pagination';
import { MongooseModule } from '@nestjs/mongoose';
import {
  LikeStatus,
  LikeStatusSchema,
} from '../post/schemas/like-status.schema';
import {
  BannedUser,
  BannedUserSchema,
} from '../bloggers/schemas/banned-User.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: LikeStatus.name, schema: LikeStatusSchema },
      { name: BannedUser.name, schema: BannedUserSchema },
    ]),
  ],
  providers: [PaginationHelp],
  exports: [PaginationHelp],
})
export class PaginationModule {}
