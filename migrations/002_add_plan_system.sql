-- ================================================
-- BAGIAN 1 — DATABASE MIGRATION (002_add_plan_system.sql)
-- ================================================

-- Create custom enum type for plans
CREATE TYPE plan_type AS ENUM ('free', 'pro');

-- Create public.users table linked to auth.users
CREATE TABLE IF NOT EXISTS public.users (
  id              uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email           text,
  plan            plan_type DEFAULT 'free' NOT NULL,
  pro_started_at  timestamptz,
  pro_expired_at  timestamptz,
  payment_ref     varchar(255),
  created_at      timestamptz DEFAULT now() NOT NULL,
  updated_at      timestamptz DEFAULT now() NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own profile"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Create trigger function to auto-create user record in public.users on auth signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, plan)
  VALUES (new.id, new.email, 'free');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Seed existing users from auth.users into public.users
INSERT INTO public.users (id, email, plan)
SELECT id, email, 'free'::plan_type FROM auth.users
ON CONFLICT (id) DO NOTHING;

-- TRIGGER FOR UPDATED_AT UPDATE
CREATE OR REPLACE TRIGGER users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ================================================
-- ROLLBACK SQL
-- ================================================
/*
DROP TRIGGER IF EXISTS users_updated_at ON public.users;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP TABLE IF EXISTS public.users CASCADE;
DROP TYPE IF EXISTS plan_type CASCADE;
*/
