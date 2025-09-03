// src/modules/events/events.repository.ts
import { Injectable } from '@nestjs/common';
import { BaseRepository } from '@/shared/repositories/base.repository';
import { PrismaService } from '@/shared/prisma/prisma.service';
import { Event } from '@prisma/client';

@Injectable()
export class EventsRepository extends BaseRepository<Event> {
  constructor(prisma: PrismaService) {
    super(prisma, 'events', Event);
  }
}
