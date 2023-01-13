import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/user.module';
import { BlogsModule } from './blogs/blogs.module';
import { PostsModule } from './post/posts.module';
import { DeleteAllModule } from './testing/delete-all.module';
import { AuthModule } from './auth/auth.module';
import { CommentsModule } from './comments/comments.module';
import { ConfigModule } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { EmailModule } from './email/email.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    UsersModule,
    BlogsModule,
    PostsModule,
    DeleteAllModule,
    AuthModule,
    MongooseModule.forRoot(
      'mongodb+srv://admin:admin@backapi.wojaaxk.mongodb.net/?retryWrites=true&w=majority',
      //'mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.6.1',
    ),
    CommentsModule,
    MailerModule.forRoot({
      transport: {
        service: 'gmail',
        auth: {
          user: 'apitestblogger@gmail.com', // generated ethereal user
          pass: 'lfommghhiouvpevu', // generated ethereal password
        },
      },
    }),
    EmailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
