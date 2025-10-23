# AI Services Setup Guide

This guide will help you configure the AI services for the FuMu application.

## Required API Keys

### 1. OpenAI API Key
- **Service**: Text-to-image generation (DALL-E 3)
- **Get API Key**: Visit [OpenAI Platform](https://platform.openai.com/api-keys)
- **Cost**: Pay-per-use (typically $0.040 per image for DALL-E 3)
- **Usage**: Character-consistent image generation

### 2. Google Veo 3 API Key
- **Service**: Video generation from images
- **Get API Key**: Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
- **Cost**: Pay-per-use (pricing varies)
- **Usage**: High-quality video generation

### 3. Runway ML API Key
- **Service**: Video generation and extension
- **Get API Key**: Visit [Runway ML API](https://runwayml.com/api)
- **Cost**: Subscription-based with usage limits
- **Usage**: Advanced video processing and extension

## Environment Configuration

### Development Environment
Create a `.env.development` file in the `apps/api` directory:

```bash
# Database
DATABASE_URL="file:./dev.db"

# Redis
REDIS_URL="redis://localhost:6379"

# Clerk Authentication
CLERK_SECRET_KEY="your_clerk_secret_key"
CLERK_WEBHOOK_SECRET="your_clerk_webhook_secret"

# AI Services
OPENAI_API_KEY="your_openai_api_key"
GOOGLE_API_KEY="your_google_veo_api_key"
RUNWAY_API_KEY="your_runway_api_key"

# AWS S3 (for file storage)
AWS_S3_BUCKET_NAME="your_bucket_name"
AWS_REGION="us-east-1"
AWS_ACCESS_KEY_ID="your_access_key"
AWS_SECRET_ACCESS_KEY="your_secret_key"

# Application URLs
API_URL="http://localhost:3001"
WEB_URL="http://localhost:3000"
```

### Production Environment
Create a `.env.production` file in the `apps/api` directory:

```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/fumu_production"

# Redis
REDIS_URL="redis://localhost:6379"

# Clerk Authentication
CLERK_SECRET_KEY="your_production_clerk_secret_key"
CLERK_WEBHOOK_SECRET="your_production_clerk_webhook_secret"

# AI Services
OPENAI_API_KEY="your_production_openai_api_key"
GOOGLE_API_KEY="your_production_google_veo_api_key"
RUNWAY_API_KEY="your_production_runway_api_key"

# AWS S3
AWS_S3_BUCKET_NAME="your_production_bucket_name"
AWS_REGION="us-east-1"
AWS_ACCESS_KEY_ID="your_production_access_key"
AWS_SECRET_ACCESS_KEY="your_production_secret_key"

# Application URLs
API_URL="https://api.fumu.app"
WEB_URL="https://fumu.app"
```

## Testing AI Services

### 1. Test OpenAI Service
```bash
cd apps/api
curl -X POST http://localhost:3001/ai/text-to-image \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_test_token" \
  -d '{
    "prompt": "A magical forest with glowing trees",
    "resolution": "1024x1024",
    "quality": "standard"
  }'
```

### 2. Test Runway Service
```bash
curl -X POST http://localhost:3001/ai/image-to-video \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_test_token" \
  -d '{
    "imageUrl": "https://example.com/image.jpg",
    "prompt": "The forest comes to life with gentle movement",
    "duration": 4
  }'
```

### 3. Test Google Veo Service
```bash
curl -X POST http://localhost:3001/ai/image-to-video \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_test_token" \
  -d '{
    "imageUrl": "https://example.com/image.jpg",
    "prompt": "The forest comes to life with gentle movement",
    "model": "google-veo",
    "duration": 5
  }'
```

## Service Configuration

### OpenAI Service
- **Model**: DALL-E 3
- **Supported Sizes**: 1024x1024, 1024x1792, 1792x1024
- **Quality Options**: standard, hd
- **Rate Limits**: Based on your OpenAI plan

### Google Veo Service
- **Model**: Veo 3
- **Duration**: Up to 5 seconds
- **Resolution**: 1280x720 (HD)
- **Rate Limits**: Based on your Google Cloud quota

### Runway Service
- **Model**: Gen-3
- **Duration**: Up to 4 seconds
- **Resolution**: 1280x768
- **Rate Limits**: Based on your Runway subscription

## Character Consistency

The AI services are configured to maintain character consistency across scenes:

1. **Character Embedding**: Each character has a unique seed and embedding
2. **Prompt Enhancement**: Character information is automatically added to prompts
3. **Seed Preservation**: Character seeds are maintained across generations
4. **Cross-Scene Consistency**: Characters maintain appearance across different scenes

## Monitoring and Debugging

### Health Check
```bash
curl http://localhost:3001/health
```

### AI Service Status
```bash
curl http://localhost:3001/ai/models
```

### Generation History
```bash
curl -H "Authorization: Bearer your_token" http://localhost:3001/ai/history
```

## Troubleshooting

### Common Issues

1. **API Key Not Found**
   - Ensure environment variables are set correctly
   - Check for typos in variable names
   - Verify the API key is valid and active

2. **Rate Limit Exceeded**
   - Check your API usage quotas
   - Implement exponential backoff
   - Consider upgrading your subscription

3. **Generation Failures**
   - Check the error logs in the API
   - Verify input parameters
   - Test with simpler prompts first

4. **Character Consistency Issues**
   - Ensure character seeds are properly generated
   - Check that character information is included in prompts
   - Verify embedding data is correctly stored

### Logs and Monitoring

- **API Logs**: Check the NestJS application logs
- **Database Logs**: Monitor Prisma query logs
- **Queue Logs**: Check BullMQ processing logs
- **Error Tracking**: Monitor failed generation jobs

## Cost Optimization

1. **Prompt Optimization**: Use concise, clear prompts
2. **Image Resolution**: Choose appropriate resolution for use case
3. **Video Duration**: Keep videos as short as needed
4. **Caching**: Cache generated content when possible
5. **Batch Processing**: Process multiple requests together

## Security Considerations

1. **API Key Protection**: Never commit API keys to version control
2. **Rate Limiting**: Implement rate limiting to prevent abuse
3. **Input Validation**: Validate all user inputs
4. **Content Filtering**: Implement content moderation
5. **Access Control**: Use proper authentication and authorization

## Next Steps

1. Configure your API keys in the environment files
2. Test each AI service individually
3. Create test characters and scenes
4. Monitor generation performance
5. Set up proper error handling and logging
6. Configure production monitoring and alerting