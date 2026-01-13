-- Audit Logs Table - תיקון 14 לחוק הגנת הפרטיות
-- טבלה לתיעוד כל פעולות המשתמשים במערכת

-- יצירת הטבלה
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  user_id TEXT NOT NULL,
  user_email TEXT NOT NULL,
  ip_address TEXT NOT NULL,
  user_agent TEXT,
  action TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('INFO', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
  resource TEXT NOT NULL,
  resource_id TEXT,
  old_value JSONB,
  new_value JSONB,
  success BOOLEAN NOT NULL,
  error_message TEXT,
  metadata JSONB,
  session_id TEXT,
  request_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes לביצועים מהירים
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON audit_logs(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_severity ON audit_logs(severity);
CREATE INDEX IF NOT EXISTS idx_audit_logs_resource ON audit_logs(resource, resource_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_ip ON audit_logs(ip_address);
CREATE INDEX IF NOT EXISTS idx_audit_logs_success ON audit_logs(success);

-- Index מורכב לחיפושים נפוצים
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_time ON audit_logs(user_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action_time ON audit_logs(action, timestamp DESC);

-- Enable Row Level Security
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Policy: רק אדמינים יכולים לקרוא לוגים
CREATE POLICY "Only admins can view audit logs"
  ON audit_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Policy: המערכת יכולה לכתוב (service role only)
CREATE POLICY "System can write audit logs"
  ON audit_logs FOR INSERT
  WITH CHECK (true);

-- Policy: אסור למחוק לוגים (שמירה ל-7 שנים לפי החוק)
CREATE POLICY "Audit logs cannot be deleted"
  ON audit_logs FOR DELETE
  USING (false);

-- Policy: אסור לעדכן לוגים (immutable)
CREATE POLICY "Audit logs cannot be updated"
  ON audit_logs FOR UPDATE
  USING (false);

-- View: לוגים אחרונים (לדשבורד)
CREATE OR REPLACE VIEW recent_audit_logs AS
SELECT 
  id,
  timestamp,
  user_email,
  action,
  severity,
  resource,
  success
FROM audit_logs
ORDER BY timestamp DESC
LIMIT 100;

-- View: אירועי אבטחה קריטיים
CREATE OR REPLACE VIEW critical_security_events AS
SELECT 
  id,
  timestamp,
  user_email,
  ip_address,
  action,
  resource,
  error_message
FROM audit_logs
WHERE severity = 'CRITICAL'
ORDER BY timestamp DESC;

-- View: ניסיונות כניסה כושלים
CREATE OR REPLACE VIEW failed_login_attempts AS
SELECT 
  timestamp,
  user_email,
  ip_address,
  error_message,
  COUNT(*) OVER (PARTITION BY ip_address) as attempts_from_ip,
  COUNT(*) OVER (PARTITION BY user_email) as attempts_for_email
FROM audit_logs
WHERE action = 'LOGIN_FAILED'
  AND timestamp > NOW() - INTERVAL '1 hour'
ORDER BY timestamp DESC;

-- Function: ניקוי לוגים ישנים (מעל 7 שנים)
CREATE OR REPLACE FUNCTION cleanup_old_audit_logs()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  -- מחיקת לוגים מעל 7 שנים (2555 ימים)
  DELETE FROM audit_logs
  WHERE timestamp < NOW() - INTERVAL '2555 days';
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: סטטיסטיקות אבטחה
CREATE OR REPLACE FUNCTION get_security_stats(
  p_user_id TEXT DEFAULT NULL,
  p_start_date TIMESTAMPTZ DEFAULT NOW() - INTERVAL '30 days',
  p_end_date TIMESTAMPTZ DEFAULT NOW()
)
RETURNS TABLE (
  total_events BIGINT,
  failed_logins BIGINT,
  successful_logins BIGINT,
  unauthorized_attempts BIGINT,
  critical_events BIGINT,
  data_exports BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*) as total_events,
    COUNT(*) FILTER (WHERE action = 'LOGIN_FAILED') as failed_logins,
    COUNT(*) FILTER (WHERE action = 'LOGIN' AND success = true) as successful_logins,
    COUNT(*) FILTER (WHERE action = 'UNAUTHORIZED_ACCESS') as unauthorized_attempts,
    COUNT(*) FILTER (WHERE severity = 'CRITICAL') as critical_events,
    COUNT(*) FILTER (WHERE action = 'DATA_EXPORTED') as data_exports
  FROM audit_logs
  WHERE 
    (p_user_id IS NULL OR user_id = p_user_id)
    AND timestamp BETWEEN p_start_date AND p_end_date;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: זיהוי פעילות חשודה
CREATE OR REPLACE FUNCTION detect_suspicious_activity()
RETURNS TABLE (
  user_id TEXT,
  user_email TEXT,
  ip_address TEXT,
  suspicious_reason TEXT,
  event_count BIGINT,
  first_event TIMESTAMPTZ,
  last_event TIMESTAMPTZ
) AS $$
BEGIN
  -- מציאת משתמשים עם יותר מ-5 ניסיונות כניסה כושלים בשעה האחרונה
  RETURN QUERY
  SELECT 
    al.user_id,
    al.user_email,
    al.ip_address,
    'Multiple failed login attempts' as suspicious_reason,
    COUNT(*) as event_count,
    MIN(al.timestamp) as first_event,
    MAX(al.timestamp) as last_event
  FROM audit_logs al
  WHERE al.action = 'LOGIN_FAILED'
    AND al.timestamp > NOW() - INTERVAL '1 hour'
  GROUP BY al.user_id, al.user_email, al.ip_address
  HAVING COUNT(*) >= 5
  
  UNION ALL
  
  -- מציאת גישות לא מורשות
  SELECT 
    al.user_id,
    al.user_email,
    al.ip_address,
    'Unauthorized access attempts' as suspicious_reason,
    COUNT(*) as event_count,
    MIN(al.timestamp) as first_event,
    MAX(al.timestamp) as last_event
  FROM audit_logs al
  WHERE al.action = 'UNAUTHORIZED_ACCESS'
    AND al.timestamp > NOW() - INTERVAL '24 hours'
  GROUP BY al.user_id, al.user_email, al.ip_address
  
  UNION ALL
  
  -- מציאת חריגות בקצב בקשות
  SELECT 
    al.user_id,
    al.user_email,
    al.ip_address,
    'Rate limit exceeded multiple times' as suspicious_reason,
    COUNT(*) as event_count,
    MIN(al.timestamp) as first_event,
    MAX(al.timestamp) as last_event
  FROM audit_logs al
  WHERE al.action = 'RATE_LIMIT_EXCEEDED'
    AND al.timestamp > NOW() - INTERVAL '1 hour'
  GROUP BY al.user_id, al.user_email, al.ip_address
  HAVING COUNT(*) >= 3;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: מניעת שינוי לוגים קיימים
CREATE OR REPLACE FUNCTION prevent_audit_log_modification()
RETURNS TRIGGER AS $$
BEGIN
  RAISE EXCEPTION 'Audit logs are immutable and cannot be modified';
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER prevent_audit_log_update
  BEFORE UPDATE ON audit_logs
  FOR EACH ROW
  EXECUTE FUNCTION prevent_audit_log_modification();

CREATE TRIGGER prevent_audit_log_delete
  BEFORE DELETE ON audit_logs
  FOR EACH ROW
  EXECUTE FUNCTION prevent_audit_log_modification();

-- Comment on table
COMMENT ON TABLE audit_logs IS 'Audit log for compliance with Amendment 14 to the Privacy Protection Law. Retains all user actions for 7 years.';

-- הדפסת הצלחה
DO $$
BEGIN
  RAISE NOTICE 'Audit logs table created successfully!';
  RAISE NOTICE 'Tables: audit_logs';
  RAISE NOTICE 'Views: recent_audit_logs, critical_security_events, failed_login_attempts';
  RAISE NOTICE 'Functions: cleanup_old_audit_logs(), get_security_stats(), detect_suspicious_activity()';
END $$;
