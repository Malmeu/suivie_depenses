-- Script de mise à jour v4 : Sécurité des Profils et Foyers
-- À exécuter dans l'éditeur SQL de Supabase

-- 1. Activation RLS pour les profils et foyers
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.households ENABLE ROW LEVEL SECURITY;

-- 2. Politiques pour les Profils
-- Permettre aux utilisateurs de voir leur propre profil
CREATE POLICY "Users can view own profile" ON public.profiles
FOR SELECT USING (auth.uid() = id);

-- Permettre aux utilisateurs de mettre à jour leur propre profil
CREATE POLICY "Users can update own profile" ON public.profiles
FOR UPDATE USING (auth.uid() = id);

-- 3. Politiques pour les Foyers
-- Permettre aux utilisateurs connectés de créer un foyer
CREATE POLICY "Authenticated users can create households" ON public.households
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Permettre de voir les détails d'un foyer (pour rejoindre via code)
CREATE POLICY "Anyone can view household details" ON public.households
FOR SELECT USING (true);

-- 4. Politiques de filtrage par foyer pour les données
-- On met à jour les politiques existantes pour s'assurer qu'un utilisateur ne voit QUE les données de son foyer actuel

CREATE OR REPLACE FUNCTION get_user_household() 
RETURNS uuid AS $$
  SELECT household_id FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER;

-- Note: Ces politiques écrasent les précédentes pour plus de sécurité
DROP POLICY IF EXISTS "Allow anon select" ON expenses;
CREATE POLICY "Expenses: select by household" ON expenses FOR SELECT USING (household_id = get_user_household());

DROP POLICY IF EXISTS "Allow anon insert" ON expenses;
CREATE POLICY "Expenses: insert by household" ON expenses FOR INSERT WITH CHECK (household_id = get_user_household());

-- Idem pour les autres tables si nécessaire
