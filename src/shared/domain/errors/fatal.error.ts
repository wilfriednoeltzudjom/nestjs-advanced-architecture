import { DomainError } from '@/shared/domain/base/error.base';

export class FatalError extends DomainError {
  constructor(message: string, parameters?: Record<string, any>) {
    super(message, 'FATAL_ERROR', 500, parameters);
  }
}
