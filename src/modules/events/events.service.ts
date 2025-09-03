import { Injectable } from '@nestjs/common';
import { CreateEventDto } from './dtos/create-event.dto';
import { UpdateEventDto } from './dtos/update-event.dto';
import { EventsRepository } from './repository/events.repository';
import { FilterEventDto, QueryEventDto, SortEventDto } from './dtos/query-event.dto';
import { IPaginationOptions } from '@/types/pagination-input';
import { GetPaginationResponse } from '@/types/pagination-resp';
import { PrismaService } from '@/shared/prisma/prisma.service';
import { createPaginator } from '@/shared/utils/pagination.util';
import { Category, Prisma } from '@prisma/client';
import { BusinessException } from '@/common/exceptions/business.exception';
import { ErrorCodeEnum } from '@/shared/constants/error-code.constant';

@Injectable()
export class EventsService {
  private readonly paginator = createPaginator();
  private readonly baseInclude = {
    location: true,
    organizer: true,
    config: true,
  };
  constructor(private readonly prisma: PrismaService) {}

  async create(createEventDto: CreateEventDto) {
    const hasOrganizer = await this.prisma.organizer.findUnique({
      where: {
        id: createEventDto.organizerId,
      },
    });

    if (!hasOrganizer) {
      throw new BusinessException(ErrorCodeEnum.OrganizerNotFound);
    }

    return this.prisma.event.create({
      data: {
        ...createEventDto,
        location: {
          create: createEventDto.location,
        },
      },
    });
  }

  findAll(filter: FilterEventDto) {
    return this.prisma.event.findMany({
      where: {
        ...filter,
      },
    });
  }

  findMany({
    filter,
    sort,
    pagination,
  }: {
    filter?: FilterEventDto;
    sort?: SortEventDto;
    pagination: IPaginationOptions;
  }): Promise<GetPaginationResponse<Event>> {
    return this.paginator(
      this.prisma.event,
      {
        where: {
          ...filter,
        },
        orderBy: sort?.orderBy
          ? {
              [sort.orderBy]: sort.order,
            }
          : undefined,
        include: this.baseInclude,
      },
      {
        page: pagination.page,
        perPage: pagination.limit,
      },
    );
  }

  findOne(id: string) {
    return this.prisma.event.findUnique({ where: { id }, include: this.baseInclude });
  }

  update(id: number, updateEventDto: UpdateEventDto) {
    return `This action updates a #${id} event`;
  }

  remove(id: number) {
    return `This action removes a #${id} event`;
  }
}
