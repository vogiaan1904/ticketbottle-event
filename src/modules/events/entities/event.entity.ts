import { ApiProperty } from '@nestjs/swagger';
import { Event as PrismaEvent } from '@prisma/client';
import { Expose } from 'class-transformer';

export class Event implements PrismaEvent {
  constructor(partial: Partial<Event>) {
    Object.assign(this, partial);
  }

  @Expose()
  @ApiProperty()
  id: string;

  @Expose()
  @ApiProperty()
  name: string;

  @Expose()
  @ApiProperty()
  description: string;

  @Expose()
  @ApiProperty()
  startDate: Date;

  @Expose()
  @ApiProperty()
  endDate: Date;

  @Expose()
  @ApiProperty()
  thumbnailUrl: string;

  @Expose()
  @ApiProperty()
  organizerId: string;

  @Expose()
  @ApiProperty()
  locationId: string;

  @Expose()
  @ApiProperty()
  createdAt: Date;

  @Expose()
  @ApiProperty()
  updatedAt: Date;
}
