import { BlogsViewModel } from '../blogs/schemas/blogs.schema';
import { PostViewType } from '../post/schemas/post.schema';
import { UserViewType } from '../users/schemas/user.schema';
import { CommentViewType } from '../comments/schema/comments.schema';
import { PaginationInputDTO } from './dto/helpers.dto';

const options = {
  _id: 0,
  passwordHash: 0,
  parentId: 0,
  emailConfirmation: 0,
  __v: 0,
};

export const pagination = async (
  parentId: string | null,
  paginationInputDTO: PaginationInputDTO,
  modelMongo: any,
) => {
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
    searchParentId = parentId;
  }

  const findAndSorteDocuments = await modelMongo
    .find(
      {
        name: { $regex: searchNameTerm, $options: 'i' },
        [searchParentId]: parentId,
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
  return paginationResult(
    pageNumber,
    pageSize,
    getCountDocuments,
    findAndSorteDocuments,
  );
};

export const paginationResult = (
  pageNumber: number,
  pageSize: number,
  itemsCount: number,
  items: BlogsViewModel[] | PostViewType[] | UserViewType[] | CommentViewType[],
) => {
  const pagesCount = Math.ceil(itemsCount / pageSize);
  return {
    pagesCount,
    page: pageNumber,
    pageSize,
    totalCount: itemsCount,
    items,
  };
};
