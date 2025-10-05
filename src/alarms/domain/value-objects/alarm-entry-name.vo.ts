import { ValueObject } from '@/shared/domain/base/value-object.base';
import { ValidationError } from '@/shared/domain/errors/validation.error';
import { Brand } from '@/shared/lib/types/brand';

type AlarmEntryNameBrand = Brand<string, 'AlarmEntryName'>;

export class AlarmEntryName extends ValueObject<AlarmEntryNameBrand> {
  private constructor(value: AlarmEntryNameBrand) {
    super(value);
  }

  static from(value: string): AlarmEntryName {
    const trimmedValue = value.trim();
    if (trimmedValue.length === 0) {
      throw new ValidationError('Alarm entry name cannot be empty');
    }

    return new AlarmEntryName(trimmedValue as AlarmEntryNameBrand);
  }
}
