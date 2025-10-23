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
import { CharactersService } from './characters.service';
import { ClerkAuthGuard } from '../auth/clerk-auth.guard';

@Controller('characters')
@UseGuards(ClerkAuthGuard)
export class CharactersController {
  constructor(private charactersService: CharactersService) {}

  @Post()
  async createCharacter(
    @Body() body: { 
      name: string; 
      description?: string; 
      imageUrl?: string; 
      projectId?: string 
    },
    @Request() req: any
  ) {
    const userId = req.user.sub; // Clerk user ID
    return this.charactersService.createCharacter(
      userId,
      body.name,
      body.description,
      body.imageUrl,
      body.projectId
    );
  }

  @Get()
  async getUserCharacters(@Request() req: any) {
    const userId = req.user.sub; // Clerk user ID
    return this.charactersService.getUserCharacters(userId);
  }

  @Get('project/:projectId')
  async getProjectCharacters(@Param('projectId') projectId: string, @Request() req: any) {
    const userId = req.user.sub; // Clerk user ID
    return this.charactersService.getProjectCharacters(projectId, userId);
  }

  @Get(':id')
  async getCharacter(@Param('id') characterId: string, @Request() req: any) {
    const userId = req.user.sub; // Clerk user ID
    return this.charactersService.getCharacterById(characterId, userId);
  }

  @Put(':id')
  async updateCharacter(
    @Param('id') characterId: string,
    @Body() body: {
      name?: string;
      description?: string;
      imageUrl?: string;
      isLocked?: boolean;
      embedding?: any;
    },
    @Request() req: any
  ) {
    const userId = req.user.sub; // Clerk user ID
    return this.charactersService.updateCharacter(characterId, userId, body);
  }

  @Delete(':id')
  async deleteCharacter(@Param('id') characterId: string, @Request() req: any) {
    const userId = req.user.sub; // Clerk user ID
    return this.charactersService.deleteCharacter(characterId, userId);
  }

  @Put(':id/lock')
  async lockCharacter(@Param('id') characterId: string, @Request() req: any) {
    const userId = req.user.sub; // Clerk user ID
    return this.charactersService.lockCharacter(characterId, userId);
  }

  @Put(':id/unlock')
  async unlockCharacter(@Param('id') characterId: string, @Request() req: any) {
    const userId = req.user.sub; // Clerk user ID
    return this.charactersService.unlockCharacter(characterId, userId);
  }

  @Get(':id/embedding')
  async getCharacterEmbedding(@Param('id') characterId: string, @Request() req: any) {
    const userId = req.user.sub; // Clerk user ID
    return this.charactersService.getCharacterEmbedding(characterId, userId);
  }

  @Post(':id/generate-prompt')
  async generateCharacterPrompt(
    @Param('id') characterId: string,
    @Body() body: { scenePrompt: string },
    @Request() req: any
  ) {
    const userId = req.user.sub; // Clerk user ID
    return this.charactersService.generateCharacterPrompt(
      characterId,
      body.scenePrompt,
      userId
    );
  }

  @Get(':id/stats')
  async getCharacterStats(@Param('id') characterId: string, @Request() req: any) {
    const userId = req.user.sub; // Clerk user ID
    return this.charactersService.getCharacterUsageStats(characterId, userId);
  }
}
