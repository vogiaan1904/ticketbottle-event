import { Category, Event } from '@prisma/client';
import { EventConfigEntity } from './event-config.entity';
import { EventOrganizerEntity } from './event-org.entity';
import { EventLocationEntity } from './event-location.entity';

export class EventEntity implements Event {
  id: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  thumbnailUrl: string;
  categories: Category[];

  location?: EventLocationEntity;
  config?: EventConfigEntity;
  organizer?: EventOrganizerEntity;

  createdAt: Date;
  updatedAt: Date;
}
