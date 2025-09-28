import { Category, EventStatus } from '@prisma/client';

export class FilterEventDto {
  searchQuery?: string;
  categories: Category[] = [];
  status?: EventStatus;
  organizerId?: string;
  userId?: string;
  startDateFrom?: Date;
  startDateTo?: Date;
  city?: string;
  country?: string;
  isPublic?: boolean;
  isFree?: boolean;
}

export class FindManyEventDto {
  page: number;
  pageSize: number;
  filter: FilterEventDto;
}
