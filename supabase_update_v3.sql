-- Script de mise à jour v3 : Collaboration Familiale Avancée
-- À exécuter dans l'éditeur SQL de Supabase

-- 1. Table des Foyers
CREATE TABLE IF NOT EXISTS households (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  name TEXT NOT NULL,
  invite_code TEXT UNIQUE NOT NULL DEFAULT substring(gen_random_uuid()::text, 1, 8)
);

-- 2. Table des Profils Utilisateurs (liée à auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  email TEXT NOT NULL,
  username TEXT,
  avatar_url TEXT,
  household_id UUID REFERENCES households(id) ON DELETE SET NULL
);

-- 3. Mise à jour des tables existantes pour inclure household_id
-- On ajoute la colonne household_id aux tables principales
ALTER TABLE expenses ADD COLUMN IF NOT EXISTS household_id UUID REFERENCES households(id) ON DELETE CASCADE;
ALTER TABLE bills ADD COLUMN IF NOT EXISTS household_id UUID REFERENCES households(id) ON DELETE CASCADE;
ALTER TABLE savings ADD COLUMN IF NOT EXISTS household_id UUID REFERENCES households(id) ON DELETE CASCADE;
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS household_id UUID REFERENCES households(id) ON DELETE CASCADE;

-- 4. Triggers pour création automatique du profil après inscription
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Supprimer le trigger s'il existe déjà pour éviter les erreurs
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 5. RLS (Row Level Security) - Mise à jour pour filtrer par household_id
-- Note: Pour que cela fonctionne, l'utilisateur doit être connecté et avoir un household_id
-- Pour l'instant, on laisse les politiques anon mais on prépare le terrain pour le filtrage réel dans l'App.

-- Exemple de politique sécurisée (à activer plus tard si besoin de sécurité stricte) :
-- CREATE POLICY "Utilisateurs peuvent voir les dépenses de leur foyer" ON expenses
-- FOR SELECT USING (household_id IN (SELECT household_id FROM profiles WHERE id = auth.uid()));
