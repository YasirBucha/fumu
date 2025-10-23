import { registerAs } from '@nestjs/config';

export default registerAs('redis', () => ({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD || undefined,
  db: parseInt(process.env.REDIS_DB || '0'),
  retryDelayOnFailover: parseInt(process.env.REDIS_RETRY_DELAY || '100'),
  enableReadyCheck: true,
  maxRetriesPerRequest: parseInt(process.env.REDIS_MAX_RETRIES || '3'),
  lazyConnect: true,
  keepAlive: 30000,
  connectionName: 'fumu-redis',
  // Queue specific configuration
  queue: {
    defaultJobOptions: {
      removeOnComplete: parseInt(process.env.QUEUE_REMOVE_ON_COMPLETE || '10'),
      removeOnFail: parseInt(process.env.QUEUE_REMOVE_ON_FAIL || '5'),
      attempts: parseInt(process.env.QUEUE_ATTEMPTS || '3'),
      backoff: {
        type: 'exponential',
        delay: parseInt(process.env.QUEUE_BACKOFF_DELAY || '2000'),
      },
    },
    concurrency: parseInt(process.env.QUEUE_CONCURRENCY || '2'),
  },
}));
