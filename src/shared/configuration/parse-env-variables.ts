import { z } from 'zod';

class InvalidEnvVariablesError extends Error {
  constructor(zodError: z.ZodError) {
    const errors = zodError.issues.map((issue) => {
      const expectedType = (issue as any).expected;
      const expectedTypeString = expectedType === undefined ? '' : `expected ${expectedType}`;

      return `${issue.path.join('.')}: ${expectedTypeString}`;
    });
    super(`Invalid environment variables: \n  ${errors.join('\n  ')}`);
    this.name = 'InvalidEnvVariablesError';
  }
}

export function parseEnvironmentVariables<T extends z.ZodRawShape>(schema: T) {
  const values = getEnvValues(schema);

  const safeParse = z.object(schema).safeParse(values);
  if (!safeParse.success) {
    throw new InvalidEnvVariablesError(safeParse.error);
  }

  return safeParse.data;
}

function getEnvValues<T extends z.ZodRawShape>(schema: T) {
  return Object.fromEntries(
    Object.entries(schema).map(([envVariableName, zodType]) => [
      envVariableName,
      potentiallyCoerceBoolean(zodType as z.ZodUnknown, process.env[envVariableName]),
    ]),
  );
}

function potentiallyCoerceBoolean(zodType: z.ZodUnknown, envValue?: string) {
  const isBooleanType = zodType instanceof z.ZodBoolean;
  const isBooleanDefaultType =
    zodType instanceof z.ZodDefault && (zodType as z.ZodDefault<z.ZodBoolean>).unwrap() instanceof z.ZodBoolean;

  if (isBooleanType || isBooleanDefaultType) {
    if (envValue === 'true') {
      return true;
    }
    if (envValue === 'false') {
      return false;
    }
  }

  return envValue;
}
