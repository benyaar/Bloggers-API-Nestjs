import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AuthService } from './application/auth.service';
import { AuthController } from './controller/auth.controller';
import { UsersModule } from '../users/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { BasicStrategy } from './strategies/basic.strategy';
import { MongooseModule } from '@nestjs/mongoose';
import { Attempt, AttemptSchema } from './schemas/attempts.schema';
import { AttemptsMiddleware } from './middleware/attempt.middleware';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: `${process.env.JWT_SECRET_KEY}`,
    }),
    MongooseModule.forFeature([{ name: Attempt.name, schema: AttemptSchema }]),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, BasicStrategy],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AttemptsMiddleware).forRoutes(
      {
        path: '/auth/registration-email-resending',
        method: RequestMethod.POST,
      },
      {
        path: '/auth/registration',
        method: RequestMethod.POST,
      },
      {
        path: '/auth/login',
        method: RequestMethod.POST,
      },
    );
  }
}
