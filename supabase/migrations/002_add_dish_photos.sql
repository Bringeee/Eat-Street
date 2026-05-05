-- Upgrade migration: add optimized photo metadata table for dish images
-- Safe for projects where 001_create_tables.sql was already executed

CREATE TABLE IF NOT EXISTS dish_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dish_id UUID NOT NULL REFERENCES dishes(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL UNIQUE, -- e.g. dishes/<dish-id>-<timestamp>.jpg
  public_url TEXT,
  mime_type VARCHAR(100) CHECK (mime_type IS NULL OR mime_type LIKE 'image/%'),
  file_size_bytes INTEGER CHECK (file_size_bytes IS NULL OR file_size_bytes > 0),
  width INTEGER CHECK (width IS NULL OR width > 0),
  height INTEGER CHECK (height IS NULL OR height > 0),
  is_primary BOOLEAN DEFAULT FALSE,
  sort_order SMALLINT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_dish_photos_dish_id ON dish_photos(dish_id);
CREATE INDEX IF NOT EXISTS idx_dish_photos_sort ON dish_photos(dish_id, sort_order, created_at DESC);
CREATE UNIQUE INDEX IF NOT EXISTS idx_dish_photos_one_primary
  ON dish_photos(dish_id)
  WHERE is_primary = TRUE;

ALTER TABLE dish_photos ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'dish_photos'
      AND policyname = 'Allow public read on dish_photos'
  ) THEN
    CREATE POLICY "Allow public read on dish_photos" ON dish_photos
      FOR SELECT
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'dish_photos'
      AND policyname = 'Allow authenticated insert on dish_photos'
  ) THEN
    CREATE POLICY "Allow authenticated insert on dish_photos" ON dish_photos
      FOR INSERT
      TO authenticated
      WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'dish_photos'
      AND policyname = 'Allow authenticated update on dish_photos'
  ) THEN
    CREATE POLICY "Allow authenticated update on dish_photos" ON dish_photos
      FOR UPDATE
      TO authenticated
      USING (true)
      WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'dish_photos'
      AND policyname = 'Allow authenticated delete on dish_photos'
  ) THEN
    CREATE POLICY "Allow authenticated delete on dish_photos" ON dish_photos
      FOR DELETE
      TO authenticated
      USING (true);
  END IF;
END
$$;