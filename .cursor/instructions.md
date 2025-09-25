# General Coding Rules

## Architecture

- Follow hexagonal architecture principles
- Keep domain code framework-agnostic
- Use dependency injection for external dependencies
- Separate concerns between layers

## Naming Conventions

- Use dash-case for file and folder names
- Use PascalCase for classes and interfaces
- Use camelCase for variables and functions
- Use descriptive names that explain intent

## Code Organization

- One class per file
- Group related functionality in modules
- **ALWAYS use absolute imports with `@/` prefix - NEVER use relative imports like `./` or `../`**
- Keep functions small and focused

## Error Handling

- Use custom error classes for domain errors
- Handle errors at appropriate boundaries
- Provide meaningful error messages
- Log errors appropriately

## Testing

- **NEVER add "integration scenarios" sections in tests - they are redundant and unnecessary**
- Focus on unit tests and E2E tests without redundant integration scenario sections
- Use Given/When/Then pattern for test structure
- Keep tests focused and specific
