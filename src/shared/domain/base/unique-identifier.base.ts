import { ValueObject } from '@/shared/domain/base/value-object.base';
import { IdProvider } from '@/shared/domain/contracts/id-provider.contract';
import { FatalError } from '@/shared/domain/errors/fatal.error';
import { ValidationError } from '@/shared/domain/errors/validation.error';
import { isNullish } from '@/shared/lib/type-validations';

export class UniqueIdentifier<T> extends ValueObject<T> {
  private static idProvider: IdProvider;

  static configureIdProvider(idProvider: IdProvider): void {
    UniqueIdentifier.idProvider = idProvider;
  }

  protected static validate(value: string): void {
    if (isNullish(UniqueIdentifier.idProvider)) {
      throw new FatalError('Id provider is not configured');
    }

    if (!UniqueIdentifier.idProvider.isValid(value)) {
      throw new ValidationError('Invalid unique identifier');
    }
  }

  protected static generateId(): string {
    if (isNullish(UniqueIdentifier.idProvider)) {
      throw new FatalError('Id provider is not configured');
    }

    return UniqueIdentifier.idProvider.generate();
  }
}
