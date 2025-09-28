import {
  CreateEventResponse,
  EVENT_SERVICE_NAME,
  FindManyEventResponse,
  FindOneEventResponse,
} from '@/protogen/event.pb';
import { GrpcMethod } from '@nestjs/microservices';
import { EventsService } from '../../events.service';
import { CreateEventDto, FindManyEventDto, FindOneEventDto } from './dtos';
import { EventResponseMapper } from './mappers';
import { LoggerService } from '@/shared/services/logger.service';
import { Controller } from '@nestjs/common';

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
}
