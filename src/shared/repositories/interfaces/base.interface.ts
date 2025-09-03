import { GetPaginationResponse } from '@/types/pagination-resp';

export interface PaginationQuery {
  page?: number;
  perPage?: number;
}

export interface BaseRepositoryInterface<T> {
  create(data: any, options?: any): Promise<T>;
  update(id: string, data: any, options?: any): Promise<T>;
  findOne(filter: any, options?: any): Promise<T>;
  findAll(filter: any, orderBy?: any, options?: any): Promise<T[]>;
  findMany(
    filter: any,
    pagination: PaginationQuery,
    orderBy?: any,
    options?: any,
  ): Promise<GetPaginationResponse<T>>;
  delete(id: string): Promise<T>;
}
