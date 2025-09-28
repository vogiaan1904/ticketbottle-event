import { EventConfig, EventStatus } from '@prisma/client';

export class EventConfigEntity implements EventConfig {
  id: string;
  eventId: string;
  status: EventStatus;
  ticketSaleStartDate: Date;
  ticketSaleEndDate: Date;
  isFree: boolean;
  maxAttendees: number;
  isPublic: boolean;
  requiresApproval: boolean;
  allowWaitRoom: boolean;
  isNewTrending: boolean;

  createdAt: Date;
  updatedAt: Date;
}
