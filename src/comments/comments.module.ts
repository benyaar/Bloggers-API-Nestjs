import { forwardRef, Module } from '@nestjs/common';
import { CommentsService } from './application/comments.service';
import { CommentsController } from './controller/comments.controller';
import { CommentsRepository } from './repository/comments.repository';
import { CommentsQueryRepository } from './repository/comments.query-repository';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentsSchema, Comment } from './schema/comments.schema';
import { PaginationModule } from '../helpers/pagination.module';
import { PostsModule } from '../post/posts.module';
import {
  LikeStatus,
  LikeStatusSchema,
} from '../post/schemas/like-status.schema';
import { User, UserSchema } from '../users/schemas/user.schema';
import { UsersModule } from '../users/user.module';

@Module({
  imports: [
    PaginationModule,
    MongooseModule.forFeature([
      { name: Comment.name, schema: CommentsSchema },
      { name: LikeStatus.name, schema: LikeStatusSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [CommentsController],
  providers: [CommentsService, CommentsRepository, CommentsQueryRepository],
  exports: [CommentsService, CommentsRepository, CommentsQueryRepository],
})
export class CommentsModule {}
