-- Alerts and Agents Tables for Supabase
-- Comprehensive monitoring and verification system

-- =====================
-- ALERTS TABLE
-- =====================
CREATE TABLE IF NOT EXISTS alerts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    timestamp TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    type VARCHAR(50) NOT NULL,
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    source VARCHAR(50),
    metadata JSONB,
    resolved BOOLEAN DEFAULT FALSE,
    resolved_at TIMESTAMPTZ,
    resolved_by VARCHAR(100),
    related_alerts UUID[],
    request_id VARCHAR(100),
    user_id VARCHAR(100),
    booking_id VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for alerts
CREATE INDEX IF NOT EXISTS idx_alerts_timestamp ON alerts (timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_alerts_severity ON alerts (severity);
CREATE INDEX IF NOT EXISTS idx_alerts_type ON alerts (type);
CREATE INDEX IF NOT EXISTS idx_alerts_resolved ON alerts (resolved);
CREATE INDEX IF NOT EXISTS idx_alerts_booking_id ON alerts (booking_id);

-- =====================
-- AGENT RUNS TABLE
-- =====================
CREATE TABLE IF NOT EXISTS agent_runs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    agent_id VARCHAR(100) NOT NULL,
    agent_type VARCHAR(50) NOT NULL,
    run_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    duration_ms INTEGER,
    success BOOLEAN,
    items_checked INTEGER DEFAULT 0,
    issues_found INTEGER DEFAULT 0,
    issues JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for agent runs
CREATE INDEX IF NOT EXISTS idx_agent_runs_agent_id ON agent_runs (agent_id);
CREATE INDEX IF NOT EXISTS idx_agent_runs_run_at ON agent_runs (run_at DESC);

-- =====================
-- AGENT ISSUES TABLE
-- =====================
CREATE TABLE IF NOT EXISTS agent_issues (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    agent_run_id UUID REFERENCES agent_runs(id),
    severity VARCHAR(20) NOT NULL,
    type VARCHAR(100) NOT NULL,
    description TEXT,
    entity_type VARCHAR(50),
    entity_id VARCHAR(100),
    data JSONB,
    suggested_action TEXT,
    resolved BOOLEAN DEFAULT FALSE,
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for issues
CREATE INDEX IF NOT EXISTS idx_agent_issues_run_id ON agent_issues (agent_run_id);
CREATE INDEX IF NOT EXISTS idx_agent_issues_entity ON agent_issues (entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_agent_issues_resolved ON agent_issues (resolved);

-- =====================
-- REQUEST TRACKING TABLE
-- =====================
CREATE TABLE IF NOT EXISTS tracked_requests (
    id VARCHAR(100) PRIMARY KEY,
    type VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL,
    started_at TIMESTAMPTZ NOT NULL,
    completed_at TIMESTAMPTZ,
    total_duration_ms INTEGER,
    user_id VARCHAR(100),
    session_id VARCHAR(100),
    ip_address VARCHAR(50),
    user_agent TEXT,
    booking_id VARCHAR(100),
    hotel_id INTEGER,
    search_params JSONB,
    steps JSONB,
    success BOOLEAN,
    result JSONB,
    error TEXT,
    parent_request_id VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for tracked requests
CREATE INDEX IF NOT EXISTS idx_tracked_requests_type ON tracked_requests (type);
CREATE INDEX IF NOT EXISTS idx_tracked_requests_status ON tracked_requests (status);
CREATE INDEX IF NOT EXISTS idx_tracked_requests_started ON tracked_requests (started_at DESC);
CREATE INDEX IF NOT EXISTS idx_tracked_requests_user ON tracked_requests (user_id);
CREATE INDEX IF NOT EXISTS idx_tracked_requests_booking ON tracked_requests (booking_id);

-- =====================
-- BOOKINGS TABLE (for agent verification)
-- =====================
CREATE TABLE IF NOT EXISTS bookings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' 
        CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed', 'failed')),
    hotel_id INTEGER,
    hotel_name VARCHAR(255),
    check_in DATE NOT NULL,
    check_out DATE NOT NULL,
    guest_name VARCHAR(255),
    guest_email VARCHAR(255),
    guest_phone VARCHAR(50),
    total_price DECIMAL(10, 2),
    currency VARCHAR(3) DEFAULT 'USD',
    payment_status VARCHAR(20) DEFAULT 'pending'
        CHECK (payment_status IN ('pending', 'paid', 'refunded', 'failed')),
    payment_amount DECIMAL(10, 2),
    payment_date TIMESTAMPTZ,
    medici_booking_id VARCHAR(100),
    prebook_token TEXT,
    room_code VARCHAR(100),
    room_name VARCHAR(255),
    board_type VARCHAR(10),
    adults INTEGER DEFAULT 2,
    children JSONB DEFAULT '[]',
    special_requests TEXT,
    cancelled_at TIMESTAMPTZ,
    cancellation_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for bookings
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings (status);
CREATE INDEX IF NOT EXISTS idx_bookings_hotel ON bookings (hotel_id);
CREATE INDEX IF NOT EXISTS idx_bookings_checkin ON bookings (check_in);
CREATE INDEX IF NOT EXISTS idx_bookings_guest_email ON bookings (guest_email);
CREATE INDEX IF NOT EXISTS idx_bookings_payment_status ON bookings (payment_status);
CREATE INDEX IF NOT EXISTS idx_bookings_created ON bookings (created_at DESC);

-- =====================
-- RELATIONSHIPS VIEW
-- =====================
CREATE OR REPLACE VIEW booking_full_info AS
SELECT 
    b.*,
    -- Related alerts count
    (SELECT COUNT(*) FROM alerts a WHERE a.booking_id = b.id::text) as alerts_count,
    -- Related requests count
    (SELECT COUNT(*) FROM tracked_requests tr WHERE tr.booking_id = b.id::text) as requests_count,
    -- Related issues count
    (SELECT COUNT(*) FROM agent_issues ai WHERE ai.entity_id = b.id::text AND ai.entity_type = 'booking') as issues_count,
    -- Last alert
    (SELECT a.title FROM alerts a WHERE a.booking_id = b.id::text ORDER BY a.timestamp DESC LIMIT 1) as last_alert_title,
    -- Stay duration
    (b.check_out - b.check_in) as nights
FROM bookings b;

-- =====================
-- MONITORING VIEWS
-- =====================

-- Active issues by severity
CREATE OR REPLACE VIEW active_issues_summary AS
SELECT 
    severity,
    type,
    COUNT(*) as count,
    COUNT(DISTINCT entity_id) as unique_entities
FROM agent_issues
WHERE resolved = FALSE
GROUP BY severity, type
ORDER BY 
    CASE severity 
        WHEN 'critical' THEN 1 
        WHEN 'high' THEN 2 
        WHEN 'medium' THEN 3 
        ELSE 4 
    END,
    count DESC;

-- Booking health dashboard
CREATE OR REPLACE VIEW booking_health_dashboard AS
SELECT 
    DATE(created_at) as date,
    COUNT(*) as total_bookings,
    COUNT(*) FILTER (WHERE status = 'confirmed') as confirmed,
    COUNT(*) FILTER (WHERE status = 'cancelled') as cancelled,
    COUNT(*) FILTER (WHERE status = 'failed') as failed,
    COUNT(*) FILTER (WHERE status = 'pending' AND created_at < NOW() - INTERVAL '1 hour') as stuck_pending,
    COUNT(*) FILTER (WHERE payment_status = 'paid') as paid,
    COUNT(*) FILTER (WHERE payment_status = 'failed') as payment_failed,
    SUM(total_price) FILTER (WHERE status = 'confirmed') as total_revenue
FROM bookings
WHERE created_at > NOW() - INTERVAL '30 days'
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- Agent performance
CREATE OR REPLACE VIEW agent_performance AS
SELECT 
    agent_id,
    agent_type,
    COUNT(*) as total_runs,
    AVG(duration_ms) as avg_duration,
    SUM(items_checked) as total_items_checked,
    SUM(issues_found) as total_issues_found,
    MAX(run_at) as last_run
FROM agent_runs
WHERE run_at > NOW() - INTERVAL '7 days'
GROUP BY agent_id, agent_type
ORDER BY last_run DESC;

-- =====================
-- FUNCTIONS
-- =====================

-- Function to get booking with all related info
CREATE OR REPLACE FUNCTION get_booking_details(p_booking_id UUID)
RETURNS TABLE (
    booking JSONB,
    alerts JSONB,
    requests JSONB,
    issues JSONB
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        to_jsonb(b.*) as booking,
        COALESCE(
            (SELECT jsonb_agg(a.*) FROM alerts a WHERE a.booking_id = p_booking_id::text),
            '[]'::jsonb
        ) as alerts,
        COALESCE(
            (SELECT jsonb_agg(tr.*) FROM tracked_requests tr WHERE tr.booking_id = p_booking_id::text),
            '[]'::jsonb
        ) as requests,
        COALESCE(
            (SELECT jsonb_agg(ai.*) FROM agent_issues ai WHERE ai.entity_id = p_booking_id::text AND ai.entity_type = 'booking'),
            '[]'::jsonb
        ) as issues
    FROM bookings b
    WHERE b.id = p_booking_id;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER bookings_updated_at
    BEFORE UPDATE ON bookings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- =====================
-- RLS POLICIES
-- =====================
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE tracked_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Service role full access
CREATE POLICY "Service role full access on alerts" ON alerts FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access on agent_runs" ON agent_runs FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access on agent_issues" ON agent_issues FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access on tracked_requests" ON tracked_requests FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access on bookings" ON bookings FOR ALL USING (auth.role() = 'service_role');

-- =====================
-- COMMENTS
-- =====================
COMMENT ON TABLE alerts IS 'System alerts for errors, warnings, and notifications';
COMMENT ON TABLE agent_runs IS 'History of verification agent executions';
COMMENT ON TABLE agent_issues IS 'Issues found by verification agents';
COMMENT ON TABLE tracked_requests IS 'Full request lifecycle tracking';
COMMENT ON TABLE bookings IS 'Hotel booking records with full status tracking';
