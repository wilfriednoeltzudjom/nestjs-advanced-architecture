import { resolve } from 'path';
import { DockerComposeEnvironment, StartedDockerComposeEnvironment, Wait } from 'testcontainers';
import { afterAll, beforeAll } from 'vitest';

let environment: StartedDockerComposeEnvironment;

export const setupTestcontainers = async (): Promise<StartedDockerComposeEnvironment> => {
  if (environment) {
    console.log('🔄 Testcontainers already running, reusing existing environment');
    return environment;
  }

  console.log('🚀 Starting testcontainers setup...');
  const composeFilePath = resolve(__dirname, './');
  const composeFile = 'docker-compose.yml';

  console.log(`📁 Using compose file: ${composeFilePath}/${composeFile}`);
  console.log('🐳 Starting Docker Compose environment...');

  environment = await new DockerComposeEnvironment(composeFilePath, composeFile)
    .withEnvironmentFile('.env')
    .withWaitStrategy('postgres', Wait.forHealthCheck())
    .withWaitStrategy('migrations', Wait.forLogMessage('✅ All migrations completed successfully'))
    .up();

  console.log('✅ Testcontainers setup completed successfully');
  console.log(`🗄️  Database available at: localhost:5434`);

  return environment;
};

export const teardownTestcontainers = async (): Promise<void> => {
  if (environment) {
    console.log('🧹 Tearing down testcontainers...');
    await environment.down();
    environment = undefined as any;
    console.log('✅ Testcontainers teardown completed');
  }
};

// Global setup for all E2E tests
beforeAll(async () => {
  await setupTestcontainers();
}, 120000); // 2 minutes timeout for container startup

afterAll(async () => {
  await teardownTestcontainers();
}, 30000); // 30 second timeout for cleanup
