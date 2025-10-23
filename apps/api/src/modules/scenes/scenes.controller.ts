import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Body, 
  Param, 
  UseGuards, 
  Request 
} from '@nestjs/common';
import { ScenesService } from './scenes.service';
import { ClerkAuthGuard } from '../auth/clerk-auth.guard';

@Controller('scenes')
@UseGuards(ClerkAuthGuard)
export class ScenesController {
  constructor(private scenesService: ScenesService) {}

  @Post()
  async createScene(
    @Body() body: { 
      projectId: string; 
      prompt: string; 
      order: number; 
      title?: string 
    },
    @Request() req: any
  ) {
    const userId = req.user.sub; // Clerk user ID
    return this.scenesService.createScene(
      body.projectId,
      userId,
      body.prompt,
      body.order,
      body.title
    );
  }

  @Get('project/:projectId')
  async getProjectScenes(@Param('projectId') projectId: string, @Request() req: any) {
    const userId = req.user.sub; // Clerk user ID
    return this.scenesService.getProjectScenes(projectId, userId);
  }

  @Get(':id')
  async getScene(@Param('id') sceneId: string, @Request() req: any) {
    const userId = req.user.sub; // Clerk user ID
    return this.scenesService.getSceneById(sceneId, userId);
  }

  @Put(':id')
  async updateScene(
    @Param('id') sceneId: string,
    @Body() body: {
      title?: string;
      prompt?: string;
      imageUrl?: string;
      videoUrl?: string;
      thumbnail?: string;
      duration?: number;
      status?: string;
      metadata?: any;
    },
    @Request() req: any
  ) {
    const userId = req.user.sub; // Clerk user ID
    return this.scenesService.updateScene(sceneId, userId, body);
  }

  @Delete(':id')
  async deleteScene(@Param('id') sceneId: string, @Request() req: any) {
    const userId = req.user.sub; // Clerk user ID
    return this.scenesService.deleteScene(sceneId, userId);
  }

  @Put('project/:projectId/reorder')
  async reorderScenes(
    @Param('projectId') projectId: string,
    @Body() body: { sceneOrders: { sceneId: string; order: number }[] },
    @Request() req: any
  ) {
    const userId = req.user.sub; // Clerk user ID
    return this.scenesService.reorderScenes(projectId, userId, body.sceneOrders);
  }

  @Get('project/:projectId/stats')
  async getSceneStats(@Param('projectId') projectId: string, @Request() req: any) {
    const userId = req.user.sub; // Clerk user ID
    return this.scenesService.getSceneStats(projectId, userId);
  }
}
