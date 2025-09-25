import { TemplateType } from '@/shared/infrastructure/scripts/kysely/migrations/types';
import { capitalize } from '@/shared/lib/type-transformations';
import { isNotEmptyArray, isNotEmptyString, isNullishOrEmpty } from '@/shared/lib/type-validations';

export interface MigrationArgsType {
  table?: string;
  column?: string;
}

export interface MigrationConfig {
  type: TemplateType;
  name?: string;
  domain: string;
  table?: string;
  column?: string;
  args: string[];
}

export function validateScriptEntries(args: string[], options: MigrationConfig): void {
  const config: MigrationConfig = options;

  if (isNullishOrEmpty(config.domain)) {
    throw new Error('Domain required. Use --domain or -d to specify.');
  }

  if (config.type === 'empty') {
    if (isNullishOrEmpty(config.name)) {
      throw new Error('Name required for empty. Use --name or -n to specify.');
    }
    return;
  }

  const strategies: Record<TemplateType, ('table' | 'column')[]> = {
    'create-table': ['table'],
    'add-column': ['table', 'column'],
    'create-index': ['table', 'column'],
    empty: [],
  };

  const requiredProperties = strategies[config.type];
  ensureArgsValidity(config.type, parseArgs(args), requiredProperties);
}

function parseArgs(args: string[]): MigrationArgsType {
  const [table, column] = args;

  return { table, column };
}

function ensureArgsValidity(
  type: TemplateType,
  args: MigrationArgsType = {},
  requiredProperties: ('table' | 'column')[],
): void {
  if (isNullishOrEmpty(requiredProperties)) {
    return;
  }

  const messageMissingProperties: string[] = [];
  for (const property of requiredProperties) {
    const value = args[property];
    if (isNotEmptyString(value)) {
      continue;
    }

    if (property === 'table') {
      messageMissingProperties.push('table name');
    }
    if (property === 'column') {
      messageMissingProperties.push('column');
    }
  }

  if (isNotEmptyArray(messageMissingProperties)) {
    throw new Error(capitalize(messageMissingProperties.join(' and ')).concat(` required for ${type}`));
  }
}
