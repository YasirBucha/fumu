#!/bin/bash

# FuMu Production Setup Script
# This script sets up the production environment for FuMu

set -e

echo "🎬 Setting up FuMu for Production..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root
if [ "$EUID" -eq 0 ]; then
    print_error "Please do not run this script as root"
    exit 1
fi

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "Please run this script from the FuMu root directory"
    exit 1
fi

print_status "Starting production setup..."

# Step 1: Install system dependencies
print_status "Installing system dependencies..."
if command -v apt-get &> /dev/null; then
    # Ubuntu/Debian
    sudo apt-get update
    sudo apt-get install -y \
        postgresql postgresql-contrib \
        redis-server \
        ffmpeg \
        nginx \
        certbot python3-certbot-nginx \
        nodejs npm \
        build-essential \
        curl wget git
elif command -v yum &> /dev/null; then
    # CentOS/RHEL
    sudo yum update -y
    sudo yum install -y \
        postgresql postgresql-server postgresql-contrib \
        redis \
        ffmpeg \
        nginx \
        certbot python3-certbot-nginx \
        nodejs npm \
        gcc gcc-c++ make \
        curl wget git
elif command -v brew &> /dev/null; then
    # macOS
    brew install postgresql redis ffmpeg nginx certbot node npm
else
    print_error "Unsupported operating system. Please install dependencies manually."
    exit 1
fi

print_success "System dependencies installed"

# Step 2: Setup PostgreSQL
print_status "Setting up PostgreSQL..."
if command -v systemctl &> /dev/null; then
    sudo systemctl start postgresql
    sudo systemctl enable postgresql
elif command -v brew &> /dev/null; then
    brew services start postgresql
fi

# Create database and user
sudo -u postgres psql -c "CREATE DATABASE fumu_production;" || print_warning "Database may already exist"
sudo -u postgres psql -c "CREATE USER fumu_user WITH PASSWORD 'fumu_secure_password';" || print_warning "User may already exist"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE fumu_production TO fumu_user;"
sudo -u postgres psql -c "ALTER USER fumu_user CREATEDB;"

print_success "PostgreSQL configured"

# Step 3: Setup Redis
print_status "Setting up Redis..."
if command -v systemctl &> /dev/null; then
    sudo systemctl start redis
    sudo systemctl enable redis
elif command -v brew &> /dev/null; then
    brew services start redis
fi

print_success "Redis configured"

# Step 4: Install Node.js dependencies
print_status "Installing Node.js dependencies..."
npm install -g pnpm
pnpm install

print_success "Node.js dependencies installed"

# Step 5: Setup environment files
print_status "Setting up environment files..."
if [ ! -f ".env.production" ]; then
    cp env.production.template .env.production
    print_warning "Created .env.production from template. Please update with your actual values."
else
    print_warning ".env.production already exists. Please verify your configuration."
fi

# Step 6: Setup database
print_status "Setting up database..."
cd apps/api
npx prisma generate
npx prisma db push
npx prisma db seed
cd ../..

print_success "Database setup completed"

# Step 7: Build applications
print_status "Building applications..."
pnpm run build

print_success "Applications built successfully"

# Step 8: Setup Nginx configuration
print_status "Setting up Nginx configuration..."
sudo tee /etc/nginx/sites-available/fumu << EOF
server {
    listen 80;
    server_name fumu.app www.fumu.app;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }

    # API
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

sudo ln -sf /etc/nginx/sites-available/fumu /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

print_success "Nginx configured"

# Step 9: Setup SSL certificates
print_status "Setting up SSL certificates..."
read -p "Do you want to setup SSL certificates with Let's Encrypt? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    sudo certbot --nginx -d fumu.app -d www.fumu.app --non-interactive --agree-tos --email admin@fumu.app
    print_success "SSL certificates configured"
else
    print_warning "Skipping SSL setup. You can run 'sudo certbot --nginx' later."
fi

# Step 10: Setup systemd services
print_status "Setting up systemd services..."

# API service
sudo tee /etc/systemd/system/fumu-api.service << EOF
[Unit]
Description=FuMu API Service
After=network.target postgresql.service redis.service

[Service]
Type=simple
User=www-data
WorkingDirectory=$(pwd)
Environment=NODE_ENV=production
ExecStart=/usr/bin/node apps/api/dist/main.js
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

# Frontend service
sudo tee /etc/systemd/system/fumu-web.service << EOF
[Unit]
Description=FuMu Web Service
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=$(pwd)
Environment=NODE_ENV=production
ExecStart=/usr/bin/node apps/web/server.js
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable fumu-api fumu-web
sudo systemctl start fumu-api fumu-web

print_success "Systemd services configured and started"

# Step 11: Setup log rotation
print_status "Setting up log rotation..."
sudo tee /etc/logrotate.d/fumu << EOF
/var/log/fumu/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 www-data www-data
    postrotate
        systemctl reload fumu-api fumu-web
    endscript
}
EOF

print_success "Log rotation configured"

# Step 12: Setup monitoring
print_status "Setting up monitoring..."
sudo mkdir -p /var/log/fumu
sudo chown www-data:www-data /var/log/fumu

# Create monitoring script
sudo tee /usr/local/bin/fumu-monitor.sh << EOF
#!/bin/bash
# FuMu Monitoring Script

LOG_FILE="/var/log/fumu/monitor.log"
DATE=\$(date '+%Y-%m-%d %H:%M:%S')

# Check API service
if ! systemctl is-active --quiet fumu-api; then
    echo "\$DATE - API service is down" >> \$LOG_FILE
    systemctl restart fumu-api
fi

# Check Web service
if ! systemctl is-active --quiet fumu-web; then
    echo "\$DATE - Web service is down" >> \$LOG_FILE
    systemctl restart fumu-web
fi

# Check PostgreSQL
if ! systemctl is-active --quiet postgresql; then
    echo "\$DATE - PostgreSQL is down" >> \$LOG_FILE
    systemctl restart postgresql
fi

# Check Redis
if ! systemctl is-active --quiet redis; then
    echo "\$DATE - Redis is down" >> \$LOG_FILE
    systemctl restart redis
fi
EOF

sudo chmod +x /usr/local/bin/fumu-monitor.sh

# Add to crontab
(crontab -l 2>/dev/null; echo "*/5 * * * * /usr/local/bin/fumu-monitor.sh") | crontab -

print_success "Monitoring configured"

print_success "🎬 FuMu production setup completed!"
echo
echo "Next steps:"
echo "1. Update .env.production with your actual API keys and configuration"
echo "2. Test the application: curl http://localhost:3000"
echo "3. Check service status: sudo systemctl status fumu-api fumu-web"
echo "4. View logs: sudo journalctl -u fumu-api -f"
echo "5. Setup your domain DNS to point to this server"
echo
echo "Services running:"
echo "- Frontend: http://localhost:3000"
echo "- API: http://localhost:3001"
echo "- PostgreSQL: localhost:5432"
echo "- Redis: localhost:6379"
echo "- Nginx: http://localhost:80"
