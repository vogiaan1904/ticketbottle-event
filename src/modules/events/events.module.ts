import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { PrismaModule } from '@/shared/prisma/prisma.module';
import { EventsRepository } from './repository/events.repository';

@Module({
  imports: [PrismaModule],
  controllers: [EventsController],
  providers: [EventsService, EventsRepository],
})
export class EventsModule {}
