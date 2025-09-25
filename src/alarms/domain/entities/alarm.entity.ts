import { AlarmId } from '@/alarms/domain/value-objects/alarm-id.vo';
import { AlarmName } from '@/alarms/domain/value-objects/alarm-name.vo';
import { AlarmSeverity } from '@/alarms/domain/value-objects/alarm-severity.vo';
import { Entity } from '@/shared/domain/base/entity.base';

export type AlarmPrimitives = {
  id: string;
  name: string;
  severity: string;
  createdAt: Date;
  updatedAt: Date;
};

export type AlarmProps = {
  id: AlarmId;
  name: AlarmName;
  severity: AlarmSeverity;
  createdAt: Date;
  updatedAt: Date;
};

export class Alarm extends Entity<AlarmPrimitives> {
  private constructor(
    readonly id: AlarmId,
    readonly name: AlarmName,
    readonly severity: AlarmSeverity,
    readonly createdAt: Date,
    readonly updatedAt: Date,
  ) {
    super(id, createdAt, updatedAt);
  }

  static create(props: AlarmProps): Alarm {
    return new Alarm(props.id, props.name, props.severity, props.createdAt, props.updatedAt);
  }

  static hydrate(primitives: AlarmPrimitives): Alarm {
    return new Alarm(
      AlarmId.from(primitives.id),
      AlarmName.from(primitives.name),
      AlarmSeverity.from(primitives.severity),
      primitives.createdAt,
      primitives.updatedAt,
    );
  }

  toPrimitives(): AlarmPrimitives {
    return {
      id: this.id.value,
      name: this.name.value,
      severity: this.severity.value,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
