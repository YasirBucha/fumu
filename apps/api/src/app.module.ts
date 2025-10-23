import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { AIModule } from './modules/ai/ai.module';
import { ScenesModule } from './modules/scenes/scenes.module';
import { CharactersModule } from './modules/characters/characters.module';
import { VideoModule } from './modules/video/video.module';
import { HealthModule } from './health/health.module';
import config from './config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: config,
      envFilePath: ['.env.local', '.env.production', '.env'],
    }),
    PrismaModule,
    AuthModule,
    ProjectsModule,
    AIModule,
    ScenesModule,
    CharactersModule,
    VideoModule,
    HealthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
