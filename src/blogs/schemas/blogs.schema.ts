import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type BlogsDocument = HydratedDocument<Blog>;

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
  // updateName(name: string) {
  //   //business logic
  //   this.name = name;
  // }
}

export const BlogSchema = SchemaFactory.createForClass(Blog);
// BlogSchema.methods = {
//   updateName: Blog.prototype.updateName,
// };

export class BlogsViewType {
  constructor(
    public id: string,
    public name: string,
    public description: string,
    public websiteUrl: string,
    public createdAt: Date,
  ) {}
}

// export class BlogDBType extends BlogsViewType {
//   _id: ObjectId;
//   constructor(
//     id: string,
//     name: string,
//     description: string,
//     websiteUrl: string,
//     createdAt: Date,
//   ) {
//     super(id, name, description, websiteUrl, createdAt);
//     this._id = id;
//   }
// }
