import { Alarm } from '@/alarms/domain/entities/alarm.entity';
import { AlarmId } from '@/alarms/domain/value-objects/alarm-id.vo';
import { AlarmName } from '@/alarms/domain/value-objects/alarm-name.vo';
import { AlarmSeverity } from '@/alarms/domain/value-objects/alarm-severity.vo';
import { commonFixtures } from '@/shared/test/setup';

export class AlarmBuilder {
  private alarm: Alarm;

  private constructor(
    private id: AlarmId,
    private name: AlarmName,
    private severity: AlarmSeverity,
    private createdAt: Date,
    private updatedAt: Date,
  ) {}

  static create(): AlarmBuilder {
    const id = AlarmId.from(commonFixtures.validId());
    const name = AlarmName.from('xxx');
    const severity = AlarmSeverity.from('high');
    const now = commonFixtures.currentDateTime;

    return new AlarmBuilder(id, name, severity, now, now);
  }

  setId(id: string): AlarmBuilder {
    this.id = AlarmId.from(id);
    return this;
  }

  setName(name: string): AlarmBuilder {
    this.name = AlarmName.from(name);
    return this;
  }

  setSeverity(severity: string): AlarmBuilder {
    this.severity = AlarmSeverity.from(severity);
    return this;
  }

  build(): Alarm {
    return Alarm.hydrate({
      id: this.id.value,
      name: this.name.value,
      severity: this.severity.value,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    });
  }
}
