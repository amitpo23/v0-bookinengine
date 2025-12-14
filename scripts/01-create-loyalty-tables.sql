-- ==================================================
-- מערכת מועדון לקוחות + AI Chat Memory
-- ==================================================

-- תחילה נוצר פונקציות עזר
-- פונקציה לעדכון שדה updated_at אוטומטי
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- פונקציה לעדכון זמן הודעה אחרונה בשיחה
CREATE OR REPLACE FUNCTION update_chat_session_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE chat_sessions 
    SET last_message_at = NOW() 
    WHERE id = NEW.session_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- כעת נוצר את הטבלאות
-- 1. טבלת חברי מועדון
CREATE TABLE IF NOT EXISTS loyalty_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone TEXT,
  date_of_birth DATE,
  member_since TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  total_points INTEGER DEFAULT 0,
  tier TEXT DEFAULT 'bronze' CHECK (tier IN ('bronze', 'silver', 'gold', 'platinum')),
  total_bookings INTEGER DEFAULT 0,
  total_spent DECIMAL(10,2) DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. טבלת נקודות/טרנזקציות
CREATE TABLE IF NOT EXISTS loyalty_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID REFERENCES loyalty_members(id) ON DELETE CASCADE,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('earn', 'redeem', 'expire', 'bonus')),
  points INTEGER NOT NULL,
  booking_id TEXT,
  description TEXT,
  description_he TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. טבלת הנחות/קופונים
CREATE TABLE IF NOT EXISTS loyalty_rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  name_he TEXT NOT NULL,
  description TEXT,
  description_he TEXT,
  discount_type TEXT CHECK (discount_type IN ('percentage', 'fixed_amount', 'points')),
  discount_value DECIMAL(10,2) NOT NULL,
  points_required INTEGER,
  min_tier TEXT CHECK (min_tier IN ('bronze', 'silver', 'gold', 'platinum')),
  valid_from TIMESTAMP WITH TIME ZONE,
  valid_to TIMESTAMP WITH TIME ZONE,
  max_uses INTEGER,
  times_used INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. טבלת שימוש בהנחות
CREATE TABLE IF NOT EXISTS loyalty_reward_redemptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID REFERENCES loyalty_members(id) ON DELETE CASCADE,
  reward_id UUID REFERENCES loyalty_rewards(id) ON DELETE CASCADE,
  booking_id TEXT,
  points_used INTEGER,
  discount_applied DECIMAL(10,2),
  redeemed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. טבלת AI Chat Sessions
CREATE TABLE IF NOT EXISTS chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT,
  member_id UUID REFERENCES loyalty_members(id) ON DELETE SET NULL,
  session_title TEXT,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_message_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true
);

-- 6. טבלת AI Chat Messages
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- אינדקסים לביצועים
CREATE INDEX IF NOT EXISTS idx_loyalty_members_email ON loyalty_members(email);
CREATE INDEX IF NOT EXISTS idx_loyalty_members_tier ON loyalty_members(tier);
CREATE INDEX IF NOT EXISTS idx_loyalty_transactions_member ON loyalty_transactions(member_id);
CREATE INDEX IF NOT EXISTS idx_loyalty_rewards_active ON loyalty_rewards(is_active);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_user ON chat_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_session ON chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_member ON chat_sessions(member_id);

-- רק כעת נוצר triggers (אחרי הפונקציות והטבלאות)
-- Trigger לעדכון updated_at אוטומטי
CREATE TRIGGER update_loyalty_members_updated_at 
BEFORE UPDATE ON loyalty_members
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger לעדכון זמן הודעה אחרונה
CREATE TRIGGER update_chat_sessions_last_message 
AFTER INSERT ON chat_messages
FOR EACH ROW
EXECUTE FUNCTION update_chat_session_timestamp();

-- הצלחה!
DO $$ 
BEGIN
    RAISE NOTICE 'Tables created successfully!';
END $$;
