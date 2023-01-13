import { registerDecorator, ValidationOptions } from 'class-validator';
import { BlogIdValidator } from './blog-id-validator';

export function IsMongoIdBlogDecorator(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'IsMongoIdBlogDecorator',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      validator: BlogIdValidator,
    });
  };
}
