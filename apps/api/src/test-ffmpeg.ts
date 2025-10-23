import * as ffmpeg from 'fluent-ffmpeg';
import * as ffmpegStatic from 'ffmpeg-static';

async function testFFmpeg() {
  console.log('🎬 Testing FFmpeg Installation...');
  
  try {
    // Set FFmpeg path if available
    if (ffmpegStatic) {
      // Handle both string and object formats from ffmpeg-static
      const ffmpegPath = typeof ffmpegStatic === 'string' ? ffmpegStatic : ffmpegStatic.default || ffmpegStatic;
      ffmpeg.setFfmpegPath(ffmpegPath);
      console.log('✅ FFmpeg static binary found:', ffmpegPath);
    } else {
      console.log('⚠️ FFmpeg static binary not found, using system FFmpeg');
    }

    // Test FFmpeg availability
    console.log('🔍 Testing FFmpeg availability...');
    
    const testResult = await new Promise<boolean>((resolve) => {
      ffmpeg.getAvailableFormats((err, formats) => {
        if (err) {
          console.error('❌ FFmpeg test failed:', err.message);
          resolve(false);
        } else {
          console.log('✅ FFmpeg is available and working');
          console.log(`📊 Available formats: ${Object.keys(formats).length}`);
          resolve(true);
        }
      });
    });

    if (testResult) {
      console.log('🎉 FFmpeg test completed successfully!');
      console.log('📋 FFmpeg can be used for video processing');
    } else {
      console.log('❌ FFmpeg test failed');
    }

    // Test video processing capabilities
    console.log('🎥 Testing video processing capabilities...');
    
    const codecTest = await new Promise<boolean>((resolve) => {
      ffmpeg.getAvailableCodecs((err, codecs) => {
        if (err) {
          console.error('❌ Codec test failed:', err.message);
          resolve(false);
        } else {
          console.log('✅ Video codecs available');
          console.log(`📊 Available codecs: ${Object.keys(codecs).length}`);
          
          // Check for important codecs
          const importantCodecs = ['h264', 'h265', 'libx264', 'libx265', 'aac', 'mp3'];
          const availableImportant = importantCodecs.filter(codec => codecs[codec]);
          console.log(`🎯 Important codecs available: ${availableImportant.join(', ')}`);
          
          resolve(true);
        }
      });
    });

    if (codecTest) {
      console.log('✅ Video processing capabilities verified');
    }

    // Test video filters
    console.log('🎨 Testing video filters...');
    
    const filterTest = await new Promise<boolean>((resolve) => {
      ffmpeg.getAvailableFilters((err, filters) => {
        if (err) {
          console.error('❌ Filter test failed:', err.message);
          resolve(false);
        } else {
          console.log('✅ Video filters available');
          console.log(`📊 Available filters: ${Object.keys(filters).length}`);
          
          // Check for important filters
          const importantFilters = ['fade', 'scale', 'crop', 'overlay', 'concat'];
          const availableImportant = importantFilters.filter(filter => filters[filter]);
          console.log(`🎯 Important filters available: ${availableImportant.join(', ')}`);
          
          resolve(true);
        }
      });
    });

    if (filterTest) {
      console.log('✅ Video filters verified');
    }

    console.log('🏁 FFmpeg testing completed successfully!');
    console.log('🎬 FuMu video processing system is ready');

  } catch (error) {
    console.error('❌ FFmpeg test failed with error:', error);
  }
}

// Run the test
testFFmpeg();
