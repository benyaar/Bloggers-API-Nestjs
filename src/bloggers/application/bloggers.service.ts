import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BloggersRepository } from '../repository/bloggers.repository';
import { CreateBlogDto, PostInputDTO } from '../dto/input-bloggers.dto';
import { Blog, BlogsModelType, BlogsViewModel } from '../schemas/blogs.schema';
import { InjectModel } from '@nestjs/mongoose';
import { BloggersQueryRepository } from '../repository/bloggers.query-repository';
import { PostsService } from '../../post/application/posts.service';
import {
  PaginationBannedUserInputDTO,
  PaginationInputDTO,
} from '../../helpers/dto/helpers.dto';
import { PostQueryRepository } from '../../post/repository/post.query-repository';
import { UserViewType } from '../../users/schemas/user.schema';
import { CreatePostDto } from '../../post/dto/create-post.dto';
import { BanUserDto } from '../dto/ban-user.dto';
import { UsersQueryRepository } from '../../users/repository/users.query-repository';
import { BannedUserType } from '../schemas/banned-User.schema';
import * as mongoose from 'mongoose';
import ObjectId = mongoose.Types.ObjectId;

@Injectable()
export class BloggersService {
  constructor(
    private blogsRepository: BloggersRepository,
    private postsService: PostsService,
    @InjectModel(Blog.name)
    private BlogModel: BlogsModelType,
    private blogQueryRepository: BloggersQueryRepository,
    private postQueryRepository: PostQueryRepository,
    private userQueryRepository: UsersQueryRepository,
  ) {}
  async createNewBlog(
    blog: CreateBlogDto,
    user: UserViewType,
  ): Promise<BlogsViewModel> {
    const newBlog = this.BlogModel.createNewBlog(
      blog,
      this.BlogModel,
      user.id,
      user.login,
    );

    const savedBlog = await this.blogsRepository.saveBlogInDB(newBlog);
    if (!savedBlog) throw new BadRequestException();
    return new BlogsViewModel(
      savedBlog.id,
      savedBlog.name,
      savedBlog.description,
      savedBlog.websiteUrl,
      savedBlog.createdAt,
    );
  }

  async updateBlogById(blogId: string, blog: CreateBlogDto, userId: string) {
    const findBlogById = await this.blogQueryRepository.findBlogByIdWithUserId(
      blogId,
    );
    if (!findBlogById) throw new NotFoundException([]);
    if (findBlogById.blogOwnerInfo.userId !== userId)
      throw new ForbiddenException([]);

    return this.blogsRepository.updateBlogById(blogId, blog, userId);
  }

  async deleteBlogById(id: string, userId: string) {
    const findBlogById = await this.blogQueryRepository.findBlogByIdWithUserId(
      id,
    );

    if (!findBlogById) throw new NotFoundException([]);
    await this.blogsRepository.deleteBlogById(id, userId);
    if (findBlogById.blogOwnerInfo.userId !== userId)
      throw new ForbiddenException([]);
    return;
  }

  async createPostByBlogId(
    id: string,
    postInputDTO: PostInputDTO,
    userId: string,
  ) {
    const findBlogById = await this.blogQueryRepository.findBlogByIdWithUserId(
      id,
    );
    if (!findBlogById) throw new NotFoundException([]);
    if (findBlogById.blogOwnerInfo.userId !== userId)
      throw new ForbiddenException([]);

    const postData = { ...postInputDTO, blogId: id, userId: userId };
    return this.postsService.createNewPost(postData);
  }

  async findAllPostsByBlogId(
    id: string,
    paginationInputDTO: PaginationInputDTO,
    userId: string | null,
  ) {
    const findBlogById = await this.blogQueryRepository.findBlogById(id);
    if (!findBlogById) throw new NotFoundException([]);

    return await this.postQueryRepository.findBlogsPosts(
      paginationInputDTO,
      id,
      userId,
    );
  }

  async findAllBlogs(paginationInputType: PaginationInputDTO, userId: string) {
    return this.blogQueryRepository.findAllBlogs(
      paginationInputType,
      userId,
      'user',
    );
  }

  async updateBlogPostById(
    id: string,
    postId: string,
    userId: string,
    createPostDto: CreatePostDto,
  ) {
    const findBlogById = await this.blogQueryRepository.findBlogById(id);
    if (!findBlogById) throw new NotFoundException([]);
    return this.postsService.updatePostById(postId, userId, createPostDto);
  }

  async deleteBlogPostById(id: string, postId: string, userId: string) {
    const findBlogById = await this.blogQueryRepository.findBlogById(id);
    if (!findBlogById) throw new NotFoundException([]);
    return this.postsService.deletePostById(postId, userId);
  }

  async addUserInBan(id: string, banUserDto: BanUserDto, ownerId: string) {
    const findBlogById = await this.blogQueryRepository.findBlogByIdWithUserId(
      banUserDto.blogId,
    );
    if (!findBlogById) throw new NotFoundException([]);

    if (findBlogById.blogOwnerInfo.userId !== ownerId)
      throw new ForbiddenException([]);

    const findUser = await this.userQueryRepository.findUserById(id);
    console.log(findUser);
    if (!findUser) throw new NotFoundException([]);
    const banInfo = new BannedUserType(id, findUser.login, banUserDto.blogId, {
      isBanned: banUserDto.isBanned,
      banDate: new Date(),
      banReason: banUserDto.banReason,
    });

    console.log(banInfo);
    return this.blogsRepository.addUserInBan(banInfo);
  }
}
