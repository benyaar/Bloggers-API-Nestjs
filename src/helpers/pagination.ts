import { BlogsViewModel } from '../blogs/schemas/blogs.schema';
import { PostViewType } from '../post/schemas/post.schema';
import { UserViewType } from '../users/schemas/user.schema';
import { CommentViewType } from '../comments/schema/comments.schema';
import { PaginationInputDTO } from './dto/helpers.dto';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  LikeStatus,
  LikeStatusDocument,
} from '../post/schemas/like-status.schema';
import { Model } from 'mongoose';

const options = {
  _id: 0,
  passwordHash: 0,
  parentId: 0,
  emailConfirmation: 0,
  __v: 0,
  userId: 0,
};

@Injectable()
export class PaginationHelp {
  constructor(
    @InjectModel(LikeStatus.name)
    private readonly likeStatusModel: Model<LikeStatusDocument>,
  ) {}
  async pagination(
    parentId: string | null,
    paginationInputDTO: PaginationInputDTO,
    modelMongo: any,
    userId: string | null,
  ) {
    const searchNameTerm: string = paginationInputDTO.searchNameTerm;
    const sortBy: string = paginationInputDTO.sortBy;
    const pageNumber: number = +paginationInputDTO.pageNumber;
    const pageSize: number = +paginationInputDTO.pageSize;
    let sortDirection: any = paginationInputDTO.sortDirection;

    if (sortDirection !== ('asc' || 'desc')) sortDirection = 'desc';

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
      searchUserId = 'userId';
    }
    const findAndSorteDocuments = await modelMongo
      .find(
        {
          name: { $regex: searchNameTerm, $options: 'i' },
          [searchParentId]: parentId,
          [searchUserId]: userId,
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
      | CommentViewType[],
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

  async postWithLikeStatus(findAndSortedPost: any, userId: string | null) {
    const postWithLikeStatus = [];
    for (const post of findAndSortedPost) {
      const countLikes = await this.likeStatusModel.countDocuments({
        parentId: post.id,
        likeStatus: 'Like',
      });
      const countDislikes = await this.likeStatusModel.countDocuments({
        parentId: post.id,
        likeStatus: 'Dislike',
      });
      const findPostWithLikesByUserId = await this.likeStatusModel.findOne({
        parentId: post.id,
        userId: userId,
      });
      const findNewestPost = await this.likeStatusModel.find(
        {
          parentId: post.id,
          likeStatus: 'Like',
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
  ) {
    const commentWithLikeStatus = [];
    for (const comment of findAndSortedComments) {
      const countLikes = await this.likeStatusModel.countDocuments({
        parentId: comment.id,
        likeStatus: 'Like',
      });
      const countDislikes = await this.likeStatusModel.countDocuments({
        parentId: comment.id,
        likeStatus: 'Dislike',
      });
      const findCommentWithLikesByUserId = await this.likeStatusModel.findOne({
        parentId: comment.id,
        userId: userId,
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
}
