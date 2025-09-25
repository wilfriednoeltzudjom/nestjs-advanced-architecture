import { Alarm } from '@/alarms/domain/entities/alarm.entity';
import { AlarmBuilder } from '@/alarms/test/fixtures/builders/alarm.builder';

export class AlarmPersonae {
  static get high(): Alarm {
    return AlarmBuilder.create().setSeverity('high').build();
  }

  static get medium(): Alarm {
    return AlarmBuilder.create().setSeverity('medium').build();
  }

  static get low(): Alarm {
    return AlarmBuilder.create().setSeverity('low').build();
  }
}
