// event-response.mapper.ts
import {
  Event as ProtoEvent,
  EventConfig as ProtoEventConfig,
  EventLocation as ProtoEventLocation,
  EventOrganizer as ProtoEventOrganizer,
  EventRole as ProtoEventRole,
} from '@/protogen/event.pb';
import {
  Event as PrismaEvent,
  EventConfig as PrismaEventConfig,
  EventLocation as PrismaEventLocation,
  Organizer as PrismaOrganizer,
  EventRole as PrismaEventRole,
} from '@prisma/client';
import { CategoryMapper } from './category.mapper';
import { TimestampUtil } from '@/shared/utils/date.util';
import { EventRoleTypeMapper } from './event-role.mapper';
import { EventStatusMapper } from './event-status.mapper';

type PrismaEventWithRelations = PrismaEvent & {
  location?: PrismaEventLocation | null;
  config?: PrismaEventConfig | null;
  organizer?: PrismaOrganizer | null;
  roles?: PrismaEventRole[];
};

export class EventResponseMapper {
  static toProtoEvent(prismaEvent: PrismaEventWithRelations): ProtoEvent {
    return {
      id: prismaEvent.id,
      name: prismaEvent.name,
      description: prismaEvent.description,
      startDate: TimestampUtil.fromDate(prismaEvent.startDate),
      endDate: TimestampUtil.fromDate(prismaEvent.endDate),
      thumbnailUrl: prismaEvent.thumbnailUrl,
      location: prismaEvent.location ? this.toProtoEventLocation(prismaEvent.location) : undefined,
      config: prismaEvent.config ? this.toProtoEventConfig(prismaEvent.config) : undefined,
      organizer: prismaEvent.organizer
        ? this.toProtoEventOrganizer(prismaEvent.organizer)
        : undefined,
      roles: prismaEvent.roles ? prismaEvent.roles.map((role) => this.toProtoEventRole(role)) : [],
      categories: CategoryMapper.toProtoArray(prismaEvent.categories),
      createdAt: TimestampUtil.fromDate(prismaEvent.createdAt),
      updatedAt: TimestampUtil.fromDate(prismaEvent.updatedAt),
    };
  }

  static toProtoEventLocation(prismaLocation: PrismaEventLocation): ProtoEventLocation {
    const address = [
      prismaLocation.street,
      prismaLocation.ward,
      prismaLocation.district,
      prismaLocation.city,
      prismaLocation.country,
    ]
      .filter(Boolean)
      .join(', ');

    return {
      id: prismaLocation.id,
      venue: prismaLocation.venue,
      address: address,
      createdAt: TimestampUtil.fromDate(prismaLocation.createdAt),
      updatedAt: TimestampUtil.fromDate(prismaLocation.updatedAt),
    };
  }

  static toProtoEventConfig(prismaConfig: PrismaEventConfig): ProtoEventConfig {
    return {
      id: prismaConfig.id,
      ticketSaleStartDate: TimestampUtil.fromDate(prismaConfig.ticketSaleStartDate),
      ticketSaleEndDate: TimestampUtil.fromDate(prismaConfig.ticketSaleEndDate),
      isFree: prismaConfig.isFree,
      maxAttendees: prismaConfig.maxAttendees,
      isPublic: prismaConfig.isPublic,
      requiresApproval: prismaConfig.requiresApproval,
      allowWaitRoom: prismaConfig.allowWaitRoom,
      isNewTrending: prismaConfig.isNewTrending,
      status: EventStatusMapper.toProto(prismaConfig.status),
      createdAt: TimestampUtil.fromDate(prismaConfig.createdAt),
      updatedAt: TimestampUtil.fromDate(prismaConfig.updatedAt),
    };
  }

  static toProtoEventOrganizer(prismaOrganizer: PrismaOrganizer): ProtoEventOrganizer {
    return {
      id: prismaOrganizer.id,
      name: prismaOrganizer.name,
      description: prismaOrganizer.description,
      logoUrl: prismaOrganizer.logoUrl || '',
      createdAt: TimestampUtil.fromDate(prismaOrganizer.createdAt),
      updatedAt: TimestampUtil.fromDate(prismaOrganizer.updatedAt),
    };
  }

  static toProtoEventRole(prismaRole: PrismaEventRole): ProtoEventRole {
    return {
      id: prismaRole.id,
      userId: prismaRole.userId,
      eventId: prismaRole.eventId,
      role: EventRoleTypeMapper.toProto(prismaRole.role),
      createdAt: TimestampUtil.fromDate(prismaRole.createdAt),
      updatedAt: TimestampUtil.fromDate(prismaRole.updatedAt),
    };
  }
}
