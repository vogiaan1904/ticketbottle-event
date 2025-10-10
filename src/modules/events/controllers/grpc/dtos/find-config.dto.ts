import { GetEventConfigRequest } from '@/protogen/event.pb';
import { IsNotEmpty, IsString } from 'class-validator';

export class FindConfigDto implements GetEventConfigRequest {
  @IsNotEmpty()
  @IsString()
  eventId: string;

  @IsNotEmpty()
  @IsString()
  userId: string;
}
