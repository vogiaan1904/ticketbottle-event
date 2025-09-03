import { IsDateDdMmYyyy } from '@/common/decorators/custom-date-validation.decorator';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, IsUrl, ValidateNested } from 'class-validator';

export class CreateLocationDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  street?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsNotEmpty()
  @IsString()
  country: string;

  @IsOptional()
  @IsString()
  postalCode?: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsString()
  province?: string;

  @IsOptional()
  @IsString()
  district?: string;

  @IsOptional()
  @IsString()
  ward?: string;
}

export class CreateEventDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsDateDdMmYyyy()
  startDate: string;

  @IsNotEmpty()
  @IsDateDdMmYyyy()
  endDate: string;

  @IsNotEmpty()
  @IsUrl()
  thumbnailUrl: string;

  @IsNotEmpty()
  @IsString()
  organizerId: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreateLocationDto)
  location: CreateLocationDto;
}

export class CreateEventConfigDto {
  startSellDate: Date;
  endSellDate: Date;
  isFree: boolean;
  customerTicketLimit: number;
  categories: string[];
}
