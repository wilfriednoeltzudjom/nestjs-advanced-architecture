import z from 'zod';

import { parseEnvironmentVariables } from '@/shared/configuration/parse-env-variables';
import { FlattenRecursive, UnionToIntersection } from '@/shared/lib/types/common';

const configurationSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  PORT: z.coerce.number(),
  POSTGRES_PORT: z.coerce.number(),
  POSTGRES_HOST: z.string(),
  POSTGRES_URL: z.string(),
  POSTGRES_DATABASE: z.string(),
  POSTGRES_USER: z.string(),
  POSTGRES_PASSWORD: z.string(),
  MONGODB_URI: z.string(),
});

export function configuration() {
  const variables = parseEnvironmentVariables(configurationSchema.shape);

  return {
    application: {
      environment: variables.NODE_ENV,
      port: variables.PORT,
    },
    database: {
      postgres: {
        url: variables.POSTGRES_URL,
        name: variables.POSTGRES_DATABASE,
        port: variables.POSTGRES_PORT,
        host: variables.POSTGRES_HOST,
        user: variables.POSTGRES_USER,
        password: variables.POSTGRES_PASSWORD,
      },
      mongodb: {
        uri: variables.MONGODB_URI,
      },
    },
  };
}

export type SharedConfiguration = UnionToIntersection<FlattenRecursive<ReturnType<typeof configuration>>>;
