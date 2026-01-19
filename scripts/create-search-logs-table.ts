/**
 * Supabase Migration Script - Create search_logs Table
 * Run this SQL in your Supabase SQL editor to create the search_logs table
 */

const createSearchLogsTableSQL = `
-- Create search_logs table
CREATE TABLE search_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  hotel_id UUID,
  search_query TEXT,
  destination TEXT,
  hotel_name TEXT,
  city TEXT,
  date_from DATE,
  date_to DATE,
  adults INTEGER DEFAULT 2,
  children INTEGER DEFAULT 0,
  results_count INTEGER NOT NULL DEFAULT 0,
  found_hotels INTEGER,
  found_rooms INTEGER,
  duration_ms INTEGER,
  success BOOLEAN NOT NULL DEFAULT true,
  error_message TEXT,
  user_id UUID,
  session_id TEXT,
  ip_address TEXT,
  user_agent TEXT,
  source TEXT,
  channel TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX idx_search_logs_hotel_id ON search_logs(hotel_id);
CREATE INDEX idx_search_logs_created_at ON search_logs(created_at DESC);
CREATE INDEX idx_search_logs_success ON search_logs(success);
CREATE INDEX idx_search_logs_user_id ON search_logs(user_id);
CREATE INDEX idx_search_logs_source ON search_logs(source);
CREATE INDEX idx_search_logs_destination ON search_logs(destination);

-- Enable RLS (Row Level Security)
ALTER TABLE search_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Enable read access for authenticated users" ON search_logs
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable insert for authenticated users" ON search_logs
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users" ON search_logs
  FOR DELETE USING (auth.role() = 'authenticated');
`;

export default createSearchLogsTableSQL;
