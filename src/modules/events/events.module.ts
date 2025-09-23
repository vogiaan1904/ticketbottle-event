import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './controllers/grpc/events.controller';
import { PrismaModule } from '@/shared/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [EventsController],
  providers: [EventsService],
})
export class EventsModule {}
