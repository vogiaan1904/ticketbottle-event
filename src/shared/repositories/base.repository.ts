import { BaseRepositoryInterface, PaginationQuery } from './interfaces/base.interface';
import { paginator, PaginatorTypes } from '@nodeteam/nestjs-prisma-pagination';
import { GetPaginationResponse } from '@/types/pagination-resp';
import { PrismaService } from '../prisma/prisma.service';

const paginate: PaginatorTypes.PaginateFunction = paginator({
  page: 1,
  perPage: 10,
});

export abstract class BaseRepository<T> implements BaseRepositoryInterface<T> {
  constructor(
    private prisma: PrismaService,
    private model: string,
    private responseDto: any,
  ) {}

  async create(data: any, options?: any) {
    return new this.responseDto(
      await this.prisma[this.model].create({
        data,
        ...options,
      }),
    );
  }

  async findOne(filter: any, options?: any) {
    const entity = await this.prisma[this.model].findUnique({
      where: filter,
      ...options,
    });
    if (!entity) {
      return null;
    }

    return new this.responseDto(entity);
  }

  async findAll(filter: any, orderBy?: any, options?: any) {
    const data = await this.prisma[this.model].findMany({
      where: filter,
      orderBy,
      ...options,
    });

    return data.map((item: any) => new this.responseDto(item));
  }

  async findMany(
    filter: any,
    pagination: PaginationQuery,
    orderBy?: any,
    options?: any,
  ): Promise<GetPaginationResponse<T>> {
    const response = await paginate(
      this.prisma[this.model],
      {
        where: filter,
        orderBy,
        ...options,
      },
      {
        page: pagination.page,
        perPage: pagination.perPage,
      },
    );

    return {
      meta: {
        total: response.meta.total,
        lastPage: response.meta.lastPage,
        currentPage: response.meta.currentPage,
        perPage: response.meta.perPage,
      },
      data: response.data.map((item: any) => new this.responseDto(item)),
    };
  }

  async update(id: string, data: any, options?: any) {
    return new this.responseDto(
      await this.prisma[this.model].update({
        where: { id },
        data,
        ...options,
      }),
    );
  }

  async delete(id: string) {
    return new this.responseDto(
      await this.prisma[this.model].update({
        where: { id },
        data: {
          deletedAt: new Date(),
        },
      }),
    );
  }
}
