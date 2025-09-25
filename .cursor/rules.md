# Test Generation Rules

## Test Structure

- Always use Gherkin Given/When/Then syntax in comments
- Use `describe` blocks to group related tests
- Use `it` blocks for individual test cases
- Use `beforeEach` for test setup when needed

## Test Naming

- Use descriptive test names that explain the expected behavior
- Start with "should" followed by the expected outcome
- Be specific about the scenario being tested

## Test Comments

- Always include Given/When/Then comments in this format:
  ```typescript
  // Given: [initial state/context - be concise]
  // When: [action being performed]
  // Then: [expected outcome]
  ```

## Test Organization

- Group tests by method/functionality using `describe` blocks
- Each test should focus on a single behavior
- Avoid loops in tests - use specific test cases instead
- Use meaningful variable names that describe the test data

## Assertions

- Use specific matchers (`toBe`, `toBeDefined`, `toMatch`, etc.)
- Avoid generic assertions when specific ones are available
- Test both positive and negative cases
- Include edge cases and error conditions

## Test Data

- Use realistic test data that represents actual usage
- Avoid magic numbers - use descriptive constants
- Test with valid and invalid inputs
- Include boundary conditions

## File Naming

- Test files should end with `.spec.ts`
- Place test files next to the implementation file
- Use the same directory structure as source files

## Imports

- Import only what's needed for the test
- Use absolute imports with `@/` prefix
- Group imports: external libraries first, then internal modules

## Example Test Structure

### Example for ClassName with a public constructor

```typescript
describe('ClassName', () => {
  let instance: ClassName;

  beforeEach(() => {
    instance = new ClassName();
  });

  describe('methodName', () => {
    it('should do something specific', () => {
      // Given: [setup - be concise]
      const input = 'test value';

      // When: [action]
      const result = instance.methodName(input);

      // Then: [assertion]
      expect(result).toBe('expected value');
    });
  });
});
```

## Test Coverage

- Test all public methods
- Test error conditions and edge cases
- Test with different input types (valid, invalid, null, undefined)
- Test return values and side effects
- Test method interactions and dependencies

## Mocking

- Mock external dependencies
- Use `jest.fn()` or `vi.fn()` for function mocks
- Mock only what's necessary for the test
- Verify mock calls when relevant

## Async Testing

- Use `async/await` for async operations
- Test both success and failure scenarios
- Use proper error handling in tests
- Test timeout scenarios when applicable
