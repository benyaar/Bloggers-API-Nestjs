import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/user.module';
import { BloggersModule } from './bloggers/bloggers.module';
import { PostsModule } from './post/posts.module';
import { DeleteAllModule } from './testing/delete-all.module';
import { AuthModule } from './auth/auth.module';
import { CommentsModule } from './comments/comments.module';
import { ConfigModule } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { EmailModule } from './email/email.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './users/entities/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    UsersModule,
    BloggersModule,
    PostsModule,
    DeleteAllModule,
    AuthModule,
    MongooseModule.forRoot(
      //'mongodb+srv://admin:admin@backapi.wojaaxk.mongodb.net/?retryWrites=true&w=majority',
      'mongodb+srv://admin:admin@cluster0.bwcg5bs.mongodb.net/?retryWrites=true&w=majority',
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
    // TypeOrmModule.forRoot({
    //   type: 'postgres',
    //   host: 'localhost',
    //   port: 5432,
    //   username: 'postgres',
    //   password: 'root',
    //   database: 'bloggers',
    //   autoLoadEntities: true,
    //   synchronize: true,
    //   entities: [UserEntity],
    // }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
