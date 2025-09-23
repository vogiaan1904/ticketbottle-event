// filter-event.mapper.ts

import { TimestampUtil } from '@/shared/utils/date.util';

export class FilterEventMapper {
  static toProto(inputDto: FilterEventInputDto): EventFilter {
    return {
      searchQuery: inputDto.searchQuery,
      categories: inputDto.categories || [],
      status: inputDto.status,
      organizerId: inputDto.organizerId,
      userId: inputDto.userId,
      startDateFrom: inputDto.startDateFrom
        ? TimestampUtil.fromDate(new Date(inputDto.startDateFrom))
        : undefined,
      startDateTo: inputDto.startDateTo
        ? TimestampUtil.fromDate(new Date(inputDto.startDateTo))
        : undefined,
      city: inputDto.city,
      country: inputDto.country,
      isPublic: inputDto.isPublic,
      isFree: inputDto.isFree,
    };
  }
}
