import { MongooseModuleOptions } from '@nestjs/mongoose';

import { configuration } from '@/shared/configuration/configuration';

export const mongooseConfig = {
  uri: configuration().database.mongodb.uri,
  options: {
    // Connection options for better performance and reliability
    maxPoolSize: 10, // Maintain up to 10 socket connections
    serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    bufferCommands: false, // Disable mongoose buffering
    // Enable retry logic
    retryWrites: true,
    // Set write concern
    w: 'majority' as const,
    // Set read preference
    readPreference: 'primary' as const,
  } as MongooseModuleOptions,
};
