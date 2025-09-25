import { ValueObject } from '@/shared/domain/base/value-object.base';
import { ValidationError } from '@/shared/domain/errors/validation.error';
import { Brand } from '@/shared/lib/types/brand';

export const ALARM_SEVERITY_VALUES = ['critical', 'high', 'medium', 'low'] as const;

export type AlarmSeverityValue = (typeof ALARM_SEVERITY_VALUES)[number];

type AlarmSeverityBrand = Brand<AlarmSeverityValue, 'AlarmSeverity'>;

export class AlarmSeverity extends ValueObject<AlarmSeverityBrand> {
  private constructor(value: AlarmSeverityBrand) {
    super(value);
  }

  static from(value: string): AlarmSeverity {
    if (!ALARM_SEVERITY_VALUES.includes(value as AlarmSeverityValue)) {
      throw new ValidationError('Invalid alarm severity');
    }

    return new AlarmSeverity(value as AlarmSeverityBrand);
  }
}
