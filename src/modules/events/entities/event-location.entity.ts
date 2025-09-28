import { EventLocation } from '@prisma/client';

export class EventLocationEntity implements EventLocation {
  id: string;
  eventId: string;
  venue: string;
  street: string;
  city: string;
  district: string | null;
  ward: string | null;
  country: string;

  createdAt: Date;
  updatedAt: Date;
}
