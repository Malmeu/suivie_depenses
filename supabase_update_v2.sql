-- Script de mise à jour v2 : Abonnements
-- À exécuter dans l'éditeur SQL de Supabase

-- 1. Création de la table des abonnements
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  title TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  category TEXT NOT NULL DEFAULT 'bills',
  billing_day INTEGER NOT NULL CHECK (billing_day >= 1 AND billing_day <= 31),
  active BOOLEAN DEFAULT true
);

-- 2. Activation de la sécurité RLS
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- 3. Création des politiques d'accès
-- Note: Si vous avez déjà créé ces politiques, ignorez les erreurs "already exists"
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow anon select' AND tablename = 'subscriptions') THEN
        CREATE POLICY "Allow anon select" ON subscriptions FOR SELECT USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow anon insert' AND tablename = 'subscriptions') THEN
        CREATE POLICY "Allow anon insert" ON subscriptions FOR INSERT WITH CHECK (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow anon update' AND tablename = 'subscriptions') THEN
        CREATE POLICY "Allow anon update" ON subscriptions FOR UPDATE USING (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow anon delete' AND tablename = 'subscriptions') THEN
        CREATE POLICY "Allow anon delete" ON subscriptions FOR DELETE USING (true);
    END IF;
END $$;
