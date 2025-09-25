import { ResourceAlreadyExistsError } from '@/shared/application/errors/resource-already-exists.error';

export class AlarmAlreadyExistsError extends ResourceAlreadyExistsError {
  constructor() {
    super('Alarm with this name already exists', 'ALARM_ALREADY_EXISTS');
  }
}
