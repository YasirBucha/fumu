import { Module } from '@nestjs/common';
import { AIGenerationController } from './controllers/ai-generation.controller';
import { AIGenerationService } from './services/ai-generation.service';
import { OpenAIService } from './services/openai.service';
import { RunwayService } from './services/runway.service';
import { GoogleVeoService } from './services/google-veo.service';

@Module({
  controllers: [AIGenerationController],
  providers: [AIGenerationService, OpenAIService, RunwayService, GoogleVeoService],
  exports: [AIGenerationService],
})
export class AIModule {}
