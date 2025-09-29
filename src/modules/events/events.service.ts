import { IPaginationOptions } from '@/shared/interfaces/pagination-input.interface';
import { GetPaginationResponse } from '@/shared/interfaces/pagination-resp.interface';
import { Injectable } from '@nestjs/common';
import { EventRoleType } from '@prisma/client';
import { CreateEventDto, FilterEventDto } from './dtos';
import { EventConfigEntity, EventEntity } from './entities';
import { EventsRepository } from './repository/events.repository';
import { UpdateEventDto } from './dtos/update-event.dto';
import { RpcBusinessException } from '@/common/exceptions/rpc-business.exception';
import { ErrorCodeEnum } from '@/shared/constants/error-code.constant';
import { CreateConfigDto } from './dtos/create-config.dto';

@Injectable()
export class EventsService {
  private readonly baseInclude = {
    organizer: true,
    location: true,
    config: true,
  };
  constructor(private readonly repository: EventsRepository) {}

  async create(dto: CreateEventDto): Promise<EventEntity> {
    const event = await this.repository.create(dto);

    await this.repository.createRole({
      userId: dto.createdBy,
      eventId: event.id,
      role: EventRoleType.ADMIN,
    });

    return event;
  }

  async update(dto: UpdateEventDto): Promise<EventEntity> {
    const roles = await this.repository.findEventRoles(dto.id);
    const canUpdate = roles.some(
      (role) =>
        role.userId === dto.userId &&
        (role.role === EventRoleType.ADMIN || role.role === EventRoleType.EDITOR),
    );
    if (!canUpdate) {
      throw new RpcBusinessException(ErrorCodeEnum.PermissionDenied);
    }

    return this.repository.update(dto);
  }

  findById(id: string): Promise<EventEntity> {
    return this.repository.findById(id);
  }

  list(dto: FilterEventDto): Promise<EventEntity[]> {
    return this.repository.list(dto);
  }

  findMany({
    filter,
    pagination,
  }: {
    filter?: FilterEventDto;
    pagination: IPaginationOptions;
  }): Promise<GetPaginationResponse<EventEntity>> {
    return this.repository.findMany({
      filter,
      pagination,
    });
  }

  delete(id: string) {
    return this.repository.delete(id);
  }

  // ********************* CONFIG ********************* //
  async createConfig(dto: CreateConfigDto): Promise<EventConfigEntity> {
    const event = await this.repository.findById(dto.eventId);
    if (!event) {
      throw new RpcBusinessException(ErrorCodeEnum.EventNotFound);
    }

    const isAdminOrEditor = event.roles.some(
      (role) =>
        role.userId === dto.userId &&
        (role.role === EventRoleType.ADMIN || role.role === EventRoleType.EDITOR),
    );
    if (!isAdminOrEditor) {
      throw new RpcBusinessException(ErrorCodeEnum.PermissionDenied);
    }

    return this.repository.createConfig(dto);
  }
}
