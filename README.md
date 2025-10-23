# FuMu - AI-Powered Auto Movie Creation App

![FuMu Logo](https://via.placeholder.com/400x100/0066FF/FFFFFF?text=FuMu)

> Transform your creative ideas into cinematic masterpieces with AI-powered video generation

## 🌟 Overview

FuMu is an innovative platform that enables users to create complete cinematic movies scene-by-scene using advanced AI generation models. From text prompts to professional-quality videos, FuMu makes movie creation accessible to everyone.

### Key Features

- 🎬 **Scene-by-Scene Creation**: Build your movie one scene at a time
- 🤖 **AI-Powered Generation**: Leverage SORA, Google Veo 3, Runway, and more
- 👤 **Character Consistency**: Maintain character appearance across all scenes
- 🎨 **Seamless Extension**: Continue your story with video extension
- 📱 **Cross-Platform**: Web-first with mobile apps coming soon
- 🎵 **Professional Export**: High-quality video output with background music

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm
- PostgreSQL database
- Redis (for job queue)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/[your-username]/fumu.git
   cd fumu
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Set up the database**
   ```bash
   pnpm db:migrate
   pnpm db:seed
   ```

5. **Start development servers**
   ```bash
   pnpm dev
   ```

## 🏗️ Project Structure

```
fumu/
├── apps/
│   ├── web/                  # Next.js web application
│   ├── mobile/               # React Native mobile app
│   └── api/                  # NestJS backend API
├── packages/
│   ├── shared/               # Shared utilities and types
│   └── ui/                   # Reusable UI components
├── prisma/                   # Database schema and migrations
├── docs/                     # Documentation
└── scripts/                  # Build and deployment scripts
```

## 🛠️ Technology Stack

- **Frontend**: Next.js 14, React 18, TypeScript, TailwindCSS
- **Mobile**: React Native, Expo SDK 52+
- **Backend**: NestJS, TypeScript, Prisma ORM
- **Database**: PostgreSQL
- **Storage**: AWS S3, CloudFront CDN
- **Queue**: Redis, BullMQ
- **Auth**: Clerk, Firebase Auth
- **Video Processing**: FFmpeg
- **Deployment**: Vercel, AWS Lambda, Expo EAS

## 📱 Supported Platforms

- ✅ **Web**: Full functionality on all modern browsers
- 🚧 **Mobile**: iOS and Android apps in development
- 🚧 **Desktop**: Electron app planned for future release

## 🎯 Core Workflow

1. **Create Project**: Start a new movie project
2. **Write Prompt**: Describe your first scene
3. **Generate Image**: AI creates visual representation
4. **Convert to Video**: Transform image into video clip
5. **Extend Story**: Continue with next scene using video extension
6. **Edit & Refine**: Modify scenes as needed
7. **Export Movie**: Combine all scenes into final video

## 🔧 Development

### Available Scripts

```bash
# Development
pnpm dev              # Start all development servers
pnpm dev:web          # Start web app only
pnpm dev:api          # Start API server only
pnpm dev:mobile       # Start mobile app only

# Database
pnpm db:migrate       # Run database migrations
pnpm db:seed          # Seed database with sample data
pnpm db:studio        # Open Prisma Studio

# Building
pnpm build            # Build all applications
pnpm build:web        # Build web app
pnpm build:api        # Build API server

# Testing
pnpm test             # Run all tests
pnpm test:web         # Run web app tests
pnpm test:api         # Run API tests

# Linting
pnpm lint             # Lint all code
pnpm lint:fix         # Fix linting issues
```

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/fumu"

# Redis
REDIS_URL="redis://localhost:6379"

# Authentication
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# AI Services
OPENAI_API_KEY="your-openai-key"
GOOGLE_API_KEY="your-google-key"
RUNWAY_API_KEY="your-runway-key"

# Storage
AWS_ACCESS_KEY_ID="your-aws-key"
AWS_SECRET_ACCESS_KEY="your-aws-secret"
AWS_S3_BUCKET="your-s3-bucket"
AWS_REGION="us-east-1"

# Other
NODE_ENV="development"
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and add tests
4. Commit your changes: `git commit -m 'Add amazing feature'`
5. Push to the branch: `git push origin feature/amazing-feature`
6. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- 📧 Email: support@fumu.app
- 💬 Discord: [Join our community](https://discord.gg/fumu)
- 📖 Documentation: [docs.fumu.app](https://docs.fumu.app)
- 🐛 Issues: [GitHub Issues](https://github.com/[your-username]/fumu/issues)

## 🗺️ Roadmap

### Phase 1: MVP (Current)
- [x] Basic web application
- [x] User authentication
- [x] Project management
- [x] AI image generation
- [x] Image-to-video conversion
- [x] Basic timeline editor
- [x] Video export functionality

### Phase 2: Enhanced Features
- [ ] Video extension capabilities
- [ ] Character consistency system
- [ ] Advanced timeline editor
- [ ] Multiple AI model support
- [ ] Background music integration
- [ ] Mobile applications

### Phase 3: Advanced Features
- [ ] AI Director Assistant
- [ ] Collaborative editing
- [ ] Advanced video effects
- [ ] Marketplace for characters and music
- [ ] API for third-party integrations

## 🙏 Acknowledgments

- OpenAI for SORA and DALL-E
- Google for Veo 3
- Runway for video generation APIs
- The open-source community for amazing tools and libraries

---

**Made with ❤️ by the FuMu Team**

*Transform your imagination into reality with AI-powered movie creation.*
