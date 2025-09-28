import { Organizer } from '@prisma/client';

export class EventOrganizerEntity implements Organizer {
  id: string;
  eventId: string;
  name: string;
  description: string;
  logoUrl: string;

  createdAt: Date;
  updatedAt: Date;
}
