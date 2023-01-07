import { Module } from '@nestjs/common';
import { UsersController } from './controller/users.controller';
import { UsersService } from './application/users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersRepository } from './repository/users.repository';
import { User, UserSchema } from './schemas/user.schema';
import { UsersQueryRepository } from './repository/users.query-repository';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [
    EmailModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, UsersQueryRepository],
  exports: [UsersService, UsersRepository, UsersQueryRepository],
})
export class UsersModule {}
