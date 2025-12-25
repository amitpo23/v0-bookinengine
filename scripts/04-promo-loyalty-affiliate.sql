-- ========================================
-- PROMO CODES TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS promo_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  discount_type VARCHAR(20) NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value NUMERIC(10, 2) NOT NULL,
  min_purchase_amount NUMERIC(10, 2),
  max_discount_amount NUMERIC(10, 2),
  valid_from TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  valid_until TIMESTAMP WITH TIME ZONE,
  usage_limit INTEGER,
  usage_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  applicable_templates TEXT[], -- ['nara', 'luxury', 'modern-dark', 'family', 'ai-chat']
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for fast code lookup
CREATE INDEX IF NOT EXISTS idx_promo_codes_code ON promo_codes(code);
CREATE INDEX IF NOT EXISTS idx_promo_codes_active ON promo_codes(is_active, valid_from, valid_until);

-- ========================================
-- LOYALTY CLUB TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS loyalty_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) UNIQUE NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  phone VARCHAR(20),
  membership_tier VARCHAR(20) DEFAULT 'bronze' CHECK (membership_tier IN ('bronze', 'silver', 'gold', 'platinum')),
  points INTEGER DEFAULT 0,
  total_bookings INTEGER DEFAULT 0,
  total_spent NUMERIC(10, 2) DEFAULT 0,
  discount_percentage INTEGER DEFAULT 5, -- Default 5% discount
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_booking_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for user lookup
CREATE INDEX IF NOT EXISTS idx_loyalty_members_user_id ON loyalty_members(user_id);
CREATE INDEX IF NOT EXISTS idx_loyalty_members_email ON loyalty_members(email);
CREATE INDEX IF NOT EXISTS idx_loyalty_members_tier ON loyalty_members(membership_tier);

-- ========================================
-- AFFILIATE TRACKING TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS affiliate_tracking (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id VARCHAR(100),
  session_id VARCHAR(100),
  
  -- UTM Parameters
  utm_source VARCHAR(100),
  utm_medium VARCHAR(100),
  utm_campaign VARCHAR(100),
  utm_term VARCHAR(100),
  utm_content VARCHAR(100),
  
  -- Referral Info
  referrer_url TEXT,
  landing_page TEXT,
  affiliate_code VARCHAR(50),
  affiliate_id UUID, -- Link to affiliate users
  
  -- Conversion Data
  converted BOOLEAN DEFAULT false,
  conversion_value NUMERIC(10, 2),
  commission_amount NUMERIC(10, 2),
  commission_rate NUMERIC(5, 2),
  
  -- Device & Location
  ip_address VARCHAR(45),
  user_agent TEXT,
  device_type VARCHAR(20),
  browser VARCHAR(50),
  country VARCHAR(2),
  city VARCHAR(100),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  converted_at TIMESTAMP WITH TIME ZONE
);

-- Indexes for analytics
CREATE INDEX IF NOT EXISTS idx_affiliate_tracking_utm_source ON affiliate_tracking(utm_source);
CREATE INDEX IF NOT EXISTS idx_affiliate_tracking_utm_campaign ON affiliate_tracking(utm_campaign);
CREATE INDEX IF NOT EXISTS idx_affiliate_tracking_affiliate_code ON affiliate_tracking(affiliate_code);
CREATE INDEX IF NOT EXISTS idx_affiliate_tracking_converted ON affiliate_tracking(converted);
CREATE INDEX IF NOT EXISTS idx_affiliate_tracking_booking_id ON affiliate_tracking(booking_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_tracking_created_at ON affiliate_tracking(created_at DESC);

-- ========================================
-- PROMO CODE USAGE TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS promo_code_usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  promo_code_id UUID REFERENCES promo_codes(id) ON DELETE CASCADE,
  booking_id VARCHAR(100),
  user_email VARCHAR(255),
  discount_amount NUMERIC(10, 2),
  order_amount NUMERIC(10, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for tracking usage
CREATE INDEX IF NOT EXISTS idx_promo_code_usage_promo_code_id ON promo_code_usage(promo_code_id);
CREATE INDEX IF NOT EXISTS idx_promo_code_usage_booking_id ON promo_code_usage(booking_id);
CREATE INDEX IF NOT EXISTS idx_promo_code_usage_user_email ON promo_code_usage(user_email);

-- ========================================
-- RLS POLICIES
-- ========================================

-- Promo Codes - Public can read active codes, admins can manage
ALTER TABLE promo_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active promo codes"
ON promo_codes FOR SELECT
TO public
USING (is_active = true AND (valid_until IS NULL OR valid_until > NOW()));

CREATE POLICY "Admins can manage promo codes"
ON promo_codes FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM rbac_user_roles ur
    JOIN rbac_roles r ON ur.role_id = r.id
    WHERE ur.user_id = auth.uid()
    AND r.name IN ('ADMIN', 'SUPER_ADMIN')
  )
);

-- Loyalty Members - Users can view their own, admins can manage all
ALTER TABLE loyalty_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own loyalty data"
ON loyalty_members FOR SELECT
TO authenticated
USING (user_id = auth.uid() OR email = auth.jwt()->>'email');

CREATE POLICY "Users can insert their own loyalty data"
ON loyalty_members FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid() OR email = auth.jwt()->>'email');

CREATE POLICY "Users can update their own loyalty data"
ON loyalty_members FOR UPDATE
TO authenticated
USING (user_id = auth.uid() OR email = auth.jwt()->>'email');

CREATE POLICY "Admins can manage all loyalty members"
ON loyalty_members FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM rbac_user_roles ur
    JOIN rbac_roles r ON ur.role_id = r.id
    WHERE ur.user_id = auth.uid()
    AND r.name IN ('ADMIN', 'SUPER_ADMIN')
  )
);

-- Affiliate Tracking - Admins only
ALTER TABLE affiliate_tracking ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all affiliate tracking"
ON affiliate_tracking FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM rbac_user_roles ur
    JOIN rbac_roles r ON ur.role_id = r.id
    WHERE ur.user_id = auth.uid()
    AND r.name IN ('ADMIN', 'SUPER_ADMIN')
  )
);

CREATE POLICY "System can insert tracking data"
ON affiliate_tracking FOR INSERT
TO public
WITH CHECK (true);

-- Promo Code Usage - Admins can view, system can insert
ALTER TABLE promo_code_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view promo code usage"
ON promo_code_usage FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM rbac_user_roles ur
    JOIN rbac_roles r ON ur.role_id = r.id
    WHERE ur.user_id = auth.uid()
    AND r.name IN ('ADMIN', 'SUPER_ADMIN')
  )
);

CREATE POLICY "System can insert usage records"
ON promo_code_usage FOR INSERT
TO public
WITH CHECK (true);

-- ========================================
-- FUNCTIONS FOR AUTOMATIC TIER UPDATES
-- ========================================

CREATE OR REPLACE FUNCTION update_loyalty_tier()
RETURNS TRIGGER AS $$
BEGIN
  -- Update tier based on total spent
  IF NEW.total_spent >= 10000 THEN
    NEW.membership_tier := 'platinum';
    NEW.discount_percentage := 20;
  ELSIF NEW.total_spent >= 5000 THEN
    NEW.membership_tier := 'gold';
    NEW.discount_percentage := 15;
  ELSIF NEW.total_spent >= 2000 THEN
    NEW.membership_tier := 'silver';
    NEW.discount_percentage := 10;
  ELSE
    NEW.membership_tier := 'bronze';
    NEW.discount_percentage := 5;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER loyalty_tier_update
BEFORE UPDATE OF total_spent ON loyalty_members
FOR EACH ROW
EXECUTE FUNCTION update_loyalty_tier();

-- ========================================
-- SAMPLE DATA (Optional - for testing)
-- ========================================

-- Insert sample promo codes
INSERT INTO promo_codes (code, description, discount_type, discount_value, min_purchase_amount, max_discount_amount, valid_until, usage_limit)
VALUES
  ('WELCOME10', 'ברוכים הבאים - 10% הנחה', 'percentage', 10, 500, 200, NOW() + INTERVAL '30 days', 100),
  ('SUMMER50', 'הנחת קיץ - 50 ש"ח', 'fixed', 50, 300, NULL, NOW() + INTERVAL '90 days', NULL),
  ('VIP20', 'לקוחות VIP - 20% הנחה', 'percentage', 20, 1000, 500, NOW() + INTERVAL '365 days', 50),
  ('FIRST100', 'הזמנה ראשונה - 100 ש"ח הנחה', 'fixed', 100, 500, NULL, NOW() + INTERVAL '60 days', 200)
ON CONFLICT (code) DO NOTHING;

COMMENT ON TABLE promo_codes IS 'Promotional discount codes for bookings';
COMMENT ON TABLE loyalty_members IS 'Loyalty club members with tiered benefits';
COMMENT ON TABLE affiliate_tracking IS 'Track referral sources and affiliate conversions';
COMMENT ON TABLE promo_code_usage IS 'History of promo code redemptions';
