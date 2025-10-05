import { AlarmEntryId } from '@/alarms/domain/value-objects/alarm-entry-id.vo';
import { AlarmEntryName } from '@/alarms/domain/value-objects/alarm-entry-name.vo';
import { AlarmEntryType } from '@/alarms/domain/value-objects/alarm-entry-type.vo';
import { Entity } from '@/shared/domain/base/entity.base';

export type AlarmEntryPrimitives = {
  id: string;
  name: string;
  type: string;
  createdAt: Date;
  updatedAt: Date;
};

export type AlarmEntryProps = {
  id: AlarmEntryId;
  name: AlarmEntryName;
  type: AlarmEntryType;
  createdAt: Date;
  updatedAt: Date;
};

export class AlarmEntry extends Entity<AlarmEntryPrimitives> {
  private constructor(
    readonly id: AlarmEntryId,
    readonly name: AlarmEntryName,
    readonly type: AlarmEntryType,
    readonly createdAt: Date,
    readonly updatedAt: Date,
  ) {
    super(id, createdAt, updatedAt);
  }

  static create(props: AlarmEntryProps): AlarmEntry {
    return new AlarmEntry(props.id, props.name, props.type, props.createdAt, props.updatedAt);
  }

  static hydrate(primitives: AlarmEntryPrimitives): AlarmEntry {
    return new AlarmEntry(
      AlarmEntryId.from(primitives.id),
      AlarmEntryName.from(primitives.name),
      AlarmEntryType.from(primitives.type),
      primitives.createdAt,
      primitives.updatedAt,
    );
  }

  toPrimitives(): AlarmEntryPrimitives {
    return {
      id: this.id.value,
      name: this.name.value,
      type: this.type.value,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
