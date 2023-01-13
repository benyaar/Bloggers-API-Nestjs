import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { BlogQueryRepository } from '../../blogs/repository/blog.query-repository';

@ValidatorConstraint({ name: 'IsMongoObjectId', async: true })
@Injectable()
export class BlogIdValidator implements ValidatorConstraintInterface {
  constructor(private readonly blogQueryRepository: BlogQueryRepository) {}
  async validate(blogId: string) {
    try {
      const blog = await this.blogQueryRepository.findBlogById(blogId);
      if (!blog) return false;
    } catch (e) {
      return false;
    }
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return 'Blog doesn`t exist';
  }
}
