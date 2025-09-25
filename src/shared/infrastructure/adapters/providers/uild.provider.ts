import { decodeTime, isValid, monotonicFactory } from 'ulid';

import { Injectable } from '@nestjs/common';

import { IdProvider } from '@/shared/domain/contracts/id-provider.contract';

@Injectable()
export class UuidProvider implements IdProvider {
  private readonly ulid = monotonicFactory();

  generate(): string {
    return this.ulid();
  }

  isValid(id: string): boolean {
    return isValid(id);
  }

  decodeTime(id: string): number {
    return decodeTime(id);
  }
}
