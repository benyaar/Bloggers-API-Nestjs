import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogsDocument } from '../../bloggers/schemas/blogs.schema';
import { Model } from 'mongoose';
import { Post, PostsDocument } from '../schemas/post.schema';
import { PaginationInputDTO } from '../../helpers/dto/helpers.dto';
import { PaginationHelp } from '../../helpers/pagination';
import { User, UsersDocument } from '../../users/schemas/user.schema';
import { NotFoundException } from '@nestjs/common';

const options = {
  _id: 0,
  passwordHash: 0,
  postId: 0,
  emailConfirmation: 0,
  __v: 0,
  parentId: 0,
  userId: 0,
};

export class PostQueryRepository {
  constructor(
    @InjectModel(Post.name)
    private readonly postsModel: Model<PostsDocument>,
    @InjectModel(Blog.name)
    private readonly blogsModel: Model<BlogsDocument>,
    private pagination: PaginationHelp,
    @InjectModel(User.name)
    private readonly userModel: Model<UsersDocument>,
  ) {}
  async findBlogById(blogId: string) {
    const bannedUsersIds = await this.userModel.distinct('id', {
      'banInfo.isBanned': true,
    });

    return this.blogsModel.findOne({
      id: blogId,
      userId: { $nin: bannedUsersIds },
    });
  }
  async findAllPosts(
    paginationInputDTO: PaginationInputDTO,
    userId: string | null,
  ) {
    const findAndSorteDocuments = await this.pagination.pagination(
      null,
      paginationInputDTO,
      this.postsModel,
      userId,
      'user',
    );
    const bannedUsersIds = await this.userModel.distinct('id', {
      'banInfo.isBanned': true,
    });
    const findPostsWithLikes = await this.pagination.postWithLikeStatus(
      findAndSorteDocuments.findAndSorteDocuments,
      userId,
      bannedUsersIds,
    );
    return this.pagination.paginationResult(
      findAndSorteDocuments.pageNumber,
      findAndSorteDocuments.pageSize,
      findAndSorteDocuments.getCountDocuments,
      findPostsWithLikes,
    );
  }
  async findPostById(id: string) {
    return this.postsModel.findOne({ id }, options);
  }
  async findPostWithUser(id: string) {
    return this.postsModel.findOne({ id });
  }
  async findBlogsPosts(
    paginationInputDTO: PaginationInputDTO,
    blogId: string,
    userId: string | null,
  ) {
    const bannedUsersIds = await this.userModel.distinct('id', {
      'banInfo.isBanned': true,
    });

    const findAndSortedDocuments = await this.pagination.pagination(
      blogId,
      paginationInputDTO,
      this.postsModel,
      userId,
      'user',
    );

    const findPostsWithLikes = await this.pagination.postWithLikeStatus(
      findAndSortedDocuments.findAndSorteDocuments,
      userId,
      bannedUsersIds,
    );
    return this.pagination.paginationResult(
      findAndSortedDocuments.pageNumber,
      findAndSortedDocuments.pageSize,
      findAndSortedDocuments.getCountDocuments,
      findPostsWithLikes,
    );
  }
  async findPostByIdWithLike(id: string, userId: string | null) {
    const findsPostById = await this.postsModel.find({ id }, options);
    const findPost = await this.postsModel.findOne({ id }, options);
    const findBlogId = await this.blogsModel.findOne({ id: findPost.blogId });

    if (findBlogId.banInfo.isBanned) throw new NotFoundException([]);

    const bannedUsersIds = await this.userModel.distinct('id', {
      'banInfo.isBanned': true,
    });
    const postWithLike = await this.pagination.postWithLikeStatus(
      findsPostById,
      userId,
      bannedUsersIds,
    );
    return postWithLike[0];
  }
}
