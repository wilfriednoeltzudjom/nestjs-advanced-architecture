export abstract class ValueObject<T> {
  protected constructor(readonly value: T) {}

  public equals(vo: ValueObject<T>): boolean {
    return JSON.stringify(this.value) === JSON.stringify(vo.value);
  }
}
