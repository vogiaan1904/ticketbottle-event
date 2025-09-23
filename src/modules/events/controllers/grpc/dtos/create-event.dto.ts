import { Category, CreateEventRequest } from '@/protogen/event.pb';
import { Timestamp } from '@/protogen/google/protobuf/timestamp.pb';
import { IsArray, IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateEventDto implements CreateEventRequest {
  @IsNotEmpty()
  @IsString()
  userId: string;

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
  @IsArray()
  organizerName: string;

  @IsNotEmpty()
  @IsArray()
  organizerDescription: string;

  @IsNotEmpty()
  @IsArray()
  organizerLogoUrl: string;
}
export class CreateEventConfigDto {
  startSellDate: Date;
  endSellDate: Date;
  isFree: boolean;
  customerTicketLimit: number;
  categories: string[];
}
