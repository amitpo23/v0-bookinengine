-- ==================================================
-- AI Engines Database Schema
-- טבלאות לניהול מנועי AI, שיחות וניתוחים
-- ==================================================

-- 1. טבלת מנועי AI
-- שומרת את הגדרות ומטא-דאטה של כל מנוע
CREATE TABLE IF NOT EXISTS ai_engines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instance_id TEXT UNIQUE NOT NULL,
  template_id TEXT NOT NULL,
  name TEXT NOT NULL,
  name_he TEXT,
  description TEXT,
  description_he TEXT,
  engine_type TEXT NOT NULL CHECK (engine_type IN (
    'hotel-booking', 'flight-booking', 'travel-agent', 
    'concierge', 'price-monitor', 'voice-agent', 
    'multi-modal', 'research-agent', 'custom'
  )),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'maintenance', 'error')),
  persona TEXT,
  persona_he TEXT,
  
  -- הגדרות LLM
  llm_provider TEXT DEFAULT 'openai' CHECK (llm_provider IN ('openai', 'anthropic', 'groq', 'google', 'azure')),
  llm_model TEXT DEFAULT 'gpt-4o',
  temperature DECIMAL(2,1) DEFAULT 0.7,
  max_tokens INTEGER DEFAULT 4096,
  
  -- יכולות ו-skills
  capabilities TEXT[] DEFAULT '{}',
  enabled_skills TEXT[] DEFAULT '{}',
  custom_tools JSONB DEFAULT '[]',
  
  -- הגדרות נוספות
  config JSONB DEFAULT '{}',
  handoff_config JSONB DEFAULT '{}',
  
  -- סטטיסטיקות
  total_conversations INTEGER DEFAULT 0,
  total_messages INTEGER DEFAULT 0,
  avg_response_time_ms INTEGER DEFAULT 0,
  success_rate DECIMAL(5,2) DEFAULT 100.00,
  
  -- זמנים
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_active_at TIMESTAMP WITH TIME ZONE
);

-- 2. טבלת שיחות מנוע AI
-- שומרת את השיחות הספציפיות לכל מנוע
CREATE TABLE IF NOT EXISTS ai_engine_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id TEXT UNIQUE NOT NULL,
  engine_id UUID REFERENCES ai_engines(id) ON DELETE CASCADE,
  user_id TEXT,
  member_id UUID, -- קשר למועדון לקוחות
  
  -- פרטי שיחה
  title TEXT,
  language TEXT DEFAULT 'en' CHECK (language IN ('en', 'he', 'ar', 'ru', 'fr', 'de', 'es')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'abandoned', 'handoff')),
  
  -- קונטקסט
  context JSONB DEFAULT '{}',
  booking_intent JSONB, -- { hotelId, checkIn, checkOut, guests, etc }
  search_context JSONB, -- { destination, dates, filters, etc }
  
  -- תוצאות
  outcome TEXT CHECK (outcome IN ('booking_completed', 'booking_started', 'inquiry', 'support', 'handoff', 'abandoned')),
  booking_id TEXT,
  satisfaction_rating INTEGER CHECK (satisfaction_rating >= 1 AND satisfaction_rating <= 5),
  
  -- סטטיסטיקות
  message_count INTEGER DEFAULT 0,
  tool_calls_count INTEGER DEFAULT 0,
  
  -- זמנים
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_message_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ended_at TIMESTAMP WITH TIME ZONE
);

-- 3. טבלת הודעות שיחה
-- שומרת את כל ההודעות בשיחות מנוע
CREATE TABLE IF NOT EXISTS ai_engine_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES ai_engine_conversations(id) ON DELETE CASCADE,
  
  -- תוכן
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system', 'tool')),
  content TEXT NOT NULL,
  
  -- מטא-דאטה
  tool_name TEXT,
  tool_input JSONB,
  tool_output JSONB,
  
  -- ביצועים
  tokens_used INTEGER DEFAULT 0,
  response_time_ms INTEGER,
  
  -- זמנים
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. טבלת קריאות כלים (Tool Calls)
CREATE TABLE IF NOT EXISTS ai_engine_tool_calls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES ai_engine_conversations(id) ON DELETE CASCADE,
  message_id UUID REFERENCES ai_engine_messages(id) ON DELETE CASCADE,
  
  -- פרטי כלי
  tool_name TEXT NOT NULL,
  tool_input JSONB NOT NULL,
  tool_output JSONB,
  
  -- סטטוס
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'success', 'error', 'timeout')),
  error_message TEXT,
  
  -- ביצועים
  execution_time_ms INTEGER,
  retry_count INTEGER DEFAULT 0,
  
  -- זמנים
  called_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- 5. טבלת ניתוחי מנוע (Analytics)
CREATE TABLE IF NOT EXISTS ai_engine_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  engine_id UUID REFERENCES ai_engines(id) ON DELETE CASCADE,
  
  -- תקופה
  period_start TIMESTAMP WITH TIME ZONE NOT NULL,
  period_end TIMESTAMP WITH TIME ZONE NOT NULL,
  period_type TEXT NOT NULL CHECK (period_type IN ('hourly', 'daily', 'weekly', 'monthly')),
  
  -- מדדים
  total_conversations INTEGER DEFAULT 0,
  completed_conversations INTEGER DEFAULT 0,
  abandoned_conversations INTEGER DEFAULT 0,
  handoff_conversations INTEGER DEFAULT 0,
  
  total_messages INTEGER DEFAULT 0,
  user_messages INTEGER DEFAULT 0,
  assistant_messages INTEGER DEFAULT 0,
  
  total_bookings INTEGER DEFAULT 0,
  booking_value DECIMAL(12,2) DEFAULT 0,
  
  -- ביצועים
  avg_response_time_ms INTEGER,
  avg_messages_per_conversation DECIMAL(5,2),
  avg_conversation_duration_sec INTEGER,
  
  -- שביעות רצון
  avg_satisfaction_rating DECIMAL(2,1),
  positive_ratings INTEGER DEFAULT 0,
  negative_ratings INTEGER DEFAULT 0,
  
  -- שימוש בכלים
  tool_calls_count INTEGER DEFAULT 0,
  tool_success_rate DECIMAL(5,2),
  most_used_tools TEXT[] DEFAULT '{}',
  
  -- זמנים
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. טבלת Templates מותאמים אישית
CREATE TABLE IF NOT EXISTS ai_engine_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  name_he TEXT,
  description TEXT,
  description_he TEXT,
  engine_type TEXT NOT NULL,
  
  -- תבנית
  persona TEXT NOT NULL,
  persona_he TEXT,
  system_prompt TEXT,
  system_prompt_he TEXT,
  
  -- הגדרות
  default_llm_provider TEXT DEFAULT 'openai',
  default_model TEXT DEFAULT 'gpt-4o',
  default_temperature DECIMAL(2,1) DEFAULT 0.7,
  
  -- יכולות
  capabilities TEXT[] DEFAULT '{}',
  required_skills TEXT[] DEFAULT '{}',
  optional_skills TEXT[] DEFAULT '{}',
  
  -- נראות
  is_public BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  category TEXT,
  tags TEXT[] DEFAULT '{}',
  
  -- בעלות
  created_by TEXT,
  organization_id TEXT,
  
  -- זמנים
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. טבלת Skills מותאמים
CREATE TABLE IF NOT EXISTS ai_engine_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  skill_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  name_he TEXT,
  description TEXT,
  description_he TEXT,
  category TEXT NOT NULL CHECK (category IN (
    'booking', 'communication', 'research', 
    'analysis', 'automation', 'integration', 'personalization'
  )),
  
  -- כלים
  tools JSONB DEFAULT '[]',
  
  -- הגדרות
  is_enabled BOOLEAN DEFAULT true,
  is_public BOOLEAN DEFAULT false,
  priority INTEGER DEFAULT 5,
  required_permissions TEXT[] DEFAULT '{}',
  
  -- בעלות
  created_by TEXT,
  
  -- זמנים
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- INDEXES
-- ========================================

-- ai_engines indexes
CREATE INDEX IF NOT EXISTS idx_ai_engines_instance_id ON ai_engines(instance_id);
CREATE INDEX IF NOT EXISTS idx_ai_engines_template_id ON ai_engines(template_id);
CREATE INDEX IF NOT EXISTS idx_ai_engines_type ON ai_engines(engine_type);
CREATE INDEX IF NOT EXISTS idx_ai_engines_status ON ai_engines(status);
CREATE INDEX IF NOT EXISTS idx_ai_engines_created_at ON ai_engines(created_at);

-- ai_engine_conversations indexes
CREATE INDEX IF NOT EXISTS idx_ai_conversations_engine_id ON ai_engine_conversations(engine_id);
CREATE INDEX IF NOT EXISTS idx_ai_conversations_user_id ON ai_engine_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_conversations_status ON ai_engine_conversations(status);
CREATE INDEX IF NOT EXISTS idx_ai_conversations_started_at ON ai_engine_conversations(started_at);
CREATE INDEX IF NOT EXISTS idx_ai_conversations_outcome ON ai_engine_conversations(outcome);

-- ai_engine_messages indexes
CREATE INDEX IF NOT EXISTS idx_ai_messages_conversation_id ON ai_engine_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_ai_messages_role ON ai_engine_messages(role);
CREATE INDEX IF NOT EXISTS idx_ai_messages_created_at ON ai_engine_messages(created_at);

-- ai_engine_tool_calls indexes
CREATE INDEX IF NOT EXISTS idx_ai_tool_calls_conversation_id ON ai_engine_tool_calls(conversation_id);
CREATE INDEX IF NOT EXISTS idx_ai_tool_calls_tool_name ON ai_engine_tool_calls(tool_name);
CREATE INDEX IF NOT EXISTS idx_ai_tool_calls_status ON ai_engine_tool_calls(status);

-- ai_engine_analytics indexes
CREATE INDEX IF NOT EXISTS idx_ai_analytics_engine_id ON ai_engine_analytics(engine_id);
CREATE INDEX IF NOT EXISTS idx_ai_analytics_period ON ai_engine_analytics(period_start, period_end);
CREATE INDEX IF NOT EXISTS idx_ai_analytics_period_type ON ai_engine_analytics(period_type);

-- ai_engine_templates indexes
CREATE INDEX IF NOT EXISTS idx_ai_templates_type ON ai_engine_templates(engine_type);
CREATE INDEX IF NOT EXISTS idx_ai_templates_public ON ai_engine_templates(is_public);
CREATE INDEX IF NOT EXISTS idx_ai_templates_category ON ai_engine_templates(category);

-- ai_engine_skills indexes
CREATE INDEX IF NOT EXISTS idx_ai_skills_category ON ai_engine_skills(category);
CREATE INDEX IF NOT EXISTS idx_ai_skills_enabled ON ai_engine_skills(is_enabled);

-- ========================================
-- TRIGGERS
-- ========================================

-- Trigger לעדכון updated_at
CREATE TRIGGER update_ai_engines_updated_at 
BEFORE UPDATE ON ai_engines
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ai_templates_updated_at 
BEFORE UPDATE ON ai_engine_templates
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ai_skills_updated_at 
BEFORE UPDATE ON ai_engine_skills
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- פונקציה לעדכון סטטיסטיקות מנוע
CREATE OR REPLACE FUNCTION update_engine_stats()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE ai_engines 
    SET 
        total_conversations = total_conversations + 1,
        last_active_at = NOW()
    WHERE id = NEW.engine_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_engine_conversation_count
AFTER INSERT ON ai_engine_conversations
FOR EACH ROW EXECUTE FUNCTION update_engine_stats();

-- פונקציה לעדכון message count בשיחה
CREATE OR REPLACE FUNCTION update_conversation_message_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE ai_engine_conversations 
    SET 
        message_count = message_count + 1,
        last_message_at = NOW()
    WHERE id = NEW.conversation_id;
    
    UPDATE ai_engines
    SET total_messages = total_messages + 1
    WHERE id = (SELECT engine_id FROM ai_engine_conversations WHERE id = NEW.conversation_id);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_conversation_messages
AFTER INSERT ON ai_engine_messages
FOR EACH ROW EXECUTE FUNCTION update_conversation_message_count();

-- ========================================
-- ROW LEVEL SECURITY
-- ========================================

-- Enable RLS
ALTER TABLE ai_engines ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_engine_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_engine_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_engine_tool_calls ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_engine_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_engine_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_engine_skills ENABLE ROW LEVEL SECURITY;

-- Admin policies (full access for service role)
CREATE POLICY "Admin full access on ai_engines" ON ai_engines
FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Admin full access on ai_engine_conversations" ON ai_engine_conversations
FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Admin full access on ai_engine_messages" ON ai_engine_messages
FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Admin full access on ai_engine_tool_calls" ON ai_engine_tool_calls
FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Admin full access on ai_engine_analytics" ON ai_engine_analytics
FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Admin full access on ai_engine_templates" ON ai_engine_templates
FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Admin full access on ai_engine_skills" ON ai_engine_skills
FOR ALL USING (auth.role() = 'service_role');

-- Public read for public templates
CREATE POLICY "Public read on public templates" ON ai_engine_templates
FOR SELECT USING (is_public = true);

CREATE POLICY "Public read on public skills" ON ai_engine_skills
FOR SELECT USING (is_public = true);

-- User can read their own conversations
CREATE POLICY "Users read own conversations" ON ai_engine_conversations
FOR SELECT USING (user_id = auth.uid()::text);

CREATE POLICY "Users read own messages" ON ai_engine_messages
FOR SELECT USING (
    conversation_id IN (
        SELECT id FROM ai_engine_conversations WHERE user_id = auth.uid()::text
    )
);

-- ========================================
-- SEED DATA
-- ========================================

-- Insert default engine templates
INSERT INTO ai_engine_templates (
  template_id, name, name_he, description, description_he, 
  engine_type, persona, persona_he, capabilities, required_skills
) VALUES 
(
  'hotel-booking-agent',
  'Hotel Booking Agent',
  'סוכן הזמנות מלונות',
  'AI-powered assistant for searching and booking hotels',
  'עוזר AI לחיפוש והזמנת מלונות',
  'hotel-booking',
  'You are a professional hotel booking assistant. Help users find and book the perfect hotel.',
  'אתה עוזר מקצועי להזמנת מלונות. עזור למשתמשים למצוא ולהזמין את המלון המושלם.',
  ARRAY['search', 'booking', 'prebook', 'cancellation', 'multi-language'],
  ARRAY['hotel-search', 'booking-management', 'price-comparison']
),
(
  'travel-concierge',
  'Travel Concierge',
  'קונסיירז׳ נסיעות',
  'Full-service travel planning and booking assistant',
  'עוזר מלא לתכנון והזמנת נסיעות',
  'concierge',
  'You are an elite travel concierge. Provide personalized recommendations and handle all travel arrangements.',
  'אתה קונסיירז׳ נסיעות מעולה. ספק המלצות מותאמות אישית וטפל בכל סידורי הנסיעה.',
  ARRAY['search', 'booking', 'knowledge-base', 'multi-language', 'handoff-to-human'],
  ARRAY['hotel-search', 'flight-search', 'activity-booking', 'local-recommendations']
),
(
  'customer-support',
  'Customer Support Agent',
  'נציג תמיכת לקוחות',
  'Handle customer inquiries, booking modifications, and support requests',
  'טיפול בפניות לקוחות, שינויי הזמנות ובקשות תמיכה',
  'custom',
  'You are a helpful customer support agent. Assist customers with their booking inquiries and issues.',
  'אתה נציג תמיכת לקוחות מסור. עזור ללקוחות עם שאלות ובעיות הזמנה.',
  ARRAY['booking', 'cancellation', 'email-integration', 'handoff-to-human'],
  ARRAY['booking-management', 'customer-support']
)
ON CONFLICT (template_id) DO NOTHING;

-- Insert default skills
INSERT INTO ai_engine_skills (
  skill_id, name, name_he, description, description_he, category, is_enabled, is_public
) VALUES
(
  'hotel-search',
  'Hotel Search',
  'חיפוש מלונות',
  'Search for hotels by location, dates, and preferences',
  'חיפוש מלונות לפי מיקום, תאריכים והעדפות',
  'booking',
  true,
  true
),
(
  'booking-management',
  'Booking Management',
  'ניהול הזמנות',
  'Create, modify, and cancel bookings',
  'יצירה, שינוי וביטול הזמנות',
  'booking',
  true,
  true
),
(
  'price-comparison',
  'Price Comparison',
  'השוואת מחירים',
  'Compare prices across different sources',
  'השוואת מחירים ממקורות שונים',
  'analysis',
  true,
  true
),
(
  'local-recommendations',
  'Local Recommendations',
  'המלצות מקומיות',
  'Provide local restaurant, attraction, and activity recommendations',
  'המלצות על מסעדות, אטרקציות ופעילויות מקומיות',
  'research',
  true,
  true
),
(
  'customer-support',
  'Customer Support',
  'תמיכת לקוחות',
  'Handle customer inquiries and support requests',
  'טיפול בפניות לקוחות ובקשות תמיכה',
  'communication',
  true,
  true
)
ON CONFLICT (skill_id) DO NOTHING;

-- ========================================
-- SUCCESS MESSAGE
-- ========================================

DO $$ 
BEGIN
    RAISE NOTICE '✅ AI Engines tables created successfully!';
    RAISE NOTICE 'Tables: ai_engines, ai_engine_conversations, ai_engine_messages, ai_engine_tool_calls, ai_engine_analytics, ai_engine_templates, ai_engine_skills';
END $$;
