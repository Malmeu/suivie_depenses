-- Create tables for Expense Tracker app

-- Expenses Table
CREATE TABLE IF NOT EXISTS expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  title TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  category TEXT NOT NULL,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('expense', 'income'))
);

-- Bills Table
CREATE TABLE IF NOT EXISTS bills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  title TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  due_date DATE NOT NULL,
  paid BOOLEAN DEFAULT false
);

-- Savings Table (assuming one household goal for now)
CREATE TABLE IF NOT EXISTS savings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  title TEXT NOT NULL DEFAULT 'Nouvel Objectif',
  current NUMERIC NOT NULL DEFAULT 0,
  goal NUMERIC NOT NULL DEFAULT 0
);

-- Add one initial row for savings if it doesn't exist
INSERT INTO savings (id, title, current, goal)
VALUES (1, 'Mon Objectif', 0, 0)
ON CONFLICT (id) DO NOTHING;

-- Enable Row Level Security (RLS)
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE bills ENABLE ROW LEVEL SECURITY;
ALTER TABLE savings ENABLE ROW LEVEL SECURITY;

-- Create policies (Allowing anon access for now as requested with anon key)
CREATE POLICY "Allow anon select" ON expenses FOR SELECT USING (true);
CREATE POLICY "Allow anon insert" ON expenses FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon update" ON expenses FOR UPDATE USING (true);
CREATE POLICY "Allow anon delete" ON expenses FOR DELETE USING (true);

CREATE POLICY "Allow anon select" ON bills FOR SELECT USING (true);
CREATE POLICY "Allow anon insert" ON bills FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon update" ON bills FOR UPDATE USING (true);
CREATE POLICY "Allow anon delete" ON bills FOR DELETE USING (true);

CREATE POLICY "Allow anon select" ON savings FOR SELECT USING (true);
CREATE POLICY "Allow anon update" ON savings FOR UPDATE USING (true);

-- Subscriptions Table
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  title TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  category TEXT NOT NULL,
  billing_day INTEGER NOT NULL CHECK (billing_day >= 1 AND billing_day <= 31),
  active BOOLEAN DEFAULT true
);

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow anon select" ON subscriptions FOR SELECT USING (true);
CREATE POLICY "Allow anon insert" ON subscriptions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon update" ON subscriptions FOR UPDATE USING (true);
CREATE POLICY "Allow anon delete" ON subscriptions FOR DELETE USING (true);
