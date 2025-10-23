import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { OpenAIService } from './openai.service';
import { RunwayService } from './runway.service';
import { GoogleVeoService } from './google-veo.service';

export interface GenerationRequest {
  prompt: string;
  imageUrl?: string;
  videoUrl?: string;
  model?: string;
  duration?: number;
  resolution?: string;
  quality?: string;
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
  ) {}

  async generateTextToImage(request: GenerationRequest, userId: string): Promise<GenerationResponse> {
    try {
      // Create generation job record
      const job = await this.prisma.generationJob.create({
        data: {
          userId,
          type: 'image',
          status: 'processing',
          input: request,
        },
      });

      // Generate image using OpenAI
      const result = await this.openaiService.generateImage(
        request.prompt,
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
}
