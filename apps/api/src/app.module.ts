import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { AIModule } from './modules/ai/ai.module';
import { ScenesModule } from './modules/scenes/scenes.module';
import { CharactersModule } from './modules/characters/characters.module';

@Module({
  imports: [PrismaModule, AuthModule, ProjectsModule, AIModule, ScenesModule, CharactersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
