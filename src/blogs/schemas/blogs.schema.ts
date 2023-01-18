import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model, Types } from 'mongoose';
import { CreateBlogDto } from '../dto/input-blog.dto';
import * as mongoose from 'mongoose';
import ObjectId = mongoose.Types.ObjectId;

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
  userId: string;

  checkName(name) {
    return `${name} + hello `;
  }

  static createNewBlog(
    blog: CreateBlogDto,
    BlogModel: BlogsModelType,
    userId: string,
  ) {
    const newBlog = new BlogModel(blog);
    newBlog.id = new ObjectId();
    newBlog.createdAt = new Date();
    newBlog.userId = userId;
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
