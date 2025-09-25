export function isNullish(value: unknown): value is null | undefined {
  return value === null || value === undefined;
}

export function isValidValue(value: unknown): value is NonNullable<unknown> {
  return !isNullish(value);
}

export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

export function isArray<T>(value: unknown): value is T[] {
  return Array.isArray(value);
}

export function isObject(value: unknown): value is Record<string, unknown> {
  return isValidValue(value) && typeof value === 'object';
}

export function isEmpty(value: unknown): boolean {
  if (isArray(value) || isString(value)) {
    return value.length === 0;
  }
  if (isObject(value)) {
    return Object.keys(value).length === 0;
  }

  return false;
}

export function isNullishOrEmpty(value: unknown): boolean {
  return isNullish(value) || isEmpty(value);
}

export function isNotEmptyString(value: unknown): value is string {
  return isString(value) && value.length > 0;
}

export function isNotEmptyArray<T>(value: unknown): value is T[] {
  return isArray(value) && value.length > 0;
}

export function isNotEmptyObject(value: unknown): value is Record<string, unknown> {
  return isObject(value) && Object.keys(value).length > 0;
}
