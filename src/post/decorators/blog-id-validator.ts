import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { BlogQueryRepository } from '../../blogs/repository/blog.query-repository';

@ValidatorConstraint({ name: 'IsMongoIdBlogDecorator', async: true })
@Injectable()
export class BlogIdValidator implements ValidatorConstraintInterface {
  constructor(private blogQueryRepository: BlogQueryRepository) {
    console.log(this.blogQueryRepository);
  }
  async validate(blogId: string) {
    try {
      const blog = await this.blogQueryRepository.findBlogById(blogId);
      console.log(blog);
      if (!blog) return false;
      return true;
    } catch (e) {
      return false;
    }
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return 'Blog doesn`t exist';
  }
}
