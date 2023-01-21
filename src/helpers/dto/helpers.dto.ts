import { IsOptional } from 'class-validator';

export class PaginationInputDTO {
  @IsOptional()
  searchNameTerm?: string = '';
  pageNumber?: string = '1';
  pageSize?: string = '10';
  sortBy?: string = 'createdAt';
  sortDirection?: string = 'desc';
}

export class PaginationUserInputDTO {
  @IsOptional()
  searchLoginTerm?: string = '';
  searchEmailTerm?: string = '';
  pageNumber?: string = '1';
  pageSize?: string = '10';
  sortBy?: string = 'createdAt';
  sortDirection?: string = 'desc';
  banStatus?: string = 'all';
}
