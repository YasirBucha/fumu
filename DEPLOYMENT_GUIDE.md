# FuMu Production Deployment Guide

This guide covers the complete deployment process for the FuMu AI-powered movie creation application.

## Deployment Architecture

### Production Stack
- **Frontend**: Next.js 14 (Vercel)
- **Backend API**: NestJS (AWS Lambda/ECS)
- **Database**: PostgreSQL (AWS RDS)
- **Queue**: Redis (AWS ElastiCache)
- **Storage**: AWS S3 + CloudFront CDN
- **Authentication**: Clerk
- **Video Processing**: FFmpeg on AWS ECS/Lambda

### Environment Overview
- **Development**: Local development with SQLite
- **Staging**: Production-like environment for testing
- **Production**: Live production environment

## Pre-Deployment Checklist

### ✅ Completed Setup
- [x] Environment configuration templates created
- [x] Database schema and migrations ready
- [x] AI services configured with mock responses
- [x] Video processing system operational
- [x] API endpoints functional
- [x] Authentication system integrated

### 🔄 In Progress
- [ ] Production environment setup
- [ ] Database deployment
- [ ] API deployment
- [ ] Frontend deployment
- [ ] Domain and SSL configuration

## Production Environment Setup

### 1. Database Setup (AWS RDS)

#### Create PostgreSQL Database
```bash
# Using AWS CLI
aws rds create-db-instance \
  --db-instance-identifier fumu-production-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --engine-version 15.4 \
  --master-username fumu_admin \
  --master-user-password "your-secure-password" \
  --allocated-storage 20 \
  --vpc-security-group-ids sg-xxxxxxxxx \
  --db-subnet-group-name fumu-subnet-group \
  --backup-retention-period 7 \
  --multi-az \
  --storage-encrypted
```

#### Database Configuration
- **Instance Class**: db.t3.micro (development) → db.t3.small (production)
- **Storage**: 20GB (development) → 100GB+ (production)
- **Backup**: 7 days retention
- **Multi-AZ**: Enabled for high availability
- **Encryption**: Enabled

### 2. Redis Setup (AWS ElastiCache)

#### Create Redis Cluster
```bash
# Using AWS CLI
aws elasticache create-cache-cluster \
  --cache-cluster-id fumu-redis-cluster \
  --cache-node-type cache.t3.micro \
  --engine redis \
  --num-cache-nodes 1 \
  --vpc-security-group-ids sg-xxxxxxxxx \
  --cache-subnet-group-name fumu-cache-subnet-group
```

### 3. Storage Setup (AWS S3)

#### Create S3 Bucket
```bash
# Create bucket for file storage
aws s3 mb s3://fumu-production-storage --region us-east-1

# Enable versioning
aws s3api put-bucket-versioning \
  --bucket fumu-production-storage \
  --versioning-configuration Status=Enabled

# Configure CORS
aws s3api put-bucket-cors \
  --bucket fumu-production-storage \
  --cors-configuration file://cors-config.json
```

#### CORS Configuration
```json
{
  "CORSRules": [
    {
      "AllowedHeaders": ["*"],
      "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
      "AllowedOrigins": ["https://fumu.app", "https://www.fumu.app"],
      "ExposeHeaders": ["ETag"],
      "MaxAgeSeconds": 3000
    }
  ]
}
```

### 4. CloudFront CDN Setup

#### Create CloudFront Distribution
```bash
# Create distribution for S3 bucket
aws cloudfront create-distribution \
  --distribution-config file://cloudfront-config.json
```

## API Deployment

### 1. AWS Lambda Deployment

#### Build API for Lambda
```bash
cd apps/api
npm run build:lambda
```

#### Deploy with Serverless Framework
```bash
# Install Serverless Framework
npm install -g serverless

# Deploy to AWS Lambda
serverless deploy --stage production
```

### 2. Docker Deployment (ECS)

#### Create Dockerfile for Production
```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:18-alpine AS runtime
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY . .
RUN npm run build

EXPOSE 3001
CMD ["npm", "run", "start:prod"]
```

#### Build and Push Docker Image
```bash
# Build image
docker build -t fumu-api:latest .

# Tag for ECR
docker tag fumu-api:latest 123456789012.dkr.ecr.us-east-1.amazonaws.com/fumu-api:latest

# Push to ECR
docker push 123456789012.dkr.ecr.us-east-1.amazonaws.com/fumu-api:latest
```

## Frontend Deployment

### 1. Vercel Deployment

#### Configure Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to Vercel
cd apps/web
vercel --prod
```

#### Environment Variables
```bash
# Set production environment variables
vercel env add NEXT_PUBLIC_API_URL production
vercel env add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY production
vercel env add CLERK_SECRET_KEY production
```

### 2. Custom Domain Setup
```bash
# Add custom domain
vercel domains add fumu.app
vercel domains add www.fumu.app

# Configure DNS
# Point A records to Vercel IP addresses
```

## Environment Configuration

### Production Environment Variables

#### API Environment (.env.production)
```bash
# Database
DATABASE_URL="postgresql://fumu_admin:password@fumu-production-db.xxxxxxxxx.us-east-1.rds.amazonaws.com:5432/fumu_production"

# Redis
REDIS_URL="redis://fumu-redis-cluster.xxxxxxxxx.cache.amazonaws.com:6379"

# Clerk Authentication
CLERK_SECRET_KEY="sk_live_xxxxxxxxx"
CLERK_WEBHOOK_SECRET="whsec_xxxxxxxxx"

# AI Services
OPENAI_API_KEY="sk-xxxxxxxxx"
GOOGLE_API_KEY="xxxxxxxxx"
RUNWAY_API_KEY="xxxxxxxxx"

# AWS S3
AWS_S3_BUCKET_NAME="fumu-production-storage"
AWS_REGION="us-east-1"
AWS_ACCESS_KEY_ID="AKIAXXXXXXXXX"
AWS_SECRET_ACCESS_KEY="xxxxxxxxx"

# Application URLs
API_URL="https://api.fumu.app"
WEB_URL="https://fumu.app"

# Security
JWT_SECRET="your-jwt-secret-key"
ENCRYPTION_KEY="your-encryption-key"
```

#### Frontend Environment
```bash
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_live_xxxxxxxxx"

# API
NEXT_PUBLIC_API_URL="https://api.fumu.app"

# App Configuration
NEXT_PUBLIC_APP_NAME="FuMu"
NEXT_PUBLIC_APP_URL="https://fumu.app"
```

## SSL/TLS Configuration

### 1. SSL Certificates
- **Vercel**: Automatic SSL via Let's Encrypt
- **API**: SSL via AWS Application Load Balancer
- **Custom Domain**: SSL via AWS Certificate Manager

### 2. Security Headers
```javascript
// Next.js security headers
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin'
  }
];
```

## Monitoring and Logging

### 1. Application Monitoring
- **Vercel Analytics**: Frontend performance monitoring
- **AWS CloudWatch**: API and infrastructure monitoring
- **Sentry**: Error tracking and performance monitoring

### 2. Database Monitoring
- **RDS Performance Insights**: Database performance monitoring
- **CloudWatch Metrics**: Database metrics and alerts

### 3. Logging
```javascript
// Winston logging configuration
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'fumu-api' },
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
    new winston.transports.Console()
  ]
});
```

## Health Checks and Monitoring

### 1. API Health Endpoints
- `GET /health` - Basic health check
- `GET /health/ready` - Readiness check
- `GET /health/live` - Liveness check

### 2. Database Health
```sql
-- Database connection test
SELECT 1 as health_check;

-- Database performance check
SELECT 
  schemaname,
  tablename,
  n_tup_ins as inserts,
  n_tup_upd as updates,
  n_tup_del as deletes
FROM pg_stat_user_tables
ORDER BY n_tup_ins DESC;
```

### 3. Redis Health
```bash
# Redis connection test
redis-cli ping

# Redis memory usage
redis-cli info memory
```

## Backup and Recovery

### 1. Database Backups
- **Automated Backups**: Daily automated backups via RDS
- **Point-in-Time Recovery**: 7-day recovery window
- **Manual Snapshots**: Before major deployments

### 2. File Storage Backups
- **S3 Versioning**: Automatic versioning enabled
- **Cross-Region Replication**: Backup to secondary region
- **Lifecycle Policies**: Automatic cleanup of old versions

### 3. Application Backups
- **Git Repository**: Source code backup
- **Environment Variables**: Secure backup of configuration
- **Docker Images**: Container image backups in ECR

## Performance Optimization

### 1. Frontend Optimization
- **Next.js Optimization**: Automatic code splitting and optimization
- **CDN**: CloudFront for static asset delivery
- **Image Optimization**: Next.js automatic image optimization

### 2. API Optimization
- **Caching**: Redis caching for frequently accessed data
- **Database Indexing**: Optimized database queries
- **Connection Pooling**: Database connection pooling

### 3. Video Processing Optimization
- **Queue Management**: Efficient job queuing with BullMQ
- **Parallel Processing**: Multiple video processing workers
- **Caching**: Cache processed videos to avoid reprocessing

## Security Considerations

### 1. Authentication & Authorization
- **Clerk Integration**: Secure authentication system
- **JWT Tokens**: Secure API authentication
- **Role-Based Access**: User role management

### 2. Data Security
- **Encryption at Rest**: Database and file storage encryption
- **Encryption in Transit**: HTTPS/TLS for all communications
- **API Security**: Rate limiting and input validation

### 3. Infrastructure Security
- **VPC**: Isolated network environment
- **Security Groups**: Restrictive firewall rules
- **IAM Roles**: Least privilege access control

## Deployment Scripts

### 1. Automated Deployment
```bash
#!/bin/bash
# deploy.sh - Automated deployment script

echo "🚀 Starting FuMu deployment..."

# Build and test
npm run build
npm run test

# Deploy API
cd apps/api
npm run deploy:production

# Deploy Frontend
cd ../web
npm run deploy:production

# Run health checks
npm run health:check

echo "✅ Deployment completed successfully!"
```

### 2. Database Migration
```bash
#!/bin/bash
# migrate.sh - Database migration script

echo "🗄️ Running database migrations..."

cd apps/api
npx prisma migrate deploy
npx prisma db seed

echo "✅ Database migrations completed!"
```

## Rollback Procedures

### 1. API Rollback
```bash
# Rollback to previous version
serverless rollback --timestamp 1234567890
```

### 2. Frontend Rollback
```bash
# Rollback Vercel deployment
vercel rollback [deployment-url]
```

### 3. Database Rollback
```bash
# Restore from backup
aws rds restore-db-instance-from-db-snapshot \
  --db-instance-identifier fumu-production-db-rollback \
  --db-snapshot-identifier fumu-backup-$(date +%Y%m%d)
```

## Post-Deployment Verification

### 1. Functional Testing
- [ ] User authentication works
- [ ] Project creation and management
- [ ] Character creation and management
- [ ] Scene generation and editing
- [ ] Video processing and export
- [ ] File upload and storage

### 2. Performance Testing
- [ ] API response times < 500ms
- [ ] Frontend load times < 3s
- [ ] Video processing queue performance
- [ ] Database query performance

### 3. Security Testing
- [ ] SSL/TLS certificates valid
- [ ] API endpoints properly secured
- [ ] File upload security
- [ ] Authentication flow security

## Maintenance Procedures

### 1. Regular Maintenance
- **Weekly**: Database performance review
- **Monthly**: Security updates and patches
- **Quarterly**: Performance optimization review

### 2. Monitoring Alerts
- **High CPU Usage**: > 80% for 5 minutes
- **High Memory Usage**: > 90% for 5 minutes
- **Database Connections**: > 80% of max connections
- **Error Rate**: > 5% error rate for 5 minutes

### 3. Scaling Procedures
- **Horizontal Scaling**: Add more API instances
- **Database Scaling**: Upgrade RDS instance class
- **Storage Scaling**: Increase S3 storage limits
- **CDN Scaling**: CloudFront automatic scaling

## Support and Documentation

### 1. Documentation
- **API Documentation**: Swagger/OpenAPI documentation
- **User Guide**: End-user documentation
- **Developer Guide**: Developer onboarding guide
- **Deployment Guide**: This deployment guide

### 2. Support Channels
- **Email Support**: support@fumu.app
- **Documentation**: docs.fumu.app
- **Issue Tracking**: GitHub issues
- **Status Page**: status.fumu.app

## Next Steps

1. **Set up AWS Infrastructure**: Create RDS, ElastiCache, S3, and CloudFront
2. **Configure Domain**: Set up fumu.app domain and DNS
3. **Deploy API**: Deploy NestJS API to AWS Lambda/ECS
4. **Deploy Frontend**: Deploy Next.js app to Vercel
5. **Configure Monitoring**: Set up CloudWatch and monitoring alerts
6. **Run Tests**: Execute comprehensive testing suite
7. **Go Live**: Launch production environment

The deployment system is now ready for production deployment with comprehensive infrastructure, monitoring, and maintenance procedures in place.
