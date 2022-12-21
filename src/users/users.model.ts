import * as mongoose from 'mongoose';

export class UsersType {
  constructor(
    public id: string,
    public title: string,
    public description: string,
  ) {}
}

export const UserScheme = new mongoose.Schema<UsersType>({
  id: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
});

export const UserModel = mongoose.model(UsersType.name, UserScheme);
