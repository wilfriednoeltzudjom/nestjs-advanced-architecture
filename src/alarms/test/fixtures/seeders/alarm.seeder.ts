import { AlarmRepository } from '@/alarms/domain/contracts/repositories/alarm.repository';
import { Alarm } from '@/alarms/domain/entities/alarm.entity';
import { AlarmBuilder } from '@/alarms/test/fixtures/builders/alarm.builder';

export class AlarmSeeder {
  constructor(private readonly alarmRepository: AlarmRepository) {}

  async seedAlarm(
    overrides: Partial<{
      name: string;
      severity: string;
    }> = {},
  ): Promise<Alarm> {
    const alarm = AlarmBuilder.create()
      .setName(overrides.name || 'Alarm')
      .setSeverity(overrides.severity || 'medium')
      .build();

    return this.alarmRepository.create(alarm);
  }

  async seedMultipleAlarms(
    count: number,
    overrides: Partial<{
      namePrefix: string;
      severity: string;
    }> = {},
  ): Promise<Alarm[]> {
    const alarms: Alarm[] = [];

    for (let i = 0; i < count; i++) {
      const alarm = await this.seedAlarm({
        name: `${overrides.namePrefix || 'Alarm'} ${i + 1}`,
        severity: overrides.severity || 'medium',
      });
      alarms.push(alarm);
    }

    return alarms;
  }
}
