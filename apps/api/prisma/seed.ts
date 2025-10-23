import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create AI Models
  console.log('Creating AI models...');
  
  const openaiModel = await prisma.aIModel.upsert({
    where: { name: 'openai-dalle-3' },
    update: {},
    create: {
      name: 'openai-dalle-3',
      provider: 'openai',
      type: 'text-to-image',
      endpoint: 'https://api.openai.com/v1/images/generations',
      isActive: true,
    },
  });

  const runwayModel = await prisma.aIModel.upsert({
    where: { name: 'runway-gen3' },
    update: {},
    create: {
      name: 'runway-gen3',
      provider: 'runway',
      type: 'image-to-video',
      endpoint: 'https://api.runwayml.com/v1/image_to_video',
      isActive: true,
    },
  });

  const googleVeoModel = await prisma.aIModel.upsert({
    where: { name: 'google-veo-3' },
    update: {},
    create: {
      name: 'google-veo-3',
      provider: 'google',
      type: 'text-to-video',
      endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/veo-3:generateVideo',
      isActive: true,
    },
  });

  console.log('✅ AI models created');

  // Create sample user (for development)
  console.log('Creating sample user...');
  
  const sampleUser = await prisma.user.upsert({
    where: { email: 'demo@fumu.app' },
    update: {},
    create: {
      email: 'demo@fumu.app',
      name: 'Demo User',
      provider: 'email',
      subscription: 'pro',
    },
  });

  console.log('✅ Sample user created');

  // Create sample project
  console.log('Creating sample project...');
  
  const sampleProject = await prisma.project.upsert({
    where: { id: 'sample-project-1' },
    update: {},
    create: {
      id: 'sample-project-1',
      title: 'My First AI Movie',
      description: 'A sample project to demonstrate FuMu capabilities',
      userId: sampleUser.id,
    },
  });

  console.log('✅ Sample project created');

  // Create sample character
  console.log('Creating sample character...');
  
  const sampleCharacter = await prisma.character.upsert({
    where: { id: 'sample-character-1' },
    update: {},
    create: {
      id: 'sample-character-1',
      name: 'Alex',
      description: 'A friendly, adventurous protagonist with short brown hair and bright blue eyes',
      projectId: sampleProject.id,
      userId: sampleUser.id,
      seed: 'alex-protagonist-001',
    },
  });

  console.log('✅ Sample character created');

  // Create sample scenes
  console.log('Creating sample scenes...');
  
  const scene1 = await prisma.scene.upsert({
    where: { id: 'sample-scene-1' },
    update: {},
    create: {
      id: 'sample-scene-1',
      projectId: sampleProject.id,
      order: 1,
      prompt: 'Alex walking through a magical forest, sunlight filtering through the trees',
      status: 'completed',
      aiModel: 'openai-dalle-3',
      metadata: {
        characterId: sampleCharacter.id,
        characterName: sampleCharacter.name,
      },
    },
  });

  const scene2 = await prisma.scene.upsert({
    where: { id: 'sample-scene-2' },
    update: {},
    create: {
      id: 'sample-scene-2',
      projectId: sampleProject.id,
      order: 2,
      prompt: 'Alex discovering a hidden cave entrance with glowing crystals',
      status: 'completed',
      aiModel: 'openai-dalle-3',
      metadata: {
        characterId: sampleCharacter.id,
        characterName: sampleCharacter.name,
      },
    },
  });

  const scene3 = await prisma.scene.upsert({
    where: { id: 'sample-scene-3' },
    update: {},
    create: {
      id: 'sample-scene-3',
      projectId: sampleProject.id,
      order: 3,
      prompt: 'Alex entering the cave and seeing a magnificent crystal chamber',
      status: 'pending',
      aiModel: 'openai-dalle-3',
      metadata: {
        characterId: sampleCharacter.id,
        characterName: sampleCharacter.name,
      },
    },
  });

  console.log('✅ Sample scenes created');

  // Create sample generation jobs
  console.log('Creating sample generation jobs...');
  
  await prisma.generationJob.upsert({
    where: { id: 'sample-job-1' },
    update: {},
    create: {
      id: 'sample-job-1',
      userId: sampleUser.id,
      type: 'image',
      status: 'completed',
      input: {
        prompt: 'Alex walking through a magical forest',
        characterId: sampleCharacter.id,
        model: 'openai-dalle-3',
      },
      output: {
        imageUrl: 'https://example.com/sample-image-1.jpg',
        generationTime: 15.5,
      },
      startedAt: new Date(Date.now() - 3600000), // 1 hour ago
      completedAt: new Date(Date.now() - 3595000), // 1 hour ago + 5 seconds
    },
  });

  await prisma.generationJob.upsert({
    where: { id: 'sample-job-2' },
    update: {},
    create: {
      id: 'sample-job-2',
      userId: sampleUser.id,
      type: 'video',
      status: 'processing',
      input: {
        projectId: sampleProject.id,
        options: {
          resolution: '1920x1080',
          quality: 'high',
          format: 'mp4',
        },
      },
      startedAt: new Date(Date.now() - 300000), // 5 minutes ago
    },
  });

  console.log('✅ Sample generation jobs created');

  console.log('🎬 Database seeding completed!');
  console.log('');
  console.log('Sample data created:');
  console.log('  - User: demo@fumu.app');
  console.log('  - Project: My First AI Movie');
  console.log('  - Character: Alex');
  console.log('  - Scenes: 3 scenes (2 completed, 1 pending)');
  console.log('  - AI Models: OpenAI DALL-E 3, Runway Gen3, Google Veo 3');
  console.log('  - Generation Jobs: 2 jobs (1 completed, 1 processing)');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
