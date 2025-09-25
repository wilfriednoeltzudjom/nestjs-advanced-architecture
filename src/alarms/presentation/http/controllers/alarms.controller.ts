import { Body, Controller, Get, Post } from '@nestjs/common';

import { AlarmsService } from '@/alarms/application/alarms.service';
import { CreateAlarmCommand } from '@/alarms/application/commands/create-alarm.command';
import { CreateAlarmDto } from '@/alarms/presentation/http/dto/create-alarm.dto';

@Controller('alarms')
export class AlarmsController {
  constructor(private readonly alarmsService: AlarmsService) {}

  @Post()
  async create(@Body() createAlarmDto: CreateAlarmDto) {
    const alarm = await this.alarmsService.create(new CreateAlarmCommand(createAlarmDto.name, createAlarmDto.severity));

    return alarm.toPrimitives();
  }

  @Get()
  async findAll() {
    const alarms = await this.alarmsService.findAll();

    return alarms.map((alarm) => alarm.toPrimitives());
  }
}
