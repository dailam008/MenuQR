-- ================================================
-- BAGIAN 6 & 8 — UPGRADE & CRON LOGS (003_create_upgrade_logs.sql)
-- ================================================

-- Create upgrade_logs table if not exists
CREATE TABLE IF NOT EXISTS public.upgrade_logs (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  notified_at  timestamptz DEFAULT now() NOT NULL,
  status       varchar(50) DEFAULT 'pending' NOT NULL, -- 'pending', 'activated'
  created_at   timestamptz DEFAULT now() NOT NULL
);

-- Add custom_domain to outlets table if not exists
ALTER TABLE public.outlets ADD COLUMN IF NOT EXISTS custom_domain varchar(255);

-- Create cron_logs table if not exists
CREATE TABLE IF NOT EXISTS public.cron_logs (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  run_at          timestamptz DEFAULT now() NOT NULL,
  cron_name       varchar(100) NOT NULL, -- 'reminder_h7', 'auto_downgrade'
  users_affected  integer DEFAULT 0 NOT NULL,
  status          varchar(50) NOT NULL, -- 'success', 'failed'
  log_message     text,
  created_at      timestamptz DEFAULT now() NOT NULL
);

-- Enable RLS on both tables
ALTER TABLE public.upgrade_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cron_logs ENABLE ROW LEVEL SECURITY;

-- Allow read-only access for logging owner, or restrict to service role
CREATE POLICY "Users can view their own upgrade logs"
  ON public.upgrade_logs FOR SELECT
  USING (auth.uid() = user_id);

-- Rollback SQL:
/*
DROP TABLE IF EXISTS public.cron_logs CASCADE;
DROP TABLE IF EXISTS public.upgrade_logs CASCADE;
*/
