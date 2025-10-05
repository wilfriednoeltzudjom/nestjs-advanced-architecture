import { Type } from 'class-transformer';
import { IsArray, IsDateString, IsOptional, IsString, ValidateNested } from 'class-validator';

export class CreateAlarmDto {
  @IsString()
  name: string;

  @IsString()
  severity: string;

  @IsOptional()
  @IsDateString()
  @Type(() => Date)
  triggeredAt?: Date;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateAlarmEntryDto)
  entries?: CreateAlarmEntryDto[];
}

class CreateAlarmEntryDto {
  @IsString()
  name: string;

  @IsString()
  type: string;
}
