import { AlarmRepository } from '@/alarms/domain/contracts/repositories/alarm.repository';
import { Alarm } from '@/alarms/domain/entities/alarm.entity';
import { AlarmName } from '@/alarms/domain/value-objects/alarm-name.vo';
import { InjectAlarmsDatabase } from '@/alarms/infrastructure/database/database.decorators';
import { AlarmMapper } from '@/alarms/infrastructure/database/kysely/alarms/alarm.mapper';
import { AlarmsDatabase } from '@/alarms/infrastructure/database/kysely/db';
import { Logger } from '@/shared/application/contracts/logger.contract';
import { InjectLogger } from '@/shared/infrastructure/logger/logger.decorators';

export class KyselyAlarmRepository implements AlarmRepository {
  private readonly tableName = 'alarms';

  constructor(
    @InjectAlarmsDatabase() private readonly db: AlarmsDatabase,
    @InjectLogger() private readonly logger: Logger,
  ) {}

  async findAll(): Promise<Alarm[]> {
    return this.db
      .selectFrom(this.tableName)
      .selectAll()
      .execute()
      .then((alarms) => alarms.map((alarm) => AlarmMapper.forDomain(alarm)));
  }

  async create(alarm: Alarm): Promise<Alarm> {
    const result = await this.db
      .insertInto(this.tableName)
      .values(AlarmMapper.forDatabase(alarm))
      .returningAll()
      .execute();

    return AlarmMapper.forDomain(result[0]);
  }

  async findByName(name: AlarmName): Promise<Alarm | null> {
    const alarms = await this.db.selectFrom(this.tableName).where('name', '=', name.value).selectAll().execute();

    return alarms.length > 0 ? AlarmMapper.forDomain(alarms[0]) : null;
  }
}
