import { ValueObject } from '@/shared/domain/base/value-object.base';
import { ValidationError } from '@/shared/domain/errors/validation.error';
import { Brand } from '@/shared/lib/types/brand';

type AlarmNameBrand = Brand<string, 'AlarmName'>;

export class AlarmName extends ValueObject<AlarmNameBrand> {
  private constructor(value: AlarmNameBrand) {
    super(value);
  }

  static from(value: string): AlarmName {
    const trimmedValue = value.trim();
    if (trimmedValue.length === 0) {
      throw new ValidationError('Alarm name cannot be empty');
    }

    return new AlarmName(trimmedValue as AlarmNameBrand);
  }
}
