import { Inject } from '@nestjs/common';
import { getConnectionToken } from '@nestjs/mongoose';

/**
 * Inject the default MongoDB connection
 */
export const InjectMongoConnection = () => Inject(getConnectionToken());

/**
 * Inject a specific MongoDB connection by name
 */
export const InjectMongoConnectionByName = (name: string) => Inject(getConnectionToken(name));
