-- ===================================
-- PostgreSQL Initialization Script
-- ===================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create indexes for better performance
-- (migrations will create the tables)

-- Log initialization
DO $$
BEGIN
  RAISE NOTICE 'Database initialized successfully';
END $$;
