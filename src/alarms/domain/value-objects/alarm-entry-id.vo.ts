import { UniqueIdentifier } from '@/shared/domain/base/unique-identifier.base';
import { ValidationError } from '@/shared/domain/errors/validation.error';
import { isNullishOrEmpty } from '@/shared/lib/type-validations';
import { Brand } from '@/shared/lib/types/brand';

type AlarmEntryIdBrand = Brand<string, 'AlarmEntryId'>;

export class AlarmEntryId extends UniqueIdentifier<AlarmEntryIdBrand> {
  private constructor(value: AlarmEntryIdBrand) {
    super(value);
  }

  static from(value: string): AlarmEntryId {
    const trimmedValue = value.trim();

    if (isNullishOrEmpty(trimmedValue)) {
      throw new ValidationError('Alarm entry ID cannot be empty');
    }

    this.validate(trimmedValue);

    return new AlarmEntryId(trimmedValue as AlarmEntryIdBrand);
  }
}
