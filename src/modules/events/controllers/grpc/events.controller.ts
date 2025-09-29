import {
  CreateEventConfigResponse,
  CreateEventResponse,
  EVENT_SERVICE_NAME,
  FindManyEventResponse,
  FindOneEventResponse,
  ListEventResponse,
  UpdateEventResponse,
} from '@/protogen/event.pb';
import { LoggerService } from '@/shared/services/logger.service';
import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { EventsService } from '../../events.service';
import {
  CreateEventDto,
  FindManyEventDto,
  FindOneEventDto,
  ListEventDto,
  UpdateEventDto,
} from './dtos';
import { EventResponseMapper } from './mappers';
import { CreateConfigDto } from './dtos/create-config.dto';

@Controller()
export class EventsController {
  constructor(
    private readonly eventsService: EventsService,
    private readonly logger: LoggerService,
  ) {
    logger.setContext(EventsController.name);
  }

  @GrpcMethod(EVENT_SERVICE_NAME, 'create')
  async create(dto: CreateEventDto): Promise<CreateEventResponse> {
    this.logger.info(`EventsController.create called.`);
    const event = await this.eventsService.create(dto.toServiceDto());
    return { event: EventResponseMapper.toProtoEvent(event) };
  }

  @GrpcMethod(EVENT_SERVICE_NAME, 'update')
  async update(dto: UpdateEventDto): Promise<UpdateEventResponse> {
    const event = await this.eventsService.update(dto.toServiceDto());
    return { event: EventResponseMapper.toProtoEvent(event) };
  }

  @GrpcMethod(EVENT_SERVICE_NAME, 'findOne')
  async findOne(dto: FindOneEventDto): Promise<FindOneEventResponse> {
    const event = await this.eventsService.findById(dto.id);
    return { event: EventResponseMapper.toProtoEvent(event) };
  }

  @GrpcMethod(EVENT_SERVICE_NAME, 'findMany')
  async findMany(dto: FindManyEventDto): Promise<FindManyEventResponse> {
    const out = await this.eventsService.findMany({
      filter: dto.filter.toServiceDto(),
      pagination: { page: dto.page, limit: dto.pageSize },
    });
    return {
      events: out.data.map((item) => EventResponseMapper.toProtoEvent(item)),
      pagination: {
        page: out.meta.currentPage,
        pageSize: out.meta.perPage,
        count: out.meta.total,
        lastPage: out.meta.lastPage,
        hasNext: out.meta.next === 1,
        hasPrevious: out.meta.prev === 1,
      },
    };
  }

  @GrpcMethod(EVENT_SERVICE_NAME, 'list')
  async list(dto: ListEventDto): Promise<ListEventResponse> {
    this.logger.info(`EventsController.list called.`);
    const out = await this.eventsService.list(dto.filter.toServiceDto());
    return { events: out.map((item) => EventResponseMapper.toProtoEvent(item)) };
  }

  // ********************* CONFIG ********************* //
  @GrpcMethod(EVENT_SERVICE_NAME, 'createConfig')
  async createConfig(dto: CreateConfigDto): Promise<CreateEventConfigResponse> {
    const config = await this.eventsService.createConfig(dto.toServiceDto());
    return { eventConfig: EventResponseMapper.toProtoEventConfig(config) };
  }
}
