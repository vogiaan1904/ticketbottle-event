import { ApiPropertyOptional } from '@nestjs/swagger';
import { Event } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import { IsNumber, IsObject, IsOptional, IsString, ValidateNested } from 'class-validator';

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

export class FilterEventDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  startDate?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  endDate?: string;
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

export class QueryEventDto {
  @ApiPropertyOptional()
  @Transform(({ value }) => (value ? Number(value) : 1))
  @IsNumber()
  @IsOptional()
  page?: number;

  @ApiPropertyOptional()
  @Transform(({ value }) => (value ? Number(value) : 15))
  @IsNumber()
  @IsOptional()
  limit?: number;

  @ValidateNested()
  @Type(() => FilterEventDto)
  filters?: FilterEventDto;

  @ValidateNested()
  @Type(() => SortEventDto)
  sort?: SortEventDto;
}
