import request from 'supertest';
import { App } from 'supertest/types';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { INestApplication } from '@nestjs/common';

import { Alarm } from '@/alarms/domain/entities/alarm.entity';
import { E2ETestHelper } from '@/test/helpers/e2e-test.helper';

describe('Controller e2e: AlarmsController', () => {
  let e2eTestHelper: E2ETestHelper;
  let app: INestApplication<App>;

  beforeEach(async () => {
    e2eTestHelper = new E2ETestHelper();
    app = await e2eTestHelper.setup();
  });

  afterEach(async () => {
    await e2eTestHelper.teardown();
  });

  describe('POST /alarms', () => {
    it('should create a new alarm successfully', async () => {
      // Given: a valid create alarm request
      const createAlarmDto = {
        name: 'System Alert',
        severity: 'critical',
      };

      // When: creating an alarm
      const response = await request(app.getHttpServer()).post('/alarms').send(createAlarmDto).expect(201);

      // Then: should return the created alarm
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('name', 'System Alert');
      expect(response.body).toHaveProperty('severity', 'critical');
      expect(response.body).toHaveProperty('createdAt');
      expect(response.body).toHaveProperty('updatedAt');
    });

    it('should create alarm with different severity levels', async () => {
      // Given: different severity levels
      const severities = ['critical', 'high', 'medium', 'low'] as const;

      for (const severity of severities) {
        const createAlarmDto = {
          name: `Test Alarm ${severity}`,
          severity,
        };

        // When: creating an alarm with specific severity
        const response = await request(app.getHttpServer()).post('/alarms').send(createAlarmDto).expect(201);

        // Then: should create alarm with correct severity
        expect(response.body.severity).toBe(severity);
        expect(response.body.name).toBe(`Test Alarm ${severity}`);
      }
    });

    it('should handle alarm creation with whitespace in name', async () => {
      // Given: a create alarm request with whitespace in name
      const createAlarmDto = {
        name: '  System Alert  ',
        severity: 'high',
      };

      // When: creating an alarm
      const response = await request(app.getHttpServer()).post('/alarms').send(createAlarmDto).expect(201);

      // Then: should trim the whitespace and create alarm
      expect(response.body.name).toBe('System Alert');
      expect(response.body.severity).toBe('high');
    });

    it('should return 400 for invalid alarm name', async () => {
      // Given: a create alarm request with empty name
      const createAlarmDto = {
        name: '',
        severity: 'critical',
      };

      // When & Then: creating an alarm should return validation error
      await request(app.getHttpServer()).post('/alarms').send(createAlarmDto).expect(400);
    });

    it('should return 400 for invalid severity', async () => {
      // Given: a create alarm request with invalid severity
      const createAlarmDto = {
        name: 'Test Alarm',
        severity: 'invalid-severity',
      };

      // When & Then: creating an alarm should return validation error
      await request(app.getHttpServer()).post('/alarms').send(createAlarmDto).expect(400);
    });

    it('should return 400 for missing required fields', async () => {
      // Given: a create alarm request with missing fields
      const createAlarmDto = {
        name: 'Test Alarm',
        // severity is missing
      };

      // When & Then: creating an alarm should return validation error
      await request(app.getHttpServer()).post('/alarms').send(createAlarmDto).expect(400);
    });

    it('should prevent duplicate alarm names', async () => {
      // Given: an existing alarm
      const createAlarmDto = {
        name: 'Duplicate Alarm',
        severity: 'medium',
      };

      // When: creating the first alarm
      await request(app.getHttpServer()).post('/alarms').send(createAlarmDto).expect(201);

      // Then: creating a second alarm with the same name should fail
      await request(app.getHttpServer()).post('/alarms').send(createAlarmDto).expect(409); // Conflict
    });
  });

  describe('GET /alarms', () => {
    it('should return empty array when no alarms exist', async () => {
      // Given: no alarms in the system
      // When: retrieving all alarms
      const response = await request(app.getHttpServer()).get('/alarms').expect(200);

      // Then: should return empty array
      expect(response.body).toEqual([]);
    });

    it('should return all created alarms', async () => {
      // Given: multiple alarms created
      const alarms = [
        { name: 'First Alarm', severity: 'critical' },
        { name: 'Second Alarm', severity: 'high' },
        { name: 'Third Alarm', severity: 'medium' },
      ];

      // Create alarms
      await Promise.all(
        alarms.map((alarm) => {
          return e2eTestHelper.getAlarmSeeder().seedAlarm(alarm) as Promise<Alarm>;
        }),
      );

      // When: retrieving all alarms
      const response = await request(app.getHttpServer()).get('/alarms').expect(200);

      // Then: should return all created alarms
      expect(response.body).toHaveLength(3);

      const alarmNames = response.body.map((alarm: any) => alarm.name as string);
      expect(alarmNames).toContain('First Alarm');
      expect(alarmNames).toContain('Second Alarm');
      expect(alarmNames).toContain('Third Alarm');

      // Verify each alarm has required properties
      response.body.forEach((alarm: any) => {
        expect(alarm).toHaveProperty('id');
        expect(alarm).toHaveProperty('name');
        expect(alarm).toHaveProperty('severity');
        expect(alarm).toHaveProperty('createdAt');
        expect(alarm).toHaveProperty('updatedAt');
      });
    });

    it('should return alarms with correct data types', async () => {
      // Given: an alarm created
      await e2eTestHelper.getAlarmSeeder().seedAlarm();

      // When: retrieving all alarms
      const response = await request(app.getHttpServer()).get('/alarms').expect(200);

      // Then: should return alarm with correct data types
      const alarm = response.body[0];
      expect(typeof alarm.id).toBe('string');
      expect(typeof alarm.name).toBe('string');
      expect(typeof alarm.severity).toBe('string');
      expect(typeof alarm.createdAt).toBe('string');
      expect(typeof alarm.updatedAt).toBe('string');
    });
  });
});
