-- FuMu Database Initialization Script

-- Create database if it doesn't exist
SELECT 'CREATE DATABASE fumu_production'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'fumu_production')\gexec

-- Connect to the database
\c fumu_production;

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Create custom types
DO $$ BEGIN
    CREATE TYPE subscription_tier AS ENUM ('free', 'pro', 'enterprise');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE generation_status AS ENUM ('queued', 'processing', 'completed', 'failed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create indexes for better performance
-- These will be created by Prisma migrations, but we can add some custom ones here

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE fumu_production TO fumu_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO fumu_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO fumu_user;
