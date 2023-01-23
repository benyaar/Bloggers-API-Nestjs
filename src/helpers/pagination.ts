import {
  Blog,
  BlogsDocument,
  BlogsViewModel,
} from '../bloggers/schemas/blogs.schema';
import { Post, PostsDocument, PostViewType } from '../post/schemas/post.schema';
import { UserViewType } from '../users/schemas/user.schema';
import {
  Comment,
  CommentsDocument,
  CommentViewType,
} from '../comments/schema/comments.schema';
import {
  PaginationBannedUserInputDTO,
  PaginationInputDTO,
  PaginationUserInputDTO,
} from './dto/helpers.dto';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  LikeStatus,
  LikeStatusDocument,
} from '../post/schemas/like-status.schema';
import { Model } from 'mongoose';
import {
  BannedUser,
  BannedUserDocument,
  BannedUserType,
} from '../bloggers/schemas/banned-User.schema';

const optionsForUser = {
  _id: 0,
  passwordHash: 0,
  parentId: 0,
  emailConfirmation: 0,
  __v: 0,
  userId: 0,
  blogOwnerInfo: 0,
  banInfo: 0,
};
const optionsForSa = {
  _id: 0,
  passwordHash: 0,
  parentId: 0,
  emailConfirmation: 0,
  __v: 0,
  userId: 0,
};
const optionsForBannedUser = {
  _id: 0,
  __v: 0,
  blogId: 0,
};

@Injectable()
export class PaginationHelp {
  constructor(
    @InjectModel(LikeStatus.name)
    private readonly likeStatusModel: Model<LikeStatusDocument>,
    @InjectModel(BannedUser.name)
    private readonly bannedUserModel: Model<BannedUserDocument>,
    @InjectModel(Post.name)
    private readonly postModel: Model<PostsDocument>,
    @InjectModel(Blog.name)
    private readonly blogModel: Model<BlogsDocument>,
    @InjectModel(Comment.name)
    private readonly commentModel: Model<CommentsDocument>,
  ) {}
  async pagination(
    parentId: string | null,
    paginationInputDTO: PaginationInputDTO,
    modelMongo: any,
    userId: string | null,
    superAdmin: string,
  ) {
    const searchNameTerm: string = paginationInputDTO.searchNameTerm;
    const sortBy: string = paginationInputDTO.sortBy;
    const pageNumber: number = +paginationInputDTO.pageNumber;
    const pageSize: number = +paginationInputDTO.pageSize;
    let sortDirection: any = paginationInputDTO.sortDirection;

    if (sortDirection !== ('asc' || 'desc')) sortDirection = 'desc';

    let options;
    if (superAdmin === 'admin') {
      options = optionsForSa;
    } else {
      options = optionsForUser;
    }

    let searchParentId;
    if (!parentId) {
      searchParentId = 'null';
    } else {
      searchParentId = 'parentId';
    }
    let searchUserId;
    if (!userId) {
      searchUserId = 'null';
    } else {
      searchUserId = 'blogOwnerInfo.userId';
    }
    let isBanned;
    if (superAdmin === 'admin') {
      isBanned = 'null';
    } else {
      isBanned = 'banInfo.isBanned';
    }
    const findAndSorteDocuments = await modelMongo
      .find(
        {
          name: { $regex: searchNameTerm, $options: 'i' },
          [searchParentId]: parentId,
          [searchUserId]: userId,
          [isBanned]: false,
        },
        options,
      )
      .lean()
      .sort({ [sortBy]: sortDirection })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize);

    const getCountDocuments = await modelMongo.countDocuments({
      [searchParentId]: parentId,
      name: { $regex: searchNameTerm, $options: 'i' },
      [searchUserId]: userId,
      [isBanned]: false,
    });

    return {
      pageNumber,
      pageSize,
      getCountDocuments,
      findAndSorteDocuments,
    };
  }

  async paginationResult(
    pageNumber: number,
    pageSize: number,
    itemsCount: number,
    items:
      | BlogsViewModel[]
      | PostViewType[]
      | UserViewType[]
      | CommentViewType[]
      | BannedUserType[],
  ) {
    const pagesCount = Math.ceil(itemsCount / pageSize);
    return {
      pagesCount,
      page: pageNumber,
      pageSize,
      totalCount: itemsCount,
      items,
    };
  }

  async postWithLikeStatus(
    findAndSortedPost: any,
    userId: string | null,
    bannedUsersId: string[],
  ) {
    const postWithLikeStatus = [];
    for (const post of findAndSortedPost) {
      const countLikes = await this.likeStatusModel.countDocuments({
        parentId: post.id,
        likeStatus: 'Like',
        userId: { $nin: bannedUsersId },
      });
      const countDislikes = await this.likeStatusModel.countDocuments({
        parentId: post.id,
        likeStatus: 'Dislike',
        userId: { $nin: bannedUsersId },
      });
      const findPostWithLikesByUserId = await this.likeStatusModel.findOne({
        parentId: post.id,
        $and: [{ userId: userId }, { userId: { $nin: bannedUsersId } }],
      });
      const findNewestPost = await this.likeStatusModel.find(
        {
          parentId: post.id,
          likeStatus: 'Like',
          userId: { $nin: bannedUsersId },
        },
        { _id: 0, __v: 0, parentId: 0, likeStatus: 0 },
        { sort: { _id: -1 }, limit: 3 },
      );

      post.extendedLikesInfo.likesCount = countLikes;
      post.extendedLikesInfo.dislikesCount = countDislikes;
      post.extendedLikesInfo.newestLikes = findNewestPost;

      if (findPostWithLikesByUserId) {
        post.extendedLikesInfo.myStatus = findPostWithLikesByUserId.likeStatus;
      } else {
        post.extendedLikesInfo.myStatus = 'None';
      }

      postWithLikeStatus.push(post);
    }
    return postWithLikeStatus;
  }

  async commentsWithLikeStatus(
    findAndSortedComments: any,
    userId: string | null,
    bannedUsersId: string[] | null,
  ) {
    const commentWithLikeStatus = [];
    for (const comment of findAndSortedComments) {
      const countLikes = await this.likeStatusModel.countDocuments({
        parentId: comment.id,
        likeStatus: 'Like',
        userId: { $nin: bannedUsersId },
      });
      const countDislikes = await this.likeStatusModel.countDocuments({
        parentId: comment.id,
        likeStatus: 'Dislike',
        userId: { $nin: bannedUsersId },
      });
      const findCommentWithLikesByUserId = await this.likeStatusModel.findOne({
        parentId: comment.id,
        $and: [{ userId: userId }, { userId: { $nin: bannedUsersId } }],
      });

      comment.likesInfo.likesCount = countLikes;
      comment.likesInfo.dislikesCount = countDislikes;

      if (findCommentWithLikesByUserId) {
        comment.likesInfo.myStatus = findCommentWithLikesByUserId.likeStatus;
      } else {
        comment.likesInfo.myStatus = 'None';
      }

      commentWithLikeStatus.push(comment);
    }
    return commentWithLikeStatus;
  }

  async getAllBannedUserForBlog(
    id: string,
    inputDTO: PaginationUserInputDTO,
    userId: string,
  ) {
    const searchLoginTerm: string = inputDTO.searchLoginTerm;
    const sortBy: string = inputDTO.sortBy;
    const pageNumber: number = +inputDTO.pageNumber;
    const pageSize: number = +inputDTO.pageSize;
    let sortDirection: any = inputDTO.sortDirection;

    if (sortDirection !== ('asc' || 'desc')) sortDirection = 'desc';
    const findAndSortedDocuments = await this.bannedUserModel
      .find(
        {
          name: { $regex: searchLoginTerm, $options: 'i' },
          blogId: id,
          'banInfo.isBanned': true,
        },
        optionsForBannedUser,
      )
      .lean()
      .sort({ [sortBy]: sortDirection })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize);

    const getCountDocuments = await this.bannedUserModel.countDocuments({
      name: { $regex: searchLoginTerm, $options: 'i' },
      blogId: id,
      'banInfo.isBanned': true,
    });

    return {
      pageNumber,
      pageSize,
      getCountDocuments,
      findAndSortedDocuments,
    };
  }

  async getCommentsForBlog(inputDTO: PaginationInputDTO, userId: string) {
    const sortBy: string = inputDTO.sortBy;
    const pageNumber: number = +inputDTO.pageNumber;
    const pageSize: number = +inputDTO.pageSize;
    let sortDirection: any = inputDTO.sortDirection;
    if (sortDirection !== ('asc' || 'desc')) sortDirection = 'desc';

    const findBlogByUserId = await this.blogModel.distinct('id', {
      'blogOwnerInfo.userId': userId,
    });

    const findPostByBlogId = await this.postModel.distinct('id', {
      blogId: { $in: findBlogByUserId },
    });

    const findCommentsByPostId = await this.commentModel
      .find({
        parentId: { $in: findPostByBlogId },
      })
      .lean()
      .sort({ [sortBy]: sortDirection })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize);

    const CommentsWithLikeStatus = await this.commentsWithLikeStatus(
      findCommentsByPostId,
      null,
      null,
    );

    const commentsWithInfo = [];

    for (const comment of CommentsWithLikeStatus) {
      const commentInfo = {
        id: comment.id,
        content: comment.content,
        createdAt: new Date(),
        likesInfo: comment.likesInfo,
        commentatorInfo: {
          userId: comment.userId,
          userLogin: comment.userLogin,
        },
        postInfo: {
          id: comment.parentId,
          title: 'string',
          blogId: 'string',
          blogName: 'string',
        },
      };
      commentsWithInfo.push(commentInfo);
    }
    console.log(commentsWithInfo);
    return;
  }
}
