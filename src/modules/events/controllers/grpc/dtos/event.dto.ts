import { Timestamp } from '@/protogen/google/protobuf/timestamp.pb';
import { Category, EventStatus } from '@prisma/client';
import { Expose, Type } from 'class-transformer';

@Expose()
class LocationDto {
  id: string;
  venue: string;
  address: string;

  createdAt: Timestamp;
  updatedAt: Timestamp;
}

@Expose()
class ConfigDto {
  id: string;
  ticketSaleStartDate: Timestamp;
  ticketSaleEndDate: Timestamp;
  isFree: boolean;
  maxAttendees: number;
  isPublic: boolean;
  requiresApproval: boolean;
  allowWaitRoom: boolean;
  isNewTrending: boolean;
  status: EventStatus;

  updatedAt: Timestamp;
  createdAt: Timestamp;
}

@Expose()
export class EventDto {
  id: string;
  name: string;
  description: string;
  startDate: Timestamp;
  endDate: Timestamp;
  thumbnailUrl: string;

  @Type(() => LocationDto)
  location?: LocationDto;

  @Type(() => ConfigDto)
  config?: ConfigDto;

  categories: Category[];

  createdAt: Timestamp;
  updatedAt: Timestamp;
}
