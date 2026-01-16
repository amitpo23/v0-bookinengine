-- API Logs Table for Supabase
-- Stores all API calls for monitoring and debugging

-- Create the api_logs table
CREATE TABLE IF NOT EXISTS api_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    timestamp TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    level VARCHAR(10) NOT NULL CHECK (level IN ('debug', 'info', 'warn', 'error')),
    category VARCHAR(20) NOT NULL CHECK (category IN ('api', 'medici', 'booking', 'auth', 'system')),
    action VARCHAR(255) NOT NULL,
    method VARCHAR(10),
    endpoint VARCHAR(500),
    request_body JSONB,
    response_body JSONB,
    status_code INTEGER,
    duration_ms INTEGER,
    user_id VARCHAR(100),
    session_id VARCHAR(100),
    ip_address VARCHAR(50),
    user_agent TEXT,
    error_message TEXT,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_api_logs_timestamp ON api_logs (timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_api_logs_level ON api_logs (level);
CREATE INDEX IF NOT EXISTS idx_api_logs_category ON api_logs (category);
CREATE INDEX IF NOT EXISTS idx_api_logs_endpoint ON api_logs (endpoint);
CREATE INDEX IF NOT EXISTS idx_api_logs_status_code ON api_logs (status_code);
CREATE INDEX IF NOT EXISTS idx_api_logs_user_id ON api_logs (user_id);

-- Create composite index for common filter combinations
CREATE INDEX IF NOT EXISTS idx_api_logs_level_category ON api_logs (level, category);
CREATE INDEX IF NOT EXISTS idx_api_logs_timestamp_level ON api_logs (timestamp DESC, level);

-- Enable Row Level Security (optional - for admin access only)
ALTER TABLE api_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Allow service role full access
CREATE POLICY "Service role has full access to api_logs" 
    ON api_logs 
    FOR ALL 
    USING (auth.role() = 'service_role');

-- Policy: Allow authenticated admins to read logs
CREATE POLICY "Admins can read api_logs" 
    ON api_logs 
    FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role IN ('admin', 'super_admin')
        )
    );

-- Function to clean old logs (keep last 30 days)
CREATE OR REPLACE FUNCTION clean_old_api_logs()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM api_logs 
    WHERE timestamp < NOW() - INTERVAL '30 days';
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- View for error summary
CREATE OR REPLACE VIEW api_errors_summary AS
SELECT 
    DATE_TRUNC('hour', timestamp) as hour,
    category,
    endpoint,
    COUNT(*) as error_count,
    COUNT(DISTINCT ip_address) as unique_ips
FROM api_logs
WHERE level = 'error'
AND timestamp > NOW() - INTERVAL '24 hours'
GROUP BY DATE_TRUNC('hour', timestamp), category, endpoint
ORDER BY hour DESC, error_count DESC;

-- View for API performance metrics
CREATE OR REPLACE VIEW api_performance_metrics AS
SELECT 
    endpoint,
    COUNT(*) as total_requests,
    AVG(duration_ms) as avg_duration_ms,
    PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY duration_ms) as median_duration_ms,
    PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY duration_ms) as p95_duration_ms,
    MAX(duration_ms) as max_duration_ms,
    COUNT(*) FILTER (WHERE status_code >= 400) as error_count,
    ROUND(100.0 * COUNT(*) FILTER (WHERE status_code >= 400) / COUNT(*), 2) as error_rate
FROM api_logs
WHERE timestamp > NOW() - INTERVAL '24 hours'
AND duration_ms IS NOT NULL
GROUP BY endpoint
ORDER BY total_requests DESC;

-- View for Medici API specific metrics
CREATE OR REPLACE VIEW medici_api_metrics AS
SELECT 
    endpoint,
    action,
    COUNT(*) as call_count,
    AVG(duration_ms) as avg_duration_ms,
    COUNT(*) FILTER (WHERE status_code = 200) as success_count,
    COUNT(*) FILTER (WHERE status_code != 200) as failure_count,
    ROUND(100.0 * COUNT(*) FILTER (WHERE status_code = 200) / COUNT(*), 2) as success_rate
FROM api_logs
WHERE category = 'medici'
AND timestamp > NOW() - INTERVAL '24 hours'
GROUP BY endpoint, action
ORDER BY call_count DESC;

-- Comment for documentation
COMMENT ON TABLE api_logs IS 'Stores all API calls for monitoring, debugging, and analytics';
COMMENT ON COLUMN api_logs.level IS 'Log level: debug, info, warn, error';
COMMENT ON COLUMN api_logs.category IS 'API category: api, medici, booking, auth, system';
COMMENT ON COLUMN api_logs.duration_ms IS 'Request duration in milliseconds';
