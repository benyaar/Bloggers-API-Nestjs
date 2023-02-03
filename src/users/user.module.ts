import { forwardRef, Module } from '@nestjs/common';
import { UsersController } from './controller/users.controller';
import { UsersService } from './application/users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersRepository } from './repository/users.sql.repository';

import { UsersQueryRepository } from './repository/users.query-repository';
import { EmailModule } from '../email/email.module';
import { User, UserSchema } from './schemas/user.schema';
import {
  RecoveryCode,
  RecoveryCodeSchema,
} from './schemas/recovery-code.schema';
import { PaginationModule } from '../helpers/pagination.module';
import { BloggersModule } from '../bloggers/bloggers.module';
import { UserEntity } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BanInfoEntity } from './entities/ban-info.entity';
import { EmailConfirmationEntity } from './entities/email-info.entity';

@Module({
  imports: [
    EmailModule,
    PaginationModule,
    forwardRef(() => BloggersModule),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: RecoveryCode.name, schema: RecoveryCodeSchema },
    ]),
    TypeOrmModule.forFeature([
      UserEntity,
      BanInfoEntity,
      EmailConfirmationEntity,
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, UsersQueryRepository],
  exports: [UsersService, UsersRepository, UsersQueryRepository],
})
export class UsersModule {}
