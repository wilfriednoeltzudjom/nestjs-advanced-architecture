import { IsString } from 'class-validator';

export class CreateAlarmDto {
  @IsString()
  name: string;
  @IsString()
  severity: string;
}
