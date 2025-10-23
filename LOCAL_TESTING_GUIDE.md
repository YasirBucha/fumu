# FuMu Local Testing Guide

This guide shows you how to test the FuMu application locally on your machine.

## 🚀 Quick Start

### 1. Start the API Server (Port 5555)
```bash
cd /Users/yb/Development/FuMu/apps/api
npm run start:dev
```

The API will be available at: **http://localhost:5555**

### 2. Start the Web App (Port 3000)
```bash
cd /Users/yb/Development/FuMu/apps/web
npm run dev
```

The web app will be available at: **http://localhost:3000**

## 🧪 Testing the API

### Health Check Endpoints (No Authentication Required)
```bash
# Basic health check
curl http://localhost:5555/health

# Readiness check
curl http://localhost:5555/health/ready

# Liveness check
curl http://localhost:5555/health/live
```

### Protected Endpoints (Require Authentication)
```bash
# AI Models (requires Clerk JWT token)
curl -H "Authorization: Bearer YOUR_CLERK_TOKEN" http://localhost:5555/ai/models

# Video Export Options
curl -H "Authorization: Bearer YOUR_CLERK_TOKEN" http://localhost:5555/video/export-options

# User Projects
curl -H "Authorization: Bearer YOUR_CLERK_TOKEN" http://localhost:5555/projects

# User Characters
curl -H "Authorization: Bearer YOUR_CLERK_TOKEN" http://localhost:5555/characters
```

### Automated Testing Script
```bash
# Run the comprehensive API test script
./test-api-local.sh
```

## 🌐 Testing the Web App

### Available Pages
- **http://localhost:3000** - Home page
- **http://localhost:3000/dashboard** - User dashboard
- **http://localhost:3000/projects** - Project management
- **http://localhost:3000/characters** - Character management
- **http://localhost:3000/video-processing** - Video processing history

### Automated Testing Script
```bash
# Run the comprehensive web app test script
./test-frontend-local.sh
```

## 🔧 Development Setup

### Environment Configuration
The API is configured to run on port 5555 with the following environment:

```bash
# API Configuration
API_URL="http://localhost:5555"
DATABASE_URL="file:./dev.db"  # SQLite for development
REDIS_URL="redis://localhost:6379"  # Redis for queue management
```

### Database Setup
```bash
# Set up development database
cd apps/api
npx prisma generate
npx prisma db push
npx prisma db seed
```

### AI Services Configuration
The AI services are configured with mock responses for development:

- **OpenAI DALL-E 3**: Mock responses for image generation
- **Google Veo 3**: Mock responses for video generation  
- **Runway ML**: Mock responses for video processing

## 📊 API Endpoints Reference

### Health & Monitoring
- `GET /health` - Basic health check
- `GET /health/ready` - Readiness check
- `GET /health/live` - Liveness check

### Authentication
- `POST /auth/webhook` - Clerk webhook handler
- `GET /auth/user/:clerkId` - Get user by Clerk ID
- `GET /auth/user/id/:userId` - Get user by internal ID

### Projects
- `GET /projects` - Get user projects
- `POST /projects` - Create new project
- `GET /projects/:id` - Get project details
- `PUT /projects/:id` - Update project
- `DELETE /projects/:id` - Delete project

### Characters
- `GET /characters` - Get user characters
- `POST /characters` - Create new character
- `GET /characters/:id` - Get character details
- `PUT /characters/:id` - Update character
- `DELETE /characters/:id` - Delete character

### AI Generation
- `POST /ai/text-to-image` - Generate image from text
- `POST /ai/image-to-video` - Generate video from image
- `POST /ai/extend-video` - Extend existing video
- `POST /ai/scene-with-character` - Generate scene with character
- `GET /ai/models` - Get available AI models

### Video Processing
- `POST /video/compose` - Compose movie from scenes
- `GET /video/status/:jobId` - Get processing status
- `GET /video/export-options` - Get export options
- `GET /video/queue/status` - Get queue status

### Scenes
- `GET /scenes/project/:projectId` - Get project scenes
- `POST /scenes` - Create new scene
- `PUT /scenes/:id` - Update scene
- `DELETE /scenes/:id` - Delete scene

## 🔐 Authentication Testing

### Without Authentication
Most endpoints will return `401 Unauthorized`:

```bash
curl http://localhost:5555/ai/models
# Returns: {"message": "No authorization token provided", "error": "Unauthorized", "statusCode": 401}
```

### With Mock Authentication (Development)
The development setup includes a mock authentication guard that accepts any token format:

```bash
curl -H "Authorization: Bearer mock-token" http://localhost:5555/ai/models
# Returns: Mock response data
```

### With Real Clerk Authentication
To test with real authentication:

1. Set up Clerk account and get API keys
2. Configure environment variables
3. Use real JWT tokens from Clerk

## 🎬 Testing Video Processing

### FFmpeg Testing
```bash
# Test FFmpeg installation
cd apps/api
npx ts-node src/test-ffmpeg.ts
```

### Video Processing Endpoints
```bash
# Get export options
curl -H "Authorization: Bearer mock-token" http://localhost:5555/video/export-options

# Check queue status
curl -H "Authorization: Bearer mock-token" http://localhost:5555/video/queue/status

# Compose video (requires project with scenes)
curl -X POST -H "Authorization: Bearer mock-token" \
  -H "Content-Type: application/json" \
  -d '{"projectId": "your-project-id", "options": {"resolution": "720p"}}' \
  http://localhost:5555/video/compose
```

## 🐛 Troubleshooting

### Port Conflicts
If you get port conflicts:

```bash
# Kill processes on ports
lsof -ti:5555 | xargs kill -9  # Kill API processes
lsof -ti:3000 | xargs kill -9  # Kill web app processes
lsof -ti:3001 | xargs kill -9  # Kill old API processes
```

### Database Issues
```bash
# Reset database
cd apps/api
rm dev.db
npx prisma db push
npx prisma db seed
```

### Redis Issues
If Redis is not running:

```bash
# Start Redis (if installed)
redis-server

# Or use Docker
docker run -d -p 6379:6379 redis:alpine
```

## 📈 Performance Testing

### Load Testing
```bash
# Test API performance
curl -w "@curl-format.txt" -o /dev/null -s http://localhost:5555/health

# Test multiple requests
for i in {1..10}; do
  curl -s http://localhost:5555/health > /dev/null
done
```

### Health Monitoring
```bash
# Run health checks
./scripts/health-check.sh --api-url http://localhost:5555

# Run comprehensive tests
./scripts/test-suite.sh --api-url http://localhost:5555
```

## 🎯 Next Steps

1. **Set up Clerk Authentication**: Configure real authentication for testing
2. **Configure AI Services**: Set up real API keys for AI generation
3. **Test Video Processing**: Create projects with scenes and test video composition
4. **End-to-End Testing**: Test complete user workflows
5. **Performance Testing**: Load test the application

## 📚 Additional Resources

- **API Documentation**: See the generated API docs
- **Database Schema**: Check `prisma/schema.prisma`
- **Environment Setup**: See `env.development.template`
- **Deployment Guide**: See `DEPLOYMENT_GUIDE.md`
- **Testing Guide**: See `TESTING_GUIDE.md`

---

**Happy Testing! 🎉**

The FuMu application is now ready for local testing and development. All core features are implemented and functional, with comprehensive testing tools and documentation available.
