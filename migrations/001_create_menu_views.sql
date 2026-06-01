-- ============================================================
-- Migration: Create menu_views analytics table
-- Run this in Supabase SQL Editor
-- ============================================================

CREATE TABLE IF NOT EXISTS public.menu_views (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  outlet_id   uuid NOT NULL REFERENCES public.outlets(id) ON DELETE CASCADE,
  menu_item_id uuid REFERENCES public.menu_items(id) ON DELETE SET NULL,
  viewed_at   timestamptz NOT NULL DEFAULT now(),
  user_agent  text,
  ip_hash     text  -- hashed for privacy
);

-- Index for fast analytics queries
CREATE INDEX IF NOT EXISTS idx_menu_views_outlet_id   ON public.menu_views(outlet_id);
CREATE INDEX IF NOT EXISTS idx_menu_views_viewed_at   ON public.menu_views(viewed_at DESC);
CREATE INDEX IF NOT EXISTS idx_menu_views_menu_item_id ON public.menu_views(menu_item_id);
CREATE INDEX IF NOT EXISTS idx_menu_views_outlet_date  ON public.menu_views(outlet_id, viewed_at DESC);

-- Row Level Security
ALTER TABLE public.menu_views ENABLE ROW LEVEL SECURITY;

-- Owners can only read their own outlet's views
CREATE POLICY "outlet_owner_read_views" ON public.menu_views
  FOR SELECT USING (
    outlet_id IN (
      SELECT id FROM public.outlets WHERE owner_id = auth.uid()
    )
  );

-- Allow anonymous inserts (public menu visitors tracking)
CREATE POLICY "anon_insert_views" ON public.menu_views
  FOR INSERT WITH CHECK (true);

-- ============================================================
-- Helper function: get views per day for last N days
-- ============================================================
CREATE OR REPLACE FUNCTION public.get_views_per_day(
  p_outlet_id uuid,
  p_days      integer DEFAULT 7
)
RETURNS TABLE(view_date date, view_count bigint)
LANGUAGE sql STABLE
AS $$
  SELECT
    date_trunc('day', viewed_at AT TIME ZONE 'Asia/Jakarta')::date AS view_date,
    COUNT(*) AS view_count
  FROM public.menu_views
  WHERE
    outlet_id = p_outlet_id
    AND viewed_at >= now() - make_interval(days => p_days)
  GROUP BY 1
  ORDER BY 1 ASC;
$$;
