// timestamp.dto.ts
import { IsString, IsNumber } from 'class-validator';

export class TimestampDto {
  @IsString()
  seconds: string;

  @IsNumber()
  nanos: number;
}
