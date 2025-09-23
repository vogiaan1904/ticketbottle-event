import { InternalServiceJwtGuard } from '@/common/guards/internal-service-jwt.guard';
import { CreateEventResponse, EVENT_SERVICE_NAME } from '@/protogen/event.pb';
import { Body, Delete, Get, HttpStatus, Param, Put, Query, UseGuards } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { ApiOkResponse, ApiResponse } from '@nestjs/swagger';
import { EventsService } from '../../events.service';
import { CreateEventDto } from '../../dtos/grpc/create-event.dto';
import { EventResponseMapper } from '../../mappers/event.mapper';
import { FindManyEventDto } from '../../dtos/grpc/find-many-events.dto';

export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @GrpcMethod(EVENT_SERVICE_NAME, 'create')
  async create(dto: CreateEventDto): Promise<CreateEventResponse> {
    const event = await this.eventsService.create(dto);
    return { event: EventResponseMapper.toProtoEvent(event) };
  }

  @GrpcMethod(EVENT_SERVICE_NAME, 'findMany')
  findMany(dto: FindManyEventDto) {
    const page = query?.page ?? 1;
    const limit = query?.limit ?? 15;

    return this.eventsService.findMany({
      filter: query.filters,
      sort: query?.sort,
      pagination: { page, limit },
    });
  }

  @ApiOkResponse({ type: EventDto })
  @Get(':id')
  findById(@Param('id') id: string) {
    return this.eventsService.findById(id);
  }

  @ApiOkResponse({ type: EventDto })
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateEventDto) {
    return this.eventsService.update(id, dto);
  }

  @ApiResponse({ status: HttpStatus.OK, description: 'Event Removed.' })
  @Delete(':id')
  Delete(@Param('id') id: string) {
    return this.eventsService.delete(id);
  }

  @UseGuards(InternalServiceJwtGuard)
  @Get('internal')
  findAll(@Query() filter: FilterEventDto) {
    return this.eventsService.findAll(filter);
  }
}
