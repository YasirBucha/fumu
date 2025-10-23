import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CharactersService {
  constructor(private prisma: PrismaService) {}

  async createCharacter(
    userId: string,
    name: string,
    description?: string,
    imageUrl?: string,
    projectId?: string
  ) {
    // Generate a unique seed for character consistency
    const seed = this.generateCharacterSeed(name, description);

    return this.prisma.character.create({
      data: {
        name,
        description,
        seed,
        imageUrl,
        userId,
        projectId,
        isLocked: false,
        embedding: {
          seed,
          name,
          description,
          imageUrl,
          createdAt: new Date().toISOString(),
        },
      },
      include: {
        project: true,
      },
    });
  }

  async getUserCharacters(userId: string) {
    return this.prisma.character.findMany({
      where: { userId },
      include: {
        project: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getProjectCharacters(projectId: string, userId: string) {
    // Verify user owns the project
    const project = await this.prisma.project.findFirst({
      where: { id: projectId, userId },
    });

    if (!project) {
      throw new Error('Project not found or access denied');
    }

    return this.prisma.character.findMany({
      where: { 
        OR: [
          { projectId },
          { projectId: null, userId }, // Global characters
        ],
      },
      include: {
        project: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getCharacterById(characterId: string, userId: string) {
    const character = await this.prisma.character.findUnique({
      where: { id: characterId },
      include: {
        project: true,
      },
    });

    if (!character || character.userId !== userId) {
      throw new Error('Character not found or access denied');
    }

    return character;
  }

  async updateCharacter(
    characterId: string,
    userId: string,
    data: {
      name?: string;
      description?: string;
      imageUrl?: string;
      isLocked?: boolean;
      embedding?: any;
    }
  ) {
    const character = await this.getCharacterById(characterId, userId);

    // If updating name or description, regenerate seed
    let updatedData = { ...data };
    if (data.name || data.description) {
      const newSeed = this.generateCharacterSeed(
        data.name || character.name,
        data.description || character.description
      );
      updatedData.seed = newSeed;
      updatedData.embedding = {
        ...character.embedding,
        seed: newSeed,
        name: data.name || character.name,
        description: data.description || character.description,
        updatedAt: new Date().toISOString(),
      };
    }

    return this.prisma.character.update({
      where: { id: characterId },
      data: {
        ...updatedData,
        updatedAt: new Date(),
      },
      include: {
        project: true,
      },
    });
  }

  async deleteCharacter(characterId: string, userId: string) {
    const character = await this.getCharacterById(characterId, userId);

    return this.prisma.character.delete({
      where: { id: characterId },
    });
  }

  async lockCharacter(characterId: string, userId: string) {
    const character = await this.getCharacterById(characterId, userId);

    return this.prisma.character.update({
      where: { id: characterId },
      data: { 
        isLocked: true,
        updatedAt: new Date(),
      },
      include: {
        project: true,
      },
    });
  }

  async unlockCharacter(characterId: string, userId: string) {
    const character = await this.getCharacterById(characterId, userId);

    return this.prisma.character.update({
      where: { id: characterId },
      data: { 
        isLocked: false,
        updatedAt: new Date(),
      },
      include: {
        project: true,
      },
    });
  }

  async getCharacterEmbedding(characterId: string, userId: string) {
    const character = await this.getCharacterById(characterId, userId);
    return character.embedding;
  }

  async generateCharacterPrompt(characterId: string, scenePrompt: string, userId: string) {
    const character = await this.getCharacterById(characterId, userId);
    
    // Create a consistent character prompt that can be used across scenes
    const characterPrompt = this.buildCharacterPrompt(character, scenePrompt);
    
    return {
      characterPrompt,
      characterSeed: character.seed,
      characterName: character.name,
      embedding: character.embedding,
    };
  }

  private generateCharacterSeed(name: string, description?: string): string {
    // Create a deterministic seed based on character attributes
    const seedData = `${name}-${description || ''}-${Date.now()}`;
    return Buffer.from(seedData).toString('base64').substring(0, 16);
  }

  private buildCharacterPrompt(character: any, scenePrompt: string): string {
    const characterDescription = character.description || '';
    const characterName = character.name;
    
    // Build a consistent character prompt that includes character details
    let characterPrompt = `Character: ${characterName}`;
    
    if (characterDescription) {
      characterPrompt += `, ${characterDescription}`;
    }
    
    // Add character consistency instructions
    characterPrompt += `. Maintain consistent appearance, clothing, and style. `;
    characterPrompt += `Scene: ${scenePrompt}`;
    
    return characterPrompt;
  }

  async getCharacterUsageStats(characterId: string, userId: string) {
    const character = await this.getCharacterById(characterId, userId);
    
    // Count scenes that use this character
    const scenes = await this.prisma.scene.findMany({
      where: {
        metadata: {
          path: ['characterId'],
          equals: characterId,
        },
      },
      include: {
        project: true,
      },
    });

    return {
      characterId,
      characterName: character.name,
      totalScenes: scenes.length,
      projects: [...new Set(scenes.map(s => s.project.title))],
      lastUsed: scenes.length > 0 ? Math.max(...scenes.map(s => new Date(s.createdAt).getTime())) : null,
    };
  }
}
