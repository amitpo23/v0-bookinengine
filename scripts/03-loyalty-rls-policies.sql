-- ==================================================
-- Row Level Security (RLS) Policies
-- ==================================================

-- הפעלת RLS על כל הטבלאות
ALTER TABLE loyalty_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE loyalty_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE loyalty_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE loyalty_reward_redemptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Policies למועדון לקוחות
-- חברי מועדון - רק המשתמש עצמו יכול לראות את הפרטים שלו
CREATE POLICY "Users can view own member data"
  ON loyalty_members FOR SELECT
  USING (auth.jwt() ->> 'email' = email);

CREATE POLICY "Users can update own member data"
  ON loyalty_members FOR UPDATE
  USING (auth.jwt() ->> 'email' = email);

-- טרנזקציות - רק למשתמש עצמו
CREATE POLICY "Users can view own transactions"
  ON loyalty_transactions FOR SELECT
  USING (member_id IN (SELECT id FROM loyalty_members WHERE email = auth.jwt() ->> 'email'));

-- הנחות - כולם יכולים לראות
CREATE POLICY "Anyone can view active rewards"
  ON loyalty_rewards FOR SELECT
  USING (is_active = true);

-- שימוש בהנחות - רק למשתמש עצמו
CREATE POLICY "Users can view own redemptions"
  ON loyalty_reward_redemptions FOR SELECT
  USING (member_id IN (SELECT id FROM loyalty_members WHERE email = auth.jwt() ->> 'email'));

CREATE POLICY "Users can redeem rewards"
  ON loyalty_reward_redemptions FOR INSERT
  WITH CHECK (member_id IN (SELECT id FROM loyalty_members WHERE email = auth.jwt() ->> 'email'));

-- שיחות - רק למשתמש עצמו
CREATE POLICY "Users can view own chat sessions"
  ON chat_sessions FOR SELECT
  USING (user_id = auth.jwt() ->> 'sub' OR member_id IN (SELECT id FROM loyalty_members WHERE email = auth.jwt() ->> 'email'));

CREATE POLICY "Users can create chat sessions"
  ON chat_sessions FOR INSERT
  WITH CHECK (user_id = auth.jwt() ->> 'sub');

-- הודעות - רק למשתמש עצמו
CREATE POLICY "Users can view own messages"
  ON chat_messages FOR SELECT
  USING (session_id IN (SELECT id FROM chat_sessions WHERE user_id = auth.jwt() ->> 'sub'));

CREATE POLICY "Users can create messages"
  ON chat_messages FOR INSERT
  WITH CHECK (session_id IN (SELECT id FROM chat_sessions WHERE user_id = auth.jwt() ->> 'sub'));

-- הצלחה!
DO $$ 
BEGIN
    RAISE NOTICE 'RLS policies created successfully!';
END $$;
