import { Module } from '@nestjs/common';
import { UsersController } from './controller/users.controller';
import { UsersService } from './application/users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersRepository } from './repository/users.repository';

import { UsersQueryRepository } from './repository/users.query-repository';
import { EmailModule } from '../email/email.module';
import { User, UserSchema } from './schemas/user.schema';
import {
  RecoveryCode,
  RecoveryCodeSchema,
} from './schemas/recovery-code.schema';
import { PaginationModule } from '../helpers/pagination.module';
import { BlogsModule } from '../blogs/blogs.module';

@Module({
  imports: [
    EmailModule,
    PaginationModule,
    BlogsModule,
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: RecoveryCode.name, schema: RecoveryCodeSchema },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, UsersQueryRepository],
  exports: [UsersService, UsersRepository, UsersQueryRepository],
})
export class UsersModule {}
