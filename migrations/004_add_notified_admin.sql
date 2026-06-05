-- Tambah kolom notified_admin ke tabel upgrade_logs
ALTER TABLE public.upgrade_logs 
ADD COLUMN notified_admin BOOLEAN DEFAULT false;
