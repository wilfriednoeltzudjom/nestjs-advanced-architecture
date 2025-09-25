import { beforeEach, describe, expect, it } from 'vitest';
import { z } from 'zod';

import { parseEnvironmentVariables } from '@/shared/configuration/parse-env-variables';

describe('parseEnvironmentVariables', () => {
  beforeEach(() => {
    // Clean up environment variables before each test
    delete process.env.STRING_VAR;
    delete process.env.BOOLEAN_VAR_TRUE;
    delete process.env.BOOLEAN_VAR_FALSE;
    delete process.env.BOOLEAN_VAR_INVALID;
    delete process.env.NUMBER_VAR;
    delete process.env.REQUIRED_STRING_VAR;
    delete process.env.REQUIRED_BOOLEAN_VAR;
    delete process.env.REQUIRED_NUMBER_VAR;
  });

  describe('string parsing', () => {
    it('should parse valid string values', () => {
      // Given
      process.env.STRING_VAR = 'test-value';

      // When
      const result = parseEnvironmentVariables({
        STRING_VAR: z.string(),
      });

      // Then
      expect(result).toEqual({
        STRING_VAR: 'test-value',
      });
    });

    it('should handle empty strings', () => {
      // Given
      process.env.STRING_VAR = '';

      // When
      const result = parseEnvironmentVariables({
        STRING_VAR: z.string(),
      });

      // Then
      expect(result).toEqual({
        STRING_VAR: '',
      });
    });
  });

  describe('boolean parsing', () => {
    it('should parse "true" string as boolean true', () => {
      // Given
      process.env.BOOLEAN_VAR_TRUE = 'true';

      // When
      const result = parseEnvironmentVariables({
        BOOLEAN_VAR_TRUE: z.boolean(),
      });

      // Then
      expect(result).toEqual({
        BOOLEAN_VAR_TRUE: true,
      });
    });

    it('should parse "false" string as boolean false', () => {
      // Given
      process.env.BOOLEAN_VAR_FALSE = 'false';

      // When
      const result = parseEnvironmentVariables({
        BOOLEAN_VAR_FALSE: z.boolean(),
      });

      // Then
      expect(result).toEqual({
        BOOLEAN_VAR_FALSE: false,
      });
    });

    it('should not coerce non-boolean strings', () => {
      // Given
      process.env.BOOLEAN_VAR_INVALID = 'maybe';

      // When & Then
      expect(() =>
        parseEnvironmentVariables({
          BOOLEAN_VAR_INVALID: z.boolean(),
        }),
      ).toThrow('Invalid environment variables:');
    });

    it('should handle boolean defaults when env var is not provided', () => {
      // Given - no environment variable set

      // When
      const result = parseEnvironmentVariables({
        BOOLEAN_DEFAULT_TRUE: z.boolean().default(true),
        BOOLEAN_DEFAULT_FALSE: z.boolean().default(false),
      });

      // Then
      expect(result).toEqual({
        BOOLEAN_DEFAULT_TRUE: true,
        BOOLEAN_DEFAULT_FALSE: false,
      });
    });

    it('should handle boolean defaults when env var is provided', () => {
      // Given
      process.env.BOOLEAN_DEFAULT_TRUE = 'false';
      process.env.BOOLEAN_DEFAULT_FALSE = 'true';

      // When
      const result = parseEnvironmentVariables({
        BOOLEAN_DEFAULT_TRUE: z.boolean().default(true),
        BOOLEAN_DEFAULT_FALSE: z.boolean().default(false),
      });

      // Then
      expect(result).toEqual({
        BOOLEAN_DEFAULT_TRUE: false,
        BOOLEAN_DEFAULT_FALSE: true,
      });
    });
  });

  describe('number parsing', () => {
    it('should parse valid number strings', () => {
      // Given
      process.env.NUMBER_VAR = '123';

      // When
      const result = parseEnvironmentVariables({
        NUMBER_VAR: z.coerce.number(),
      });

      // Then
      expect(result).toEqual({
        NUMBER_VAR: 123,
      });
    });

    it('should handle decimal numbers', () => {
      // Given
      process.env.NUMBER_VAR = '123.45';

      // When
      const result = parseEnvironmentVariables({
        NUMBER_VAR: z.coerce.number(),
      });

      // Then
      expect(result).toEqual({
        NUMBER_VAR: 123.45,
      });
    });
  });

  describe('error handling', () => {
    it('should throw InvalidEnvVariablesError for missing required string', () => {
      // Given - no environment variable set

      // When & Then
      expect(() =>
        parseEnvironmentVariables({
          REQUIRED_STRING_VAR: z.string(),
        }),
      ).toThrow('Invalid environment variables:');
    });

    it('should throw InvalidEnvVariablesError for missing required boolean', () => {
      // Given - no environment variable set

      // When & Then
      expect(() =>
        parseEnvironmentVariables({
          REQUIRED_BOOLEAN_VAR: z.boolean(),
        }),
      ).toThrow('Invalid environment variables:');
    });

    it('should throw InvalidEnvVariablesError for missing required number', () => {
      // Given - no environment variable set

      // When & Then
      expect(() =>
        parseEnvironmentVariables({
          REQUIRED_NUMBER_VAR: z.number(),
        }),
      ).toThrow('Invalid environment variables:');
    });

    it('should include all validation errors in the error message', () => {
      // Given - no environment variables set

      // When & Then
      expect(() =>
        parseEnvironmentVariables({
          REQUIRED_STRING_VAR: z.string(),
          REQUIRED_BOOLEAN_VAR: z.boolean(),
          REQUIRED_NUMBER_VAR: z.number(),
        }),
      ).toThrow(
        'Invalid environment variables: \n  REQUIRED_STRING_VAR: expected string\n  REQUIRED_BOOLEAN_VAR: expected boolean\n  REQUIRED_NUMBER_VAR: expected number',
      );
    });

    it('should not throw for variables with defaults when not provided', () => {
      // Given - no environment variables set

      // When
      const result = parseEnvironmentVariables({
        DEFAULT_STRING_VAR: z.string().default('default-value'),
        DEFAULT_BOOLEAN_VAR: z.boolean().default(true),
        DEFAULT_NUMBER_VAR: z.number().default(42),
      });

      // Then
      expect(result).toEqual({
        DEFAULT_STRING_VAR: 'default-value',
        DEFAULT_BOOLEAN_VAR: true,
        DEFAULT_NUMBER_VAR: 42,
      });
    });
  });

  describe('mixed scenarios', () => {
    it('should handle a complex schema with mixed types and defaults', () => {
      // Given
      process.env.APP_NAME = 'app-name';
      process.env.DEBUG = 'true';
      process.env.PORT = '3000';

      // When
      const result = parseEnvironmentVariables({
        APP_NAME: z.string(),
        DEBUG: z.boolean(),
        PORT: z.coerce.number(),
        LOG_LEVEL: z.string().default('info'),
      });

      // Then
      expect(result).toEqual({
        APP_NAME: 'app-name',
        DEBUG: true,
        PORT: 3000,
        LOG_LEVEL: 'info',
      });
    });
  });
});
