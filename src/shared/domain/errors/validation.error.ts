import { DomainError } from '@/shared/domain/base/error.base';

export class ValidationError extends DomainError {
  constructor(message: string, parameters?: Record<string, any>) {
    super(message, 'VALIDATION_ERROR', 400, parameters);
  }
}
