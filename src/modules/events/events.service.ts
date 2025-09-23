import { ErrorCodeEnum } from '@/shared/constants/error-code.constant';
import { IPaginationOptions } from '@/shared/interfaces/pagination-input.interface';
import { GetPaginationResponse } from '@/shared/interfaces/pagination-resp.interface';
import { TimestampUtil } from '@/shared/utils/date.util';
import { createPaginator } from '@/shared/utils/pagination.util';
import { Injectable } from '@nestjs/common';
import { EventRoleType } from '@prisma/client';
import { CategoryMapper } from './mappers/category.mapper';
import { CreateEventDto } from './dtos/grpc/create-event.dto';
import { FilterEventDto } from './dtos/grpc/find-many-events.dto';
import { UpdateEventDto } from './dtos/grpc/update-event.dto';
import { PrismaService } from '@/infra/database/prisma/prisma.service';

@Injectable()
export class EventsService {
  private readonly paginator = createPaginator();
  private readonly baseInclude = {
    organizer: true,
    location: true,
    config: true,
  };
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateEventDto) {
    const prismaCategories = CategoryMapper.toPrismaArray(dto.categories);
    const event = await this.prisma.event.create({
      data: {
        ...dto,
        startDate: TimestampUtil.toDate(dto.startDate),
        endDate: TimestampUtil.toDate(dto.endDate),
        location: {
          create: {
            venue: dto.venue,
            street: dto.street,
            city: dto.city,
            country: dto.country,
            ward: dto.ward,
            district: dto.district,
          },
        },
        categories: {
          set: prismaCategories,
        },
      },
      include: this.baseInclude,
    });

    await this.prisma.eventRole.create({
      data: {
        userId: dto.userId,
        eventId: event.id,
        role: EventRoleType.ADMIN,
      },
    });

    return event;
  }

  async update(userId: string, id: string, dto: UpdateEventDto) {
    const oldEvent = await this.prisma.event.findUnique({
      where: {
        id: id,
      },
      include: {
        roles: true,
      },
    });

    if (!oldEvent) {
      throw new BusinessException(ErrorCodeEnum.EventNotFound);
    }

    if (!oldEvent.roles.some((role) => role.userId === userId)) {
      throw new BusinessException(ErrorCodeEnum.PermissionDenied);
    }

    return this.prisma.event.update({
      where: { id },
      data: {
        ...dto,
        startDate: parseDdMmYyyyToDate(dto.startDate),
        endDate: parseDdMmYyyyToDate(dto.endDate),
        location: {
          update: dto.location,
        },
      },
      include: this.baseInclude,
    });
  }

  async list(filter: FilterEventDto) {
    return this.prisma.event.findMany({
      where: {
        ...filter,
      },
    });
  }

  findMany({
    filter,
    pagination,
  }: {
    filter?: FilterEventDto;
    pagination: IPaginationOptions;
  }): Promise<GetPaginationResponse<Event>> {
    return this.paginator(
      this.prisma.event,
      {
        where: {
          ...filter,
        },
      },
      {
        page: pagination.page,
        perPage: pagination.limit,
      },
    );
  }

  findById(id: string) {
    return this.prisma.event.findUnique({ where: { id }, include: this.baseInclude });
  }

  delete(id: string) {
    return this.prisma.event;
  }
}
