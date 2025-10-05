import { Kysely, sql } from 'kysely';

import { Injectable } from '@nestjs/common';

import { Logger } from '@/shared/application/contracts/logger.contract';
import { InjectLogger } from '@/shared/infrastructure/logger/logger.decorators';

export interface DatabaseHealthStatus {
  status: 'healthy' | 'unhealthy';
  connectionState: 'connected' | 'disconnected' | 'connecting' | 'unknown';
  database?: string;
  host?: string;
  port?: number;
  error?: string;
  responseTime?: number;
}

@Injectable()
export class KyselyHealthCheckService {
  constructor(@InjectLogger() private readonly logger: Logger) {
    this.logger.setContext(KyselyHealthCheckService.name);
  }

  async checkHealth<T>(db: Kysely<T>): Promise<DatabaseHealthStatus> {
    const startTime = Date.now();

    try {
      // Perform a simple query to check database connectivity using raw SQL
      await sql`SELECT COUNT(*) as count FROM information_schema.tables WHERE table_schema = 'public'`.execute(db);

      const responseTime = Date.now() - startTime;

      // Get connection info if available
      const connectionInfo = this.getConnectionInfo(db);

      return {
        status: 'healthy',
        connectionState: 'connected',
        database: connectionInfo.database,
        host: connectionInfo.host,
        port: connectionInfo.port,
        responseTime,
      };
    } catch (error) {
      this.logger.error('Kysely health check failed:', error);

      const responseTime = Date.now() - startTime;
      const connectionInfo = this.getConnectionInfo(db);

      return {
        status: 'unhealthy',
        connectionState: 'disconnected',
        database: connectionInfo.database,
        host: connectionInfo.host,
        port: connectionInfo.port,
        responseTime,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async checkConnectionPool<T>(db: Kysely<T>): Promise<{
    totalConnections: number;
    idleConnections: number;
    activeConnections: number;
  }> {
    try {
      // Query PostgreSQL connection pool statistics using raw SQL
      const result = await sql`
        SELECT 
          COUNT(*) as total_connections,
          COUNT(*) FILTER (WHERE state = 'idle') as idle_connections,
          COUNT(*) FILTER (WHERE state = 'active') as active_connections
        FROM pg_stat_activity 
        WHERE datname = current_database()
      `.execute(db);

      const stats = result.rows[0] as any;
      return {
        totalConnections: Number(stats.total_connections),
        idleConnections: Number(stats.idle_connections),
        activeConnections: Number(stats.active_connections),
      };
    } catch (error) {
      this.logger.error('Failed to get connection pool stats:', error);
      return {
        totalConnections: 0,
        idleConnections: 0,
        activeConnections: 0,
      };
    }
  }

  async checkDatabaseSize<T>(db: Kysely<T>): Promise<{
    databaseSize: string;
    databaseSizeBytes: number;
  }> {
    try {
      const result = await sql`
        SELECT 
          pg_size_pretty(pg_database_size(current_database())) as size_pretty,
          pg_database_size(current_database()) as size_bytes
      `.execute(db);

      const sizeInfo = result.rows[0] as any;
      return {
        databaseSize: sizeInfo.size_pretty as string,
        databaseSizeBytes: Number(sizeInfo.size_bytes),
      };
    } catch (error) {
      this.logger.error('Failed to get database size:', error);
      return {
        databaseSize: 'Unknown',
        databaseSizeBytes: 0,
      };
    }
  }

  async getDetailedHealthStatus<T>(db: Kysely<T>): Promise<{
    basic: DatabaseHealthStatus;
    connectionPool: {
      totalConnections: number;
      idleConnections: number;
      activeConnections: number;
    };
    databaseSize: {
      databaseSize: string;
      databaseSizeBytes: number;
    };
  }> {
    const [basic, connectionPool, databaseSize] = await Promise.all([
      this.checkHealth(db),
      this.checkConnectionPool(db),
      this.checkDatabaseSize(db),
    ]);

    return {
      basic,
      connectionPool,
      databaseSize,
    };
  }

  private getConnectionInfo<T>(db: Kysely<T>): {
    database?: string;
    host?: string;
    port?: number;
  } {
    try {
      // Try to extract connection info from the Kysely instance
      // Note: This is a best-effort approach as Kysely doesn't expose connection details directly
      const connection = (db as any).connection;

      if (connection) {
        return {
          database: connection.database,
          host: connection.host,
          port: connection.port,
        };
      }

      return {};
    } catch (error) {
      this.logger.warn('Could not extract connection info:', error);
      return {};
    }
  }
}
