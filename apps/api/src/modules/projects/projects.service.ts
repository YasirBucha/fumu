import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ProjectsService {
    constructor(private prisma: PrismaService) { }

    async createProject(userId: string, title: string, description?: string) {
        return this.prisma.project.create({
            data: {
                title,
                description,
                userId,
            },
            include: {
                scenes: true,
                characters: true,
            },
        });
    }

    async getUserProjects(userId: string) {
        return this.prisma.project.findMany({
            where: { userId },
            include: {
                scenes: true,
                characters: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async getProjectById(projectId: string, userId: string) {
        return this.prisma.project.findFirst({
            where: {
                id: projectId,
                userId,
            },
            include: {
                scenes: {
                    orderBy: { order: 'asc' },
                },
                characters: true,
            },
        });
    }

    async updateProject(projectId: string, userId: string, data: any) {
        return this.prisma.project.updateMany({
            where: {
                id: projectId,
                userId,
            },
            data,
        });
    }

    async deleteProject(projectId: string, userId: string) {
        return this.prisma.project.deleteMany({
            where: {
                id: projectId,
                userId,
            },
        });
    }
}
