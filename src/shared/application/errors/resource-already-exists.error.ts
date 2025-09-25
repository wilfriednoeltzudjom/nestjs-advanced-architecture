import { DomainError } from '@/shared/domain/base/error.base';

export class ResourceAlreadyExistsError extends DomainError {
  constructor(message: string, code: string = 'RESOURCE_ALREADY_EXIST', parameters?: Record<string, any>) {
    super(message, code, 409, parameters);
  }
}
