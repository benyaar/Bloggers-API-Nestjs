import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PostsRepository } from '../repository/posts.repository';
import { PostDBType } from '../schemas/post.schema';
import * as mongoose from 'mongoose';
import ObjectId = mongoose.Types.ObjectId;
import { CreatePostDto, CreatePostDtoWithUserId } from '../dto/create-post.dto';
import { PostQueryRepository } from '../repository/post.query-repository';
import { CreateCommentDto } from '../dto/create-comment.dto';
import { CommentsService } from '../../comments/application/comments.service';
import { PaginationInputDTO } from '../../helpers/dto/helpers.dto';
import { CommentsQueryRepository } from '../../comments/repository/comments.query-repository';
import { UserViewType } from '../../users/schemas/user.schema';
import { LikeStatusType } from '../schemas/like-status.schema';
import { UsersQueryRepository } from '../../users/repository/users.query-repository';
import { InjectModel } from '@nestjs/mongoose';
import {
  BannedUser,
  BannedUserDocument,
} from '../../bloggers/schemas/banned-User.schema';
import { Model } from 'mongoose';

@Injectable()
export class PostsService {
  constructor(
    private postsRepository: PostsRepository,
    private postQueryRepository: PostQueryRepository,
    private commentsService: CommentsService,
    private commentsQueryRepository: CommentsQueryRepository,
    @InjectModel(BannedUser.name)
    private readonly bannedUserModel: Model<BannedUserDocument>,
  ) {}
  async createNewPost(createPostDto: CreatePostDtoWithUserId) {
    const findBlogById = await this.postQueryRepository.findBlogById(
      createPostDto.blogId,
    );

    if (!findBlogById)
      throw new NotFoundException([
        { message: 'blogId undefined', field: 'createNewPost' },
      ]);

    const newPost = new PostDBType(
      new ObjectId().toString(),
      createPostDto.title,
      createPostDto.shortDescription,
      createPostDto.content,
      findBlogById.id,
      findBlogById.id,
      findBlogById.name,
      new Date(),
      createPostDto.userId,
      {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: 'None',
        newestLikes: [],
      },
    );
    await this.postsRepository.createNewPost(newPost);
    const { parentId, userId, ...newPostcopy } = newPost;
    return newPostcopy;
  }
  async updatePostById(
    id: string,
    userId: string,
    createPostDto: CreatePostDto,
  ) {
    const findPostById = await this.postQueryRepository.findPostWithUser(id);
    if (!findPostById) throw new NotFoundException([]);
    if (findPostById.userId !== userId) throw new ForbiddenException([]);

    return this.postsRepository.updatePostById(id, userId, createPostDto);
  }
  async deletePostById(id: string, userId: string) {
    const findPostById = await this.postQueryRepository.findPostWithUser(id);
    if (!findPostById) throw new NotFoundException([]);
    if (findPostById.userId !== userId) throw new ForbiddenException([]);
    return this.postsRepository.deletePostById(id, userId);
  }
  async createNewCommentByPostId(
    id: string,
    createCommentDto: CreateCommentDto,
    user: UserViewType,
  ) {
    const findPostById = await this.postQueryRepository.findPostById(id);
    if (!findPostById) throw new NotFoundException([]);

    const findUserInBanList = await this.bannedUserModel.findOne({
      blogId: findPostById.blogId,
      userId: user.id,
    });
    if (findUserInBanList) throw new ForbiddenException([]);

    return this.commentsService.createNewComment(id, createCommentDto, user);
  }
  async findAllCommentsForPost(
    id: string,
    paginationInputDTO: PaginationInputDTO,
    userId: string | null,
  ) {
    const findPostById = await this.postQueryRepository.findPostById(id);
    if (!findPostById) throw new NotFoundException([]);
    return this.commentsQueryRepository.findAllComments(
      id,
      paginationInputDTO,
      userId,
    );
  }
  async updateLikeStatus(
    user: UserViewType,
    postId: string,
    likeStatus: string,
  ) {
    const findPostById = await this.postQueryRepository.findPostById(postId);
    if (!findPostById) throw new NotFoundException([]);

    const likeStatusModel = new LikeStatusType(
      postId,
      user.id,
      user.login,
      likeStatus,
      new Date(),
    );

    return this.postsRepository.updateLikeStatus(likeStatusModel);
  }
}
