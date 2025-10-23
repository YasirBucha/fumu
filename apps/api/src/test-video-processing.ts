import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { VideoService } from './modules/video/video.service';
import { PrismaService } from './prisma/prisma.service';

async function testVideoProcessing() {
  console.log('🎬 Testing Video Processing System...');
  
  try {
    // Create NestJS application context
    const app = await NestFactory.createApplicationContext(AppModule);
    
    // Get services
    const videoService = app.get(VideoService);
    const prisma = app.get(PrismaService);
    
    console.log('✅ Services initialized');
    
    // Test FFmpeg availability
    console.log('🔍 Testing FFmpeg availability...');
    const ffmpegTest = await videoService.testFFmpeg();
    console.log(`FFmpeg test result: ${ffmpegTest}`);
    
    // Get a sample project with scenes
    const projects = await prisma.project.findMany({
      include: {
        scenes: true,
      },
      take: 1,
    });
    
    if (projects.length === 0) {
      console.log('❌ No projects found. Please create a project with scenes first.');
      await app.close();
      return;
    }
    
    const project = projects[0];
    console.log(`📁 Testing with project: ${project.title}`);
    console.log(`🎞️ Project has ${project.scenes.length} scenes`);
    
    if (project.scenes.length === 0) {
      console.log('❌ No scenes found in project. Please add scenes first.');
      await app.close();
      return;
    }
    
    // Test video composition
    console.log('🎥 Testing video composition...');
    const result = await videoService.composeMovie(project.id, project.userId, {
      resolution: '720p',
      quality: 'medium',
      format: 'mp4',
      transitions: {
        type: 'fade',
        duration: 1,
      },
    });
    
    console.log('📊 Video composition result:', result);
    
    if (result.success) {
      console.log('✅ Video processing test completed successfully!');
      console.log(`🎬 Generated video: ${result.videoUrl}`);
    } else {
      console.log('❌ Video processing test failed:', result.error);
    }
    
    // Test queue status (if available)
    console.log('📋 Video processing test completed');
    
    await app.close();
    console.log('🏁 Video processing test completed');
    
  } catch (error) {
    console.error('❌ Video processing test failed:', error);
  }
}

// Run the test
testVideoProcessing();
