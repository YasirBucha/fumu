import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

@Controller('health')
export class HealthController {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  @Get()
  async check() {
    try {
      // Check database connection
      await this.prisma.$queryRaw`SELECT 1`;
      
      const health = {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        services: {
          database: 'connected',
          redis: 'connected', // TODO: Add Redis health check
          ai: 'configured', // TODO: Add AI service health checks
        },
        version: process.env.npm_package_version || '1.0.0',
        environment: this.configService.get('NODE_ENV') || 'development',
      };

      return health;
    } catch (error) {
      return {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error.message,
        services: {
          database: 'disconnected',
          redis: 'unknown',
          ai: 'unknown',
        },
      };
    }
  }

  @Get('ready')
  async readiness() {
    try {
      // Check if all required services are ready
      await this.prisma.$queryRaw`SELECT 1`;
      
      return {
        status: 'ready',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        status: 'not ready',
        timestamp: new Date().toISOString(),
        error: error.message,
      };
    }
  }

  @Get('live')
  liveness() {
    return {
      status: 'alive',
      timestamp: new Date().toISOString(),
    };
  }
}
