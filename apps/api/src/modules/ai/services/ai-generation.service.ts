import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { OpenAIService } from './openai.service';
import { RunwayService } from './runway.service';
import { GoogleVeoService } from './google-veo.service';
import { CharactersService } from '../../characters/characters.service';

export interface GenerationRequest {
  prompt: string;
  imageUrl?: string;
  videoUrl?: string;
  model?: string;
  duration?: number;
  resolution?: string;
  quality?: string;
  characterId?: string;
  maintainCharacter?: boolean;
}

export interface GenerationResponse {
  success: boolean;
  imageUrl?: string;
  videoUrl?: string;
  jobId?: string;
  status?: string;
  error?: string;
  revisedPrompt?: string;
}

@Injectable()
export class AIGenerationService {
  constructor(
    private prisma: PrismaService,
    private openaiService: OpenAIService,
    private runwayService: RunwayService,
    private googleVeoService: GoogleVeoService,
    private charactersService: CharactersService,
  ) {}

  async generateTextToImage(request: GenerationRequest, userId: string): Promise<GenerationResponse> {
    try {
      // Enhance prompt with character consistency if characterId is provided
      let enhancedPrompt = request.prompt;
      if (request.characterId && request.maintainCharacter) {
        const characterPrompt = await this.charactersService.generateCharacterPrompt(
          request.characterId,
          request.prompt,
          userId
        );
        enhancedPrompt = characterPrompt.characterPrompt;
      }

      // Create generation job record
      const job = await this.prisma.generationJob.create({
        data: {
          userId,
          type: 'image',
          status: 'processing',
          input: { ...request, prompt: enhancedPrompt },
        },
      });

      // Generate image using OpenAI
      const result = await this.openaiService.generateImage(
        enhancedPrompt,
        request.resolution || '1024x1024',
        request.quality || 'standard'
      );

      // Update job with result
      await this.prisma.generationJob.update({
        where: { id: job.id },
        data: {
          status: result.success ? 'completed' : 'failed',
          output: result,
          error: result.error,
          completedAt: new Date(),
        },
      });

      return result;
    } catch (error) {
      console.error('Text-to-image generation error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async generateImageToVideo(request: GenerationRequest, userId: string): Promise<GenerationResponse> {
    try {
      if (!request.imageUrl) {
        return {
          success: false,
          error: 'Image URL is required for image-to-video generation',
        };
      }

      // Create generation job record
      const job = await this.prisma.generationJob.create({
        data: {
          userId,
          type: 'video',
          status: 'processing',
          input: request,
        },
      });

      // Choose AI service based on preference or availability
      const model = request.model || 'runway';
      let result: GenerationResponse;

      switch (model) {
        case 'runway':
          result = await this.runwayService.generateVideoFromImage(
            request.imageUrl,
            request.prompt,
            request.duration || 4
          );
          break;
        case 'google-veo':
          result = await this.googleVeoService.generateVideoFromImage(
            request.imageUrl,
            request.prompt,
            request.duration || 5
          );
          break;
        default:
          result = await this.runwayService.generateVideoFromImage(
            request.imageUrl,
            request.prompt,
            request.duration || 4
          );
      }

      // Update job with result
      await this.prisma.generationJob.update({
        where: { id: job.id },
        data: {
          status: result.success ? 'completed' : 'failed',
          output: result,
          error: result.error,
          completedAt: new Date(),
        },
      });

      return result;
    } catch (error) {
      console.error('Image-to-video generation error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async extendVideo(request: GenerationRequest, userId: string): Promise<GenerationResponse> {
    try {
      if (!request.videoUrl) {
        return {
          success: false,
          error: 'Video URL is required for video extension',
        };
      }

      // Create generation job record
      const job = await this.prisma.generationJob.create({
        data: {
          userId,
          type: 'extension',
          status: 'processing',
          input: request,
        },
      });

      // Choose AI service based on preference or availability
      const model = request.model || 'runway';
      let result: GenerationResponse;

      switch (model) {
        case 'runway':
          result = await this.runwayService.extendVideo(
            request.videoUrl,
            request.prompt,
            request.duration || 4
          );
          break;
        case 'google-veo':
          result = await this.googleVeoService.extendVideo(
            request.videoUrl,
            request.prompt,
            request.duration || 5
          );
          break;
        default:
          result = await this.runwayService.extendVideo(
            request.videoUrl,
            request.prompt,
            request.duration || 4
          );
      }

      // Update job with result
      await this.prisma.generationJob.update({
        where: { id: job.id },
        data: {
          status: result.success ? 'completed' : 'failed',
          output: result,
          error: result.error,
          completedAt: new Date(),
        },
      });

      return result;
    } catch (error) {
      console.error('Video extension error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async checkJobStatus(jobId: string, model: string = 'runway') {
    try {
      switch (model) {
        case 'runway':
          return await this.runwayService.checkJobStatus(jobId);
        case 'google-veo':
          return await this.googleVeoService.checkJobStatus(jobId);
        default:
          return await this.runwayService.checkJobStatus(jobId);
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async getUserGenerationHistory(userId: string, limit: number = 20) {
    return this.prisma.generationJob.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  async generateSceneWithCharacter(
    scenePrompt: string,
    characterId: string,
    projectId: string,
    userId: string,
    options: {
      model?: string;
      duration?: number;
      resolution?: string;
      quality?: string;
    } = {}
  ) {
    try {
      // Get character information
      const character = await this.charactersService.getCharacterById(characterId, userId);
      
      // Generate enhanced prompt with character consistency
      const characterPrompt = await this.charactersService.generateCharacterPrompt(
        characterId,
        scenePrompt,
        userId
      );

      // Generate image first
      const imageResult = await this.generateTextToImage({
        prompt: characterPrompt.characterPrompt,
        model: options.model || 'openai',
        resolution: options.resolution || '1024x1024',
        quality: options.quality || 'standard',
        characterId,
        maintainCharacter: true,
      }, userId);

      if (!imageResult.success || !imageResult.imageUrl) {
        return {
          success: false,
          error: 'Failed to generate character image',
        };
      }

      // Generate video from image
      const videoResult = await this.generateImageToVideo({
        imageUrl: imageResult.imageUrl,
        prompt: characterPrompt.characterPrompt,
        model: options.model || 'runway',
        duration: options.duration || 4,
        resolution: options.resolution || '1280x720',
        characterId,
        maintainCharacter: true,
      }, userId);

      // Create scene record
      const scene = await this.prisma.scene.create({
        data: {
          projectId,
          prompt: scenePrompt,
          imageUrl: imageResult.imageUrl,
          videoUrl: videoResult.success ? videoResult.videoUrl : null,
          status: videoResult.success ? 'completed' : 'failed',
          aiModel: options.model || 'runway',
          metadata: {
            characterId,
            characterName: character.name,
            characterSeed: character.seed,
            generationJobId: videoResult.jobId,
          },
        },
      });

      return {
        success: true,
        scene,
        imageResult,
        videoResult,
        characterPrompt,
      };
    } catch (error) {
      console.error('Character-aware scene generation error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }
}
