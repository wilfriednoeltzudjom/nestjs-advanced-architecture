import { join } from 'path';

import { MigrationConfig } from '@/shared/infrastructure/scripts/kysely/migrations/args-parser';
import { TsTemplateProcessor, TsTemplateVariables } from '@/shared/lib/ts-template-processor';

export class MigrationTemplateProcessor extends TsTemplateProcessor {
  constructor() {
    super(join(__dirname, './templates'));
  }

  /**
   * Generate a migration from a template
   */
  async generateMigrationTemplate(config: MigrationConfig): Promise<string> {
    const variables: TsTemplateVariables = {};
    if (config.table) {
      variables.tableName = config.table;
    }
    if (config.column) {
      variables.columnName = config.column;
    }

    return this.processTemplate(config.type, variables);
  }
}
