import { ValueObject } from '@/shared/domain/base/value-object.base';
import { ValidationError } from '@/shared/domain/errors/validation.error';
import { Brand } from '@/shared/lib/types/brand';

export const ALARM_ENTRY_TYPE_VALUES = [
  'system',
  'network',
  'database',
  'application',
  'security',
  'performance',
  'availability',
  'capacity',
] as const;

export type AlarmEntryTypeValue = (typeof ALARM_ENTRY_TYPE_VALUES)[number];

type AlarmEntryTypeBrand = Brand<AlarmEntryTypeValue, 'AlarmEntryType'>;

export class AlarmEntryType extends ValueObject<AlarmEntryTypeBrand> {
  private constructor(value: AlarmEntryTypeBrand) {
    super(value);
  }

  static from(value: string): AlarmEntryType {
    if (!ALARM_ENTRY_TYPE_VALUES.includes(value as AlarmEntryTypeValue)) {
      throw new ValidationError('Invalid alarm entry type');
    }

    return new AlarmEntryType(value as AlarmEntryTypeBrand);
  }
}
