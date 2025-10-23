import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  url: process.env.DATABASE_URL,
  directUrl: process.env.DIRECT_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT || '10'),
  poolSize: parseInt(process.env.DB_POOL_SIZE || '5'),
  timeout: parseInt(process.env.DB_TIMEOUT || '30000'),
  retryAttempts: parseInt(process.env.DB_RETRY_ATTEMPTS || '3'),
  retryDelay: parseInt(process.env.DB_RETRY_DELAY || '1000'),
}));
