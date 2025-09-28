import {
  Category,
  Event,
  EventConfig,
  EventLocation,
  EventOrganizer,
  EventRole,
  EventRoleType,
  EventStatus,
} from '@/protogen/event.pb';
import { Timestamp } from '@/protogen/google/protobuf/timestamp.pb';

import { Type } from 'class-transformer';

class LocationDto implements EventLocation {
  id: string;
  venue: string;
  address: string;

  createdAt: Timestamp;
  updatedAt: Timestamp;
}

class ConfigDto implements EventConfig {
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

class OrganizerDto implements EventOrganizer {
  id: string;
  name: string;
  description: string;
  logoUrl: string;

  createdAt: Timestamp;
  updatedAt: Timestamp;
}

class EventRoleDto implements EventRole {
  id: string;
  userId: string;
  eventId: string;
  role: EventRoleType;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export class EventDto implements Event {
  id: string;
  name: string;
  description: string;
  startDate: Timestamp;
  endDate: Timestamp;
  thumbnailUrl: string;
  categories: Category[];

  @Type(() => LocationDto)
  location: LocationDto;

  @Type(() => ConfigDto)
  config: ConfigDto;

  @Type(() => OrganizerDto)
  organizer: OrganizerDto;

  @Type(() => EventRoleDto)
  roles: EventRoleDto[];

  createdAt: Timestamp;
  updatedAt: Timestamp;
}
