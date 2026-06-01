-- ============================================
-- MenuQR — Supabase Database Schema
-- Jalankan ini di Supabase SQL Editor
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── OUTLETS ───────────────────────────────
CREATE TABLE outlets (
  id          uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id    uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name        text NOT NULL,
  slug        text NOT NULL UNIQUE,
  address     text,
  description text,
  logo_url    text,
  is_active   boolean DEFAULT true NOT NULL,
  created_at  timestamptz DEFAULT now() NOT NULL,
  updated_at  timestamptz DEFAULT now() NOT NULL
);

-- ─── CATEGORIES ────────────────────────────
CREATE TABLE categories (
  id          uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  outlet_id   uuid REFERENCES outlets(id) ON DELETE CASCADE NOT NULL,
  name        text NOT NULL,
  sort_order  integer DEFAULT 0 NOT NULL,
  created_at  timestamptz DEFAULT now() NOT NULL
);

-- ─── MENU ITEMS ────────────────────────────
CREATE TABLE menu_items (
  id           uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  outlet_id    uuid REFERENCES outlets(id) ON DELETE CASCADE NOT NULL,
  category_id  uuid REFERENCES categories(id) ON DELETE SET NULL,
  name         text NOT NULL,
  description  text,
  price        integer NOT NULL CHECK (price >= 0),
  image_url    text,
  is_available boolean DEFAULT true NOT NULL,
  sort_order   integer DEFAULT 0 NOT NULL,
  created_at   timestamptz DEFAULT now() NOT NULL,
  updated_at   timestamptz DEFAULT now() NOT NULL
);

-- ─── INDEXES ───────────────────────────────
CREATE INDEX idx_outlets_owner_id   ON outlets(owner_id);
CREATE INDEX idx_outlets_slug       ON outlets(slug);
CREATE INDEX idx_categories_outlet  ON categories(outlet_id);
CREATE INDEX idx_menu_items_outlet  ON menu_items(outlet_id);
CREATE INDEX idx_menu_items_cat     ON menu_items(category_id);

-- ─── ROW LEVEL SECURITY ────────────────────

-- OUTLETS
ALTER TABLE outlets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owner can manage their outlets"
  ON outlets FOR ALL
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Anyone can read active outlets"
  ON outlets FOR SELECT
  USING (is_active = true);

-- CATEGORIES
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owner can manage categories"
  ON categories FOR ALL
  USING (
    outlet_id IN (SELECT id FROM outlets WHERE owner_id = auth.uid())
  )
  WITH CHECK (
    outlet_id IN (SELECT id FROM outlets WHERE owner_id = auth.uid())
  );

CREATE POLICY "Anyone can read categories"
  ON categories FOR SELECT
  USING (true);

-- MENU ITEMS
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owner can manage menu items"
  ON menu_items FOR ALL
  USING (
    outlet_id IN (SELECT id FROM outlets WHERE owner_id = auth.uid())
  )
  WITH CHECK (
    outlet_id IN (SELECT id FROM outlets WHERE owner_id = auth.uid())
  );

CREATE POLICY "Anyone can read menu items"
  ON menu_items FOR SELECT
  USING (true);

-- ─── STORAGE BUCKET ────────────────────────
-- Jalankan ini di Supabase Dashboard → Storage → New Bucket
-- Nama bucket: menu-images
-- Visibility: Public

-- Storage policies (jalankan di SQL Editor):
INSERT INTO storage.buckets (id, name, public)
VALUES ('menu-images', 'menu-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Authenticated users can upload images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'menu-images');

CREATE POLICY "Anyone can view images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'menu-images');

CREATE POLICY "Owner can update/delete their images"
  ON storage.objects FOR ALL
  TO authenticated
  USING (bucket_id = 'menu-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- ─── UPDATE TRIGGER ─────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER outlets_updated_at
  BEFORE UPDATE ON outlets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER menu_items_updated_at
  BEFORE UPDATE ON menu_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
