import { Category, CreateEventRequest } from '@/protogen/event.pb';
import { Timestamp } from '@/protogen/google/protobuf/timestamp.pb';
import { IsArray, IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';
import { CreateEventDto as ServiceCreateEventDto } from '../../../dtos';
import { TimestampUtil } from '@/shared/utils/date.util';
import { CategoryMapper } from '../mappers/category.mapper';

export class CreateEventDto implements CreateEventRequest {
  toServiceDto(): ServiceCreateEventDto {
    return {
      createdBy: this.creatorUserId,
      name: this.name,
      description: this.description,
      startDate: TimestampUtil.toDate(this.startDate),
      endDate: TimestampUtil.toDate(this.endDate),
      thumbnailUrl: this.thumbnailUrl,
      venue: this.venue,
      street: this.street,
      city: this.city,
      country: this.country,
      ward: this.ward,
      district: this.district,
      categories: CategoryMapper.toPrismaArray(this.categories),
      organizerName: this.organizerName,
      organizerDescription: this.organizerDescription,
      organizerLogoUrl: this.organizerLogoUrl,
    };
  }

  @IsNotEmpty()
  @IsString()
  creatorUserId: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  startDate: Timestamp;

  @IsNotEmpty()
  endDate: Timestamp;

  @IsNotEmpty()
  @IsUrl()
  thumbnailUrl: string;

  @IsNotEmpty()
  @IsString()
  venue: string;

  @IsNotEmpty()
  @IsString()
  street: string;

  @IsNotEmpty()
  @IsString()
  city: string;

  @IsNotEmpty()
  @IsString()
  country: string;

  @IsOptional()
  @IsString()
  ward?: string;

  @IsOptional()
  @IsString()
  district?: string;

  @IsNotEmpty()
  @IsArray()
  categories: Category[];

  @IsNotEmpty()
  @IsString()
  organizerName: string;

  @IsNotEmpty()
  @IsString()
  organizerDescription: string;

  @IsNotEmpty()
  @IsUrl()
  organizerLogoUrl: string;
}

export class CreateEventConfigDto {
  startSellDate: Date;
  endSellDate: Date;
  isFree: boolean;
  customerTicketLimit: number;
  categories: string[];
}
