-- ==================================================
-- נתוני דוגמה למערכת מועדון לקוחות
-- ==================================================

-- נתוני דוגמה להנחות
INSERT INTO loyalty_rewards (name, name_he, description, description_he, discount_type, discount_value, points_required, min_tier, is_active)
VALUES 
  ('10% Discount', 'הנחה 10%', 'Get 10% off your next booking', 'קבל 10% הנחה על ההזמנה הבאה', 'percentage', 10, 100, 'bronze', true),
  ('Free Upgrade', 'שדרוג חינם', 'Free room upgrade', 'שדרוג חדר חינם', 'points', 0, 500, 'silver', true),
  ('50 ILS Off', '50 ₪ הנחה', 'Save 50 ILS on booking', 'חסוך 50 שקל על ההזמנה', 'fixed_amount', 50, 200, 'bronze', true),
  ('20% Off Weekends', 'הנחה 20% בסופ"ש', 'Get 20% off weekend bookings', 'קבל 20% הנחה על הזמנות בסופי שבוע', 'percentage', 20, 300, 'silver', true),
  ('100 ILS Off', '100 ₪ הנחה', 'Save 100 ILS on your booking', 'חסוך 100 שקל על ההזמנה שלך', 'fixed_amount', 100, 500, 'gold', true),
  ('Free Night', 'לילה חינם', 'Get a free night stay', 'קבל לילה חינם', 'points', 0, 1000, 'platinum', true)
ON CONFLICT DO NOTHING;

-- חבר מועדון לדוגמה
INSERT INTO loyalty_members (email, first_name, last_name, phone, total_points, tier, total_bookings, total_spent)
VALUES 
  ('demo@example.com', 'דני', 'כהן', '050-1234567', 250, 'silver', 5, 2500.00)
ON CONFLICT (email) DO NOTHING;

-- הצלחה!
DO $$ 
BEGIN
    RAISE NOTICE 'Seed data inserted successfully!';
END $$;
