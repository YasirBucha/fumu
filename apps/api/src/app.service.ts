import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): any {
    return {
      message: 'Welcome to FuMu API - AI-Powered Auto Movie Creation',
      version: '1.0.0',
      status: 'running',
      endpoints: {
        health: '/health',
        projects: '/projects',
        characters: '/characters',
        scenes: '/scenes',
        ai: '/ai',
        video: '/video',
        auth: '/auth'
      },
      documentation: 'See LOCAL_TESTING_GUIDE.md for testing instructions'
    };
  }
}
