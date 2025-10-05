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
    private triggeredAt: Date,
    private isAcknowledged: boolean,
    private entries: any[],
    private createdAt: Date,
    private updatedAt: Date,
  ) {}

  static create(): AlarmBuilder {
    const id = AlarmId.from(commonFixtures.validId());
    const name = AlarmName.from('xxx');
    const severity = AlarmSeverity.from('high');
    const now = commonFixtures.currentDateTime;

    return new AlarmBuilder(id, name, severity, now, false, [], now, now);
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
      triggeredAt: this.triggeredAt,
      isAcknowledged: this.isAcknowledged,
      entries: this.entries,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    });
  }
}
