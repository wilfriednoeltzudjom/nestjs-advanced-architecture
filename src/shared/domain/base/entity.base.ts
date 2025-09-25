import { UniqueIdentifier } from '@/shared/domain/base/unique-identifier.base';

export abstract class Entity<T> {
  protected constructor(
    protected readonly id: UniqueIdentifier<string>,
    protected readonly createdAt: Date,
    protected readonly updatedAt: Date,
  ) {}

  public equals(entity: Entity<T>): boolean {
    return this.id.equals(entity.id);
  }

  abstract toPrimitives(): T;
}
