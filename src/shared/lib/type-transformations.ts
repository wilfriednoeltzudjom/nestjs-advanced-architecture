import { isNotEmptyString } from '@/shared/lib/type-validations';

export function capitalize(value: unknown): string {
  if (isNotEmptyString(value)) {
    return value.charAt(0).toUpperCase().concat(value.substring(1).toLowerCase());
  }
  throw new Error('text must be a string');
}
