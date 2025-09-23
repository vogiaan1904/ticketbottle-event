import { IsDateDdMmYyyy } from '@/common/decorators/custom-date-validation.decorator';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, IsUrl, ValidateNested } from 'class-validator';
import { CreateLocationDto } from './create-event.dto';

export class UpdateEventDto {
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
  @ValidateNested()
  @Type(() => CreateLocationDto)
  location: CreateLocationDto;
}
