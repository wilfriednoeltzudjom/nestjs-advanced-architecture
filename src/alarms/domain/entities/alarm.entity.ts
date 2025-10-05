import { AlarmEntry } from '@/alarms/domain/entities/alarm-entry.entity';
import { AlarmId } from '@/alarms/domain/value-objects/alarm-id.vo';
import { AlarmName } from '@/alarms/domain/value-objects/alarm-name.vo';
import { AlarmSeverity } from '@/alarms/domain/value-objects/alarm-severity.vo';
import { Entity } from '@/shared/domain/base/entity.base';

export type AlarmPrimitives = {
  id: string;
  name: string;
  severity: string;
  triggeredAt: Date;
  isAcknowledged: boolean;
  entries: Array<{
    id: string;
    name: string;
    type: string;
    createdAt: Date;
    updatedAt: Date;
  }>;
  createdAt: Date;
  updatedAt: Date;
};

export type AlarmProps = {
  id: AlarmId;
  name: AlarmName;
  severity: AlarmSeverity;
  triggeredAt: Date;
  isAcknowledged: boolean;
  entries: AlarmEntry[];
  createdAt: Date;
  updatedAt: Date;
};

export class Alarm extends Entity<AlarmPrimitives> {
  private constructor(
    public id: AlarmId,
    public name: AlarmName,
    public severity: AlarmSeverity,
    public triggeredAt: Date,
    public isAcknowledged: boolean,
    public entries: AlarmEntry[],
    public createdAt: Date,
    public updatedAt: Date,
  ) {
    super(id, createdAt, updatedAt);
  }

  static create(props: AlarmProps): Alarm {
    return new Alarm(
      props.id,
      props.name,
      props.severity,
      props.triggeredAt,
      props.isAcknowledged ?? false,
      props.entries ?? [],
      props.createdAt,
      props.updatedAt,
    );
  }

  static hydrate(primitives: AlarmPrimitives): Alarm {
    return new Alarm(
      AlarmId.from(primitives.id),
      AlarmName.from(primitives.name),
      AlarmSeverity.from(primitives.severity),
      primitives.triggeredAt,
      primitives.isAcknowledged,
      primitives.entries.map((entry) => AlarmEntry.hydrate(entry)),
      primitives.createdAt,
      primitives.updatedAt,
    );
  }

  acknowledge(): void {
    this.isAcknowledged = true;
  }

  addAlarmEntry(entry: AlarmEntry): void {
    this.entries.push(entry);
  }

  removeAlarmEntry(entry: AlarmEntry): void {
    this.entries = this.entries.filter((e) => e.id.equals(entry.id));
  }

  toPrimitives(): AlarmPrimitives {
    return {
      id: this.id.value,
      name: this.name.value,
      severity: this.severity.value,
      triggeredAt: this.triggeredAt,
      isAcknowledged: this.isAcknowledged,
      entries: this.entries.map((entry) => entry.toPrimitives()),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
