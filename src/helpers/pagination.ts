import { BlogsViewType } from '../blogs/schemas/blogs.schema';

export const paginationResult = (
  pageNumber: number,
  pageSize: number,
  itemsCount: number,
  items: BlogsViewType[],
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
