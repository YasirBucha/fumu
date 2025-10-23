import { 
  Controller, 
  Post, 
  Get, 
  Body, 
  Param, 
  UseGuards, 
  Request,
  Query 
} from '@nestjs/common';
import { AIGenerationService } from '../services/ai-generation.service';
import { ClerkAuthGuard } from '../../auth/clerk-auth.guard';
import { 
  TextToImageDto, 
  ImageToVideoDto, 
  VideoExtensionDto, 
  JobStatusDto 
} from '../dto/generation.dto';

@Controller('ai')
@UseGuards(ClerkAuthGuard)
export class AIGenerationController {
  constructor(private aiGenerationService: AIGenerationService) {}

  @Post('text-to-image')
  async generateTextToImage(
    @Body() body: TextToImageDto,
    @Request() req: any
  ) {
    const userId = req.user.sub; // Clerk user ID
    return this.aiGenerationService.generateTextToImage(body, userId);
  }

  @Post('image-to-video')
  async generateImageToVideo(
    @Body() body: ImageToVideoDto,
    @Request() req: any
  ) {
    const userId = req.user.sub; // Clerk user ID
    return this.aiGenerationService.generateImageToVideo({
      ...body,
      prompt: body.prompt || '',
    }, userId);
  }

  @Post('extend-video')
  async extendVideo(
    @Body() body: VideoExtensionDto,
    @Request() req: any
  ) {
    const userId = req.user.sub; // Clerk user ID
    return this.aiGenerationService.extendVideo(body, userId);
  }

  @Get('job/:jobId/status')
  async checkJobStatus(
    @Param('jobId') jobId: string,
    @Query('model') model: string = 'runway'
  ) {
    return this.aiGenerationService.checkJobStatus(jobId, model);
  }

  @Get('generations')
  async getUserGenerations(
    @Request() req: any,
    @Query('limit') limit: number = 20
  ) {
    const userId = req.user.sub; // Clerk user ID
    return this.aiGenerationService.getUserGenerationHistory(userId, limit);
  }

  @Post('scene-with-character')
  async generateSceneWithCharacter(
    @Body() body: {
      scenePrompt: string;
      characterId: string;
      projectId: string;
      model?: string;
      duration?: number;
      resolution?: string;
      quality?: string;
    },
    @Request() req: any
  ) {
    const userId = req.user.sub; // Clerk user ID
    return this.aiGenerationService.generateSceneWithCharacter(
      body.scenePrompt,
      body.characterId,
      body.projectId,
      userId,
      {
        model: body.model,
        duration: body.duration,
        resolution: body.resolution,
        quality: body.quality,
      }
    );
  }

  @Get('models')
  async getAvailableModels() {
    return {
      models: [
        {
          id: 'openai',
          name: 'OpenAI DALL-E 3',
          type: 'text-to-image',
          description: 'High-quality image generation from text prompts',
          capabilities: ['text-to-image'],
        },
        {
          id: 'runway',
          name: 'Runway ML',
          type: 'video-generation',
          description: 'Advanced video generation and extension',
          capabilities: ['image-to-video', 'video-extension'],
        },
        {
          id: 'google-veo',
          name: 'Google Veo 3',
          type: 'video-generation',
          description: 'Google\'s latest video generation model',
          capabilities: ['image-to-video', 'video-extension'],
        },
      ],
    };
  }
}
