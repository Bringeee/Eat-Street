-- Fix RLS for browser-side Supabase access used by the current app
-- This project uses the anon key from the frontend, so writes must be allowed
-- until Supabase Auth or a backend API is introduced.

-- Ensure the dish_photos table exists before applying policies.
CREATE TABLE IF NOT EXISTS dish_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dish_id UUID NOT NULL REFERENCES dishes(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL UNIQUE,
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

-- Ensure dishes table can be written from the app
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'dishes'
      AND policyname = 'Allow public insert on dishes'
  ) THEN
    DROP POLICY "Allow public insert on dishes" ON dishes;
  END IF;
END
$$;

CREATE POLICY "Allow public insert on dishes" ON dishes
  FOR INSERT
  TO anon
  WITH CHECK (true);

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'dishes'
      AND policyname = 'Allow public update on dishes'
  ) THEN
    DROP POLICY "Allow public update on dishes" ON dishes;
  END IF;
END
$$;

CREATE POLICY "Allow public update on dishes" ON dishes
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'dishes'
      AND policyname = 'Allow public delete on dishes'
  ) THEN
    DROP POLICY "Allow public delete on dishes" ON dishes;
  END IF;
END
$$;

CREATE POLICY "Allow public delete on dishes" ON dishes
  FOR DELETE
  TO anon
  USING (true);

-- Keep dish_photos readable and writable from the app
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'dish_photos'
      AND policyname = 'Allow public insert on dish_photos'
  ) THEN
    DROP POLICY "Allow public insert on dish_photos" ON dish_photos;
  END IF;
END
$$;

CREATE POLICY "Allow public insert on dish_photos" ON dish_photos
  FOR INSERT
  TO anon
  WITH CHECK (true);

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'dish_photos'
      AND policyname = 'Allow public update on dish_photos'
  ) THEN
    DROP POLICY "Allow public update on dish_photos" ON dish_photos;
  END IF;
END
$$;

CREATE POLICY "Allow public update on dish_photos" ON dish_photos
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'dish_photos'
      AND policyname = 'Allow public delete on dish_photos'
  ) THEN
    DROP POLICY "Allow public delete on dish_photos" ON dish_photos;
  END IF;
END
$$;

CREATE POLICY "Allow public delete on dish_photos" ON dish_photos
  FOR DELETE
  TO anon
  USING (true);

-- Allow anonymous browser uploads to the dish-images bucket
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname = 'Allow public upload to dish-images'
  ) THEN
    CREATE POLICY "Allow public upload to dish-images" ON storage.objects
      FOR INSERT
      TO anon
      WITH CHECK (bucket_id = 'dish-images');
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname = 'Allow public update to dish-images'
  ) THEN
    CREATE POLICY "Allow public update to dish-images" ON storage.objects
      FOR UPDATE
      TO anon
      USING (bucket_id = 'dish-images')
      WITH CHECK (bucket_id = 'dish-images');
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname = 'Allow public delete from dish-images'
  ) THEN
    CREATE POLICY "Allow public delete from dish-images" ON storage.objects
      FOR DELETE
      TO anon
      USING (bucket_id = 'dish-images');
  END IF;
END
$$;
