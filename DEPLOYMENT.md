# 🎬 FuMu Deployment Guide

This guide will help you deploy FuMu to production.

## 🚀 Quick Start

### Option 1: Docker Deployment (Recommended)

1. **Clone the repository**
   ```bash
   git clone https://github.com/YasirBucha/fumu.git
   cd fumu
   ```

2. **Set up environment**
   ```bash
   cp env.production.template .env.production
   # Edit .env.production with your actual values
   ```

3. **Start services**
   ```bash
   docker-compose up -d
   ```

4. **Verify deployment**
   ```bash
   curl http://localhost/health
   ```

### Option 2: Manual Server Setup

1. **Run the production setup script**
   ```bash
   chmod +x scripts/setup-production.sh
   sudo ./scripts/setup-production.sh
   ```

2. **Update environment configuration**
   ```bash
   sudo nano .env.production
   ```

3. **Start services**
   ```bash
   sudo systemctl start fumu-api fumu-web
   ```

## 📋 Prerequisites

### System Requirements
- **OS**: Ubuntu 20.04+ / CentOS 8+ / macOS 12+
- **RAM**: Minimum 4GB, Recommended 8GB+
- **Storage**: Minimum 20GB free space
- **CPU**: 2+ cores recommended

### Required Software
- **Node.js**: 18.0.0+
- **PostgreSQL**: 13+
- **Redis**: 6+
- **FFmpeg**: Latest version
- **Nginx**: 1.18+ (for reverse proxy)

## 🔧 Environment Configuration

### Required Environment Variables

Create a `.env.production` file with the following variables:

```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/fumu_production"

# Redis
REDIS_HOST="localhost"
REDIS_PORT="6379"
REDIS_PASSWORD="your_redis_password"

# Authentication
CLERK_PUBLISHABLE_KEY="pk_live_your_key"
CLERK_SECRET_KEY="sk_live_your_key"

# AI Services
OPENAI_API_KEY="sk-your_openai_key"
GOOGLE_AI_API_KEY="your_google_key"
RUNWAY_API_KEY="your_runway_key"

# AWS (for file storage)
AWS_ACCESS_KEY_ID="your_access_key"
AWS_SECRET_ACCESS_KEY="your_secret_key"
AWS_S3_BUCKET="your_bucket_name"

# Application
NODE_ENV="production"
FRONTEND_URL="https://yourdomain.com"
API_URL="https://api.yourdomain.com"
```

### Optional Configuration

```bash
# Email (for notifications)
SMTP_HOST="smtp.gmail.com"
SMTP_USER="your_email@gmail.com"
SMTP_PASS="your_password"

# Monitoring
SENTRY_DSN="your_sentry_dsn"
NEW_RELIC_LICENSE_KEY="your_newrelic_key"
```

## 🗄️ Database Setup

### PostgreSQL Installation

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

**CentOS/RHEL:**
```bash
sudo yum install postgresql-server postgresql-contrib
sudo postgresql-setup initdb
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### Database Configuration

1. **Create database and user**
   ```bash
   sudo -u postgres psql
   CREATE DATABASE fumu_production;
   CREATE USER fumu_user WITH PASSWORD 'secure_password';
   GRANT ALL PRIVILEGES ON DATABASE fumu_production TO fumu_user;
   \q
   ```

2. **Run migrations**
   ```bash
   cd apps/api
   npx prisma generate
   npx prisma db push
   npx prisma db seed
   ```

## 🔴 Redis Setup

### Redis Installation

**Ubuntu/Debian:**
```bash
sudo apt install redis-server
sudo systemctl start redis-server
sudo systemctl enable redis-server
```

**CentOS/RHEL:**
```bash
sudo yum install redis
sudo systemctl start redis
sudo systemctl enable redis
```

### Redis Configuration

Edit `/etc/redis/redis.conf`:
```conf
bind 127.0.0.1
port 6379
requirepass your_redis_password
```

Restart Redis:
```bash
sudo systemctl restart redis-server
```

## 🎥 FFmpeg Setup

### FFmpeg Installation

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install ffmpeg
```

**CentOS/RHEL:**
```bash
sudo yum install epel-release
sudo yum install ffmpeg
```

**macOS:**
```bash
brew install ffmpeg
```

## 🌐 Nginx Configuration

### Install Nginx

**Ubuntu/Debian:**
```bash
sudo apt install nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

**CentOS/RHEL:**
```bash
sudo yum install nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

### Configure Nginx

Copy the provided `nginx.conf` to `/etc/nginx/sites-available/fumu` and enable it:

```bash
sudo cp nginx.conf /etc/nginx/sites-available/fumu
sudo ln -s /etc/nginx/sites-available/fumu /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## 🔒 SSL Certificate Setup

### Using Let's Encrypt

1. **Install Certbot**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   ```

2. **Obtain certificate**
   ```bash
   sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
   ```

3. **Auto-renewal**
   ```bash
   sudo crontab -e
   # Add: 0 12 * * * /usr/bin/certbot renew --quiet
   ```

## 📊 Monitoring & Logging

### Health Checks

The API provides health check endpoints:
- `/health` - Overall health status
- `/health/ready` - Readiness probe
- `/health/live` - Liveness probe

### Log Management

Logs are stored in `/var/log/fumu/` and rotated daily.

View logs:
```bash
sudo journalctl -u fumu-api -f
sudo journalctl -u fumu-web -f
```

### Monitoring Script

A monitoring script is installed at `/usr/local/bin/fumu-monitor.sh` that:
- Checks service health every 5 minutes
- Restarts failed services
- Logs issues to `/var/log/fumu/monitor.log`

## 🚀 Deployment Commands

### Docker Commands

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f

# Rebuild and restart
docker-compose build --no-cache
docker-compose up -d
```

### Systemd Commands

```bash
# Start services
sudo systemctl start fumu-api fumu-web

# Stop services
sudo systemctl stop fumu-api fumu-web

# Restart services
sudo systemctl restart fumu-api fumu-web

# Check status
sudo systemctl status fumu-api fumu-web

# Enable auto-start
sudo systemctl enable fumu-api fumu-web
```

## 🔧 Maintenance

### Database Backup

```bash
# Create backup
pg_dump -h localhost -U fumu_user fumu_production > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore backup
psql -h localhost -U fumu_user fumu_production < backup_file.sql
```

### Application Updates

```bash
# Pull latest changes
git pull origin main

# Install dependencies
pnpm install

# Build applications
pnpm run build

# Restart services
sudo systemctl restart fumu-api fumu-web
```

### Queue Management

```bash
# View queue status
curl http://localhost:3001/api/video/queue/status

# Pause queue
curl -X POST http://localhost:3001/api/video/queue/pause

# Resume queue
curl -X POST http://localhost:3001/api/video/queue/resume
```

## 🐛 Troubleshooting

### Common Issues

1. **Database connection failed**
   - Check PostgreSQL is running: `sudo systemctl status postgresql`
   - Verify connection string in `.env.production`
   - Check firewall settings

2. **Redis connection failed**
   - Check Redis is running: `sudo systemctl status redis`
   - Verify Redis password
   - Check Redis configuration

3. **FFmpeg not found**
   - Install FFmpeg: `sudo apt install ffmpeg`
   - Verify installation: `ffmpeg -version`

4. **Services not starting**
   - Check logs: `sudo journalctl -u service-name -f`
   - Verify environment variables
   - Check port conflicts

### Performance Optimization

1. **Database optimization**
   - Enable connection pooling
   - Add appropriate indexes
   - Regular VACUUM and ANALYZE

2. **Redis optimization**
   - Configure memory limits
   - Enable persistence
   - Monitor memory usage

3. **Nginx optimization**
   - Enable gzip compression
   - Configure caching
   - Set appropriate worker processes

## 📞 Support

For deployment issues:
1. Check the logs in `/var/log/fumu/`
2. Verify all environment variables are set
3. Ensure all services are running
4. Check firewall and network configuration

## 🔄 Updates

To update FuMu:

1. **Backup database**
2. **Pull latest changes**
3. **Install dependencies**
4. **Run migrations**
5. **Build applications**
6. **Restart services**

```bash
# Update script
git pull origin main
pnpm install
pnpm run build
sudo systemctl restart fumu-api fumu-web
```
