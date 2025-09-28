import { Category, EventFilter, EventStatus, FindManyEventRequest } from '@/protogen/event.pb';
import { Timestamp } from '@/protogen/google/protobuf/timestamp.pb';
import { TimestampUtil } from '@/shared/utils/date.util';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { FilterEventDto as ServiceFilterEventDto } from '../../../dtos';
import { CategoryMapper } from '../mappers/category.mapper';
import { EventStatusMapper } from '../mappers/event-status.mapper';

export enum EventSortField {
  NAME = 'name',
  START_DATE = 'startDate',
  END_DATE = 'endDate',
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
  CAPACITY = 'capacity',
  STATUS = 'status',
  // Relationship fields
  TICKETS_COUNT = 'ticketsCount',
  ORDERS_COUNT = 'ordersCount',
  VENUE = 'venue',
}

export class FilterEventDto implements EventFilter {
  toServiceDto(): ServiceFilterEventDto {
    return {
      searchQuery: this.searchQuery,
      categories: CategoryMapper.toPrismaArray(this.categories),
      status: EventStatusMapper.toPrisma(this.status),
      organizerId: this.organizerId,
      userId: this.userId,
      startDateFrom: TimestampUtil.toDate(this.startDateFrom),
      startDateTo: TimestampUtil.toDate(this.startDateTo),
      city: this.city,
      country: this.country,
      isPublic: this.isPublic,
      isFree: this.isFree,
    };
  }

  @IsOptional()
  @IsString()
  searchQuery?: string;

  @IsArray()
  @IsEnum(Category, { each: true })
  @Transform(({ value }) => (Array.isArray(value) ? value : []))
  categories: Category[] = [];

  @IsOptional()
  @IsEnum(EventStatus)
  status?: EventStatus;

  @IsOptional()
  @IsUUID()
  organizerId?: string;

  @IsOptional()
  @IsUUID()
  userId?: string;

  @IsOptional()
  startDateFrom?: Timestamp;

  @IsOptional()
  startDateTo?: Timestamp;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;

  @IsOptional()
  @IsBoolean()
  isFree?: boolean;
}

export class SortEventDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  orderBy?: EventSortField;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  order?: 'asc' | 'desc';
}

export class FindManyEventDto implements FindManyEventRequest {
  @IsInt()
  @Min(1)
  @Transform(({ value }) => parseInt(value))
  page: number = 1;

  @IsInt()
  @Min(1)
  @Max(100)
  @Transform(({ value }) => parseInt(value))
  pageSize: number = 20;

  @IsOptional()
  @ValidateNested()
  @Type(() => FilterEventDto)
  filter: FilterEventDto;
}
