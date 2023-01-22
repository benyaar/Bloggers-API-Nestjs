import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { CreateBlogDto } from '../dto/input-bloggers.dto';
import * as mongoose from 'mongoose';
import ObjectId = mongoose.Types.ObjectId;

export class BlogOwnerInfo {
  @Prop()
  userId: string;
  @Prop()
  userLogin: string;
}

export class BanInfo {
  @Prop()
  banDate: Date | null;
  @Prop()
  isBanned: boolean;
}
@Schema()
export class Blog {
  @Prop()
  id: string;
  @Prop()
  name: string;
  @Prop()
  description: string;
  @Prop()
  websiteUrl: string;
  @Prop()
  createdAt: Date;
  @Prop()
  blogOwnerInfo: BlogOwnerInfo;
  @Prop()
  banInfo: BanInfo;

  checkName(name) {
    return `${name} + hello `;
  }

  static createNewBlog(
    blog: CreateBlogDto,
    BlogModel: BlogsModelType,
    userId: string,
    userLogin: string,
  ) {
    const newBlog = new BlogModel(blog);
    newBlog.id = new ObjectId();
    newBlog.createdAt = new Date();
    newBlog.blogOwnerInfo = { userId, userLogin };
    newBlog.banInfo = { banDate: null, isBanned: false };
    return newBlog;
  }
}

export const BlogSchema = SchemaFactory.createForClass(Blog);
BlogSchema.methods = {
  checkName: Blog.prototype.checkName,
};
BlogSchema.statics = {
  createNewBlog: Blog.createNewBlog,
};

export type BlogModelStaticType = {
  createNewBlog: (
    blog: CreateBlogDto,
    BlogModel: BlogsModelType,
    userId: string,
    userLogin: string,
  ) => BlogsDocument;
};
export type BlogsDocument = HydratedDocument<Blog>;

export type BlogsModelType = Model<BlogsDocument> & BlogModelStaticType;

export class BlogsViewModel {
  constructor(
    public id: string,
    public name: string,
    public description: string,
    public websiteUrl: string,
    public createdAt: Date,
  ) {}
}
