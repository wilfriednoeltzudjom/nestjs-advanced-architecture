import { beforeEach, describe, expect, it } from 'vitest';

import { UuidProvider } from '@/shared/infrastructure/adapters/providers/uild.provider';

describe('UuidProvider', () => {
  let provider: UuidProvider;

  beforeEach(() => {
    provider = new UuidProvider();
  });

  describe('generate', () => {
    it('should generate a valid ULID string', () => {
      // Given: a UuidProvider instance
      // When: generating an ID
      const id = provider.generate();

      // Then: it should return a valid ULID string
      expect(id).toBeDefined();
      expect(typeof id).toBe('string');
      expect(id.length).toBe(26);
      expect(provider.isValid(id)).toBe(true);
    });

    it('should generate unique IDs on multiple calls', () => {
      // Given: a UuidProvider instance
      // When: generating two IDs
      const firstId = provider.generate();
      const secondId = provider.generate();

      // Then: the IDs should be different
      expect(firstId).not.toBe(secondId);
    });

    it('should generate IDs with correct ULID format', () => {
      // Given: a UuidProvider instance
      // When: generating an ID
      const id = provider.generate();

      // Then: it should match ULID format (Crockford's Base32)
      expect(id).toMatch(/^[0-9A-HJKMNP-TV-Z]{26}$/);
    });

    it('should generate monotonically increasing IDs', () => {
      // Given: a UuidProvider instance
      // When: generating three IDs in sequence
      const firstId = provider.generate();
      const secondId = provider.generate();
      const thirdId = provider.generate();

      // Then: they should be in ascending order
      expect(firstId <= secondId).toBe(true); // ULIDs are lexicographically sortable
      expect(secondId <= thirdId).toBe(true);
    });

    it('should generate IDs with timestamp component', () => {
      // Given: a UuidProvider instance and current timestamp
      const beforeTime = Date.now();

      // When: generating an ID
      const id = provider.generate();

      // Then: the ID should contain a valid timestamp
      const afterTime = Date.now();
      const timestamp = provider.decodeTime(id);

      expect(timestamp).toBeGreaterThanOrEqual(beforeTime);
      expect(timestamp).toBeLessThanOrEqual(afterTime);
    });
  });

  describe('isValid', () => {
    it('should return true for valid ULID strings', () => {
      // Given: valid ULID strings
      const validIds = ['01ARZ3NDEKTSV4RRFFQ69G5FAV', '01ARZ3NDEKTSV4RRFFQ69G5FAW', '01ARZ3NDEKTSV4RRFFQ69G5FAX'];

      // When: checking validity of each ID
      // Then: all should be valid
      expect(provider.isValid(validIds[0])).toBe(true);
      expect(provider.isValid(validIds[1])).toBe(true);
      expect(provider.isValid(validIds[2])).toBe(true);
    });

    it('should return true for generated ULID', () => {
      // Given: a generated ULID
      const generatedId = provider.generate();

      // When: checking its validity
      const isValid = provider.isValid(generatedId);

      // Then: it should be valid
      expect(isValid).toBe(true);
    });

    it('should return false for empty string', () => {
      // Given: an empty string
      const emptyId = '';

      // When: checking its validity
      const isValid = provider.isValid(emptyId);

      // Then: it should be invalid
      expect(isValid).toBe(false);
    });

    it('should return false for too short string', () => {
      // Given: a string that is too short
      const shortId = 'invalid';

      // When: checking its validity
      const isValid = provider.isValid(shortId);

      // Then: it should be invalid
      expect(isValid).toBe(false);
    });

    it('should return false for too long string', () => {
      // Given: a string that is too long
      const longId = '01ARZ3NDEKTSV4RRFFQ69G5FAVEXTRA';

      // When: checking its validity
      const isValid = provider.isValid(longId);

      // Then: it should be invalid
      expect(isValid).toBe(false);
    });

    it('should return false for string with invalid characters', () => {
      // Given: a string with invalid ULID characters
      const invalidId = '01ARZ3NDEKTSV4RRFFQ69G5FAI';

      // When: checking its validity
      const isValid = provider.isValid(invalidId);

      // Then: it should be invalid
      expect(isValid).toBe(false);
    });

    it('should return false for null input', () => {
      // Given: null input
      const nullId = null as unknown as string;

      // When: checking its validity
      const isValid = provider.isValid(nullId);

      // Then: it should be invalid
      expect(isValid).toBe(false);
    });

    it('should return false for undefined input', () => {
      // Given: undefined input
      const undefinedId = undefined as unknown as string;

      // When: checking its validity
      const isValid = provider.isValid(undefinedId);

      // Then: it should be invalid
      expect(isValid).toBe(false);
    });

    it('should return false for non-string input', () => {
      // Given: non-string input
      const numberId = 123 as unknown as string;

      // When: checking its validity
      const isValid = provider.isValid(numberId);

      // Then: it should be invalid
      expect(isValid).toBe(false);
    });
  });
});
