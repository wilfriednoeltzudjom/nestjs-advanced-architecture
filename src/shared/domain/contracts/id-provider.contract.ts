export interface IdProvider {
  generate(): string;
  isValid(id: string): boolean;
}

export const ID_PROVIDER = Symbol.for('ID_PROVIDER');
