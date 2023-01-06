import { Module } from '@nestjs/common';
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
      process.env.DATABASE_NETWORK_URL ||
        'mongodb+srv://admin:admin@backapi.wojaaxk.mongodb.net/?retryWrites=true&w=majority',
    ),
    CommentsModule,
    MailerModule.forRoot({
      transport: {
        service: process.env.NODEMAILER_SERVICE || 'gmail',
        auth: {
          user: process.env.MAIL_USER || 'apitestblogger@gmail.com', // generated ethereal user
          pass: process.env.MAIL_PASS || 'lfommghhiouvpevu', // generated ethereal password
        },
      },
    }),
    EmailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
