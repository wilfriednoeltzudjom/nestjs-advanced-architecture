import { UniqueIdentifier } from '@/shared/domain/base/unique-identifier.base';
import { ValidationError } from '@/shared/domain/errors/validation.error';
import { isNullishOrEmpty } from '@/shared/lib/type-validations';
import { Brand } from '@/shared/lib/types/brand';

type AlarmIdBrand = Brand<string, 'AlarmId'>;

export class AlarmId extends UniqueIdentifier<AlarmIdBrand> {
  private constructor(value: AlarmIdBrand) {
    super(value);
  }

  static from(value: string): AlarmId {
    const trimmedValue = value.trim();

    if (isNullishOrEmpty(trimmedValue)) {
      throw new ValidationError('Alarm ID cannot be empty');
    }

    this.validate(trimmedValue);

    return new AlarmId(trimmedValue as AlarmIdBrand);
  }
}
