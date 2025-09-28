import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { IPaginationOptions } from '@/shared/interfaces/pagination-input.interface';
import { GetPaginationResponse } from '@/shared/interfaces/pagination-resp.interface';
import { createPaginator } from '@/shared/utils/pagination.util';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { EventRoleType, Prisma } from '@prisma/client';
import { CreateEventDto, FilterEventDto } from './dtos';
import { EventEntity } from './entities';

@Injectable()
export class EventsService {
  private readonly paginator = createPaginator(1, 20);
  private readonly baseInclude = {
    organizer: true,
    location: true,
    config: true,
  };
  constructor(private readonly prisma: PrismaService) {}

  private buildWhereFilter(dto: FilterEventDto): Prisma.EventWhereInput {
    const where: Prisma.EventWhereInput = {};
    const conditions: Prisma.EventWhereInput[] = [];
    const configFilters: Prisma.EventConfigWhereInput = {
      status: dto.status,
      isPublic: dto.isPublic,
      isFree: dto.isFree,
    };

    conditions.push({
      config: configFilters,
    });

    if (dto.searchQuery?.trim()) {
      conditions.push({
        OR: [
          {
            name: {
              contains: dto.searchQuery.trim(),
              mode: 'insensitive',
            },
          },
          {
            description: {
              contains: dto.searchQuery.trim(),
              mode: 'insensitive',
            },
          },
          {
            organizer: {
              name: {
                contains: dto.searchQuery.trim(),
                mode: 'insensitive',
              },
            },
          },
        ],
      });
    }

    if (dto.startDateFrom || dto.startDateTo) {
      const dateFilter: Prisma.DateTimeFilter = {};

      if (dto.startDateFrom) {
        dateFilter.gte = dto.startDateFrom;
      }

      if (dto.startDateTo) {
        const endOfDay = new Date(dto.startDateTo);
        endOfDay.setHours(23, 59, 59, 999);
        dateFilter.lte = endOfDay;
      }

      conditions.push({
        startDate: dateFilter,
      });
    }

    if (dto.city?.trim() || dto.country?.trim()) {
      const locationFilter: Prisma.EventLocationWhereInput = {};

      if (dto.city?.trim()) {
        locationFilter.city = {
          contains: dto.city.trim(),
          mode: 'insensitive',
        };
      }

      if (dto.country?.trim()) {
        locationFilter.country = {
          contains: dto.country.trim(),
          mode: 'insensitive',
        };
      }

      conditions.push({
        location: locationFilter,
      });
    }

    if (dto.organizerId?.trim()) {
      conditions.push({
        organizer: {
          id: dto.organizerId.trim(),
        },
      });
    }

    if (dto.userId?.trim()) {
      conditions.push({
        roles: {
          some: {
            userId: dto.userId.trim(),
            // Optionally filter by specific role types
            // role: EventRoleType.ADMIN,
          },
        },
      });
    }

    where.AND = conditions;

    return where;
  }

  async create(dto: CreateEventDto): Promise<EventEntity> {
    const event = await this.prisma.event.create({
      data: {
        name: dto.name,
        description: dto.description,
        startDate: dto.startDate,
        endDate: dto.endDate,
        thumbnailUrl: dto.thumbnailUrl,
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
        organizer: {
          create: {
            name: dto.organizerName,
            description: dto.organizerDescription,
            logoUrl: dto.organizerLogoUrl,
          },
        },
        categories: {
          set: dto.categories,
        },
      },
      include: this.baseInclude,
    });

    await this.prisma.eventRole.create({
      data: {
        userId: dto.createdBy,
        eventId: event.id,
        role: EventRoleType.ADMIN,
      },
    });

    return event;
  }

  findById(id: string): Promise<EventEntity> {
    return this.prisma.event.findUnique({ where: { id }, include: this.baseInclude });
  }

  list(dto: FilterEventDto): Promise<EventEntity[]> {
    return this.prisma.event.findMany({
      where: this.buildWhereFilter(dto),
      include: this.baseInclude,
    });
  }

  findMany({
    filter,
    pagination,
  }: {
    filter?: FilterEventDto;
    pagination: IPaginationOptions;
  }): Promise<GetPaginationResponse<EventEntity>> {
    return this.paginator(
      this.prisma.event,
      {
        where: this.buildWhereFilter(filter),
        include: this.baseInclude,
      },
      {
        page: pagination.page,
        perPage: pagination.limit,
      },
    );
  }

  delete(id: string) {
    return this.prisma.event;
  }
}
