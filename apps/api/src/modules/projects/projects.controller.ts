import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ClerkAuthGuard } from '../auth/clerk-auth.guard';

@Controller('projects')
@UseGuards(ClerkAuthGuard)
export class ProjectsController {
  constructor(private projectsService: ProjectsService) {}

  @Post()
  async createProject(@Body() body: { title: string; description?: string }, @Request() req: any) {
    const userId = req.user.sub; // Clerk user ID
    return this.projectsService.createProject(userId, body.title, body.description);
  }

  @Get()
  async getUserProjects(@Request() req: any) {
    const userId = req.user.sub; // Clerk user ID
    return this.projectsService.getUserProjects(userId);
  }

  @Get(':id')
  async getProject(@Param('id') projectId: string, @Request() req: any) {
    const userId = req.user.sub; // Clerk user ID
    return this.projectsService.getProjectById(projectId, userId);
  }

  @Put(':id')
  async updateProject(
    @Param('id') projectId: string,
    @Body() body: { title?: string; description?: string },
    @Request() req: any
  ) {
    const userId = req.user.sub; // Clerk user ID
    return this.projectsService.updateProject(projectId, userId, body);
  }

  @Delete(':id')
  async deleteProject(@Param('id') projectId: string, @Request() req: any) {
    const userId = req.user.sub; // Clerk user ID
    return this.projectsService.deleteProject(projectId, userId);
  }
}
