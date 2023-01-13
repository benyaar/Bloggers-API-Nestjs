import { Module } from '@nestjs/common';
import { CommentsService } from './application/comments.service';
import { CommentsController } from './controller/comments.controller';
import { CommentsRepository } from './repository/comments.repository';
import { CommentsQueryRepository } from './repository/comments.query-repository';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentsSchema, Comment } from './schema/comments.schema';
import { PaginationModule } from '../helpers/pagination.module';

@Module({
  imports: [
    PaginationModule,
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentsSchema }]),
  ],
  controllers: [CommentsController],
  providers: [CommentsService, CommentsRepository, CommentsQueryRepository],
  exports: [CommentsService, CommentsRepository, CommentsQueryRepository],
})
export class CommentsModule {}
