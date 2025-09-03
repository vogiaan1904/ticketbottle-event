import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Query } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { EventsService } from './events.service';
import { CreateEventDto } from './dtos/create-event.dto';
import { UpdateEventDto } from './dtos/update-event.dto';
import { QueryEventDto } from './dtos/query-event.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('events')
@ApiTags('Events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @ApiOperation({ summary: 'Create Event' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Event Created.' })
  @Post()
  create(@Body() dto: CreateEventDto) {
    return this.eventsService.create(dto);
  }

  @ApiOperation({ summary: 'Find Many Events' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Events Found.' })
  @Get()
  findMany(@Query() query: QueryEventDto) {
    const page = query?.page ?? 1;
    const limit = query?.limit ?? 15;
    return this.eventsService.findMany({
      filter: query.filters,
      sort: query?.sort,
      pagination: { page, limit },
    });
  }

  @ApiOperation({ summary: 'Find Event By Id' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Event Found.' })
  @Get(':id')
  findById(@Param('id') id: string) {
    return this.eventsService.findOne(id);
  }

  @ApiOperation({ summary: 'Update Event' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Event Updated.' })
  @Put(':id')
  update(@Payload() dto: UpdateEventDto) {
    return this.eventsService.update(dto.id, dto);
  }

  @ApiOperation({ summary: 'Delete Event' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Event Removed.' })
  @Delete(':id')
  Delete(@Param('id') id: number) {
    return this.eventsService.remove(id);
  }
}
