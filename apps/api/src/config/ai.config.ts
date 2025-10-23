import { registerAs } from '@nestjs/config';

export default registerAs('ai', () => ({
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
    model: process.env.OPENAI_MODEL || 'dall-e-3',
    maxTokens: parseInt(process.env.OPENAI_MAX_TOKENS || '1000'),
    temperature: parseFloat(process.env.OPENAI_TEMPERATURE || '0.7'),
  },
  google: {
    apiKey: process.env.GOOGLE_AI_API_KEY,
    model: process.env.GOOGLE_MODEL || 'veo-3',
    projectId: process.env.GOOGLE_PROJECT_ID,
    location: process.env.GOOGLE_LOCATION || 'us-central1',
  },
  runway: {
    apiKey: process.env.RUNWAY_API_KEY,
    model: process.env.RUNWAY_MODEL || 'gen3',
    endpoint: process.env.RUNWAY_ENDPOINT || 'https://api.runwayml.com/v1',
  },
  defaults: {
    imageResolution: process.env.DEFAULT_IMAGE_RESOLUTION || '1024x1024',
    videoResolution: process.env.DEFAULT_VIDEO_RESOLUTION || '1280x720',
    videoDuration: parseInt(process.env.DEFAULT_VIDEO_DURATION || '4'),
    quality: process.env.DEFAULT_QUALITY || 'standard',
  },
  limits: {
    maxImageSize: process.env.MAX_IMAGE_SIZE || '50MB',
    maxVideoSize: process.env.MAX_VIDEO_SIZE || '500MB',
    maxVideoDuration: parseInt(process.env.MAX_VIDEO_DURATION || '300'),
    rateLimitPerMinute: parseInt(process.env.AI_RATE_LIMIT_PER_MINUTE || '10'),
  },
}));
