import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController as GrpcEventsController } from './controllers/grpc/events.controller';
import { PrismaModule } from '@/infra/database/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [GrpcEventsController],
  providers: [EventsService],
})
export class EventsModule {}
