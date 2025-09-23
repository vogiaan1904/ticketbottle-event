// event-status.mapper.ts
import { EventStatus as ProtoEventStatus } from '@/protogen/event.pb';
import { EventStatus as PrismaEventStatus } from '@prisma/client';

export class EventStatusMapper {
  private static protoToPrismaMap = new Map<ProtoEventStatus, PrismaEventStatus>([
    [ProtoEventStatus.EVENT_STATUS_DRAFT, PrismaEventStatus.DRAFT],
    [ProtoEventStatus.EVENT_STATUS_PUBLISHED, PrismaEventStatus.PUBLISHED],
    [ProtoEventStatus.EVENT_STATUS_CANCELLED, PrismaEventStatus.CANCELLED],
  ]);

  private static prismaToProtoMap = new Map<PrismaEventStatus, ProtoEventStatus>([
    [PrismaEventStatus.DRAFT, ProtoEventStatus.EVENT_STATUS_DRAFT],
    [PrismaEventStatus.PUBLISHED, ProtoEventStatus.EVENT_STATUS_PUBLISHED],
    [PrismaEventStatus.CANCELLED, ProtoEventStatus.EVENT_STATUS_CANCELLED],
  ]);

  static toProto(prismaStatus: PrismaEventStatus): ProtoEventStatus {
    const protoStatus = this.prismaToProtoMap.get(prismaStatus);
    if (!protoStatus) {
      throw new Error(`Unknown Prisma EventStatus: ${prismaStatus}`);
    }
    return protoStatus;
  }

  static toPrisma(protoStatus: ProtoEventStatus): PrismaEventStatus {
    const prismaStatus = this.protoToPrismaMap.get(protoStatus);
    if (!prismaStatus) {
      throw new Error(`Unknown Proto EventStatus: ${protoStatus}`);
    }
    return prismaStatus;
  }
}
