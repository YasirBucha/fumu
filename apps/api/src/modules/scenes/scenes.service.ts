import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ScenesService {
  constructor(private prisma: PrismaService) {}

  async createScene(
    projectId: string,
    userId: string,
    prompt: string,
    order: number,
    title?: string
  ) {
    // Verify user owns the project
    const project = await this.prisma.project.findFirst({
      where: { id: projectId, userId },
    });

    if (!project) {
      throw new Error('Project not found or access denied');
    }

    return this.prisma.scene.create({
      data: {
        projectId,
        order,
        prompt,
        title,
        status: 'pending',
        aiModel: 'openai', // Default model
      },
      include: {
        project: true,
      },
    });
  }

  async getProjectScenes(projectId: string, userId: string) {
    // Verify user owns the project
    const project = await this.prisma.project.findFirst({
      where: { id: projectId, userId },
    });

    if (!project) {
      throw new Error('Project not found or access denied');
    }

    return this.prisma.scene.findMany({
      where: { projectId },
      orderBy: { order: 'asc' },
      include: {
        project: true,
      },
    });
  }

  async getSceneById(sceneId: string, userId: string) {
    const scene = await this.prisma.scene.findUnique({
      where: { id: sceneId },
      include: {
        project: true,
      },
    });

    if (!scene || scene.project.userId !== userId) {
      throw new Error('Scene not found or access denied');
    }

    return scene;
  }

  async updateScene(
    sceneId: string,
    userId: string,
    data: {
      title?: string;
      prompt?: string;
      imageUrl?: string;
      videoUrl?: string;
      thumbnail?: string;
      duration?: number;
      status?: string;
      metadata?: any;
    }
  ) {
    const scene = await this.getSceneById(sceneId, userId);

    return this.prisma.scene.update({
      where: { id: sceneId },
      data: {
        ...data,
        updatedAt: new Date(),
      },
      include: {
        project: true,
      },
    });
  }

  async deleteScene(sceneId: string, userId: string) {
    const scene = await this.getSceneById(sceneId, userId);

    return this.prisma.scene.delete({
      where: { id: sceneId },
    });
  }

  async reorderScenes(projectId: string, userId: string, sceneOrders: { sceneId: string; order: number }[]) {
    // Verify user owns the project
    const project = await this.prisma.project.findFirst({
      where: { id: projectId, userId },
    });

    if (!project) {
      throw new Error('Project not found or access denied');
    }

    // Update all scenes with new order
    const updatePromises = sceneOrders.map(({ sceneId, order }) =>
      this.prisma.scene.update({
        where: { id: sceneId },
        data: { order },
      })
    );

    await Promise.all(updatePromises);

    // Return updated scenes
    return this.getProjectScenes(projectId, userId);
  }

  async getSceneStats(projectId: string, userId: string) {
    const project = await this.prisma.project.findFirst({
      where: { id: projectId, userId },
    });

    if (!project) {
      throw new Error('Project not found or access denied');
    }

    const scenes = await this.prisma.scene.findMany({
      where: { projectId },
      select: {
        status: true,
        duration: true,
      },
    });

    const stats = {
      totalScenes: scenes.length,
      completedScenes: scenes.filter(s => s.status === 'completed').length,
      pendingScenes: scenes.filter(s => s.status === 'pending').length,
      processingScenes: scenes.filter(s => s.status === 'processing').length,
      failedScenes: scenes.filter(s => s.status === 'failed').length,
      totalDuration: scenes.reduce((sum, scene) => sum + (scene.duration || 0), 0),
    };

    return stats;
  }
}
