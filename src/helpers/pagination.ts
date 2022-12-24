import { BlogsViewType } from '../blogs/schemas/blogs.schema';
import { PostViewType } from '../post/schemas/post.schema';
import { UserViewType } from '../users/schemas/user.schema';

export const paginationResult = (
  pageNumber: number,
  pageSize: number,
  itemsCount: number,
  items: BlogsViewType[] | PostViewType[] | UserViewType[],
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
