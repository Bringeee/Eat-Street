-- Ensure storage.objects has RLS enabled and policies for the public bucket
-- Idempotent: safe to run multiple times

-- Enable RLS on storage.objects if not already enabled
ALTER TABLE IF EXISTS storage.objects
  ENABLE ROW LEVEL SECURITY;

-- Create/replace policies that allow anonymous browser uploads to the configured bucket
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_tables WHERE schemaname = 'storage' AND tablename = 'objects'
  ) THEN

    -- Insert policy
    IF NOT EXISTS (
      SELECT 1
      FROM pg_policies
      WHERE schemaname = 'storage'
        AND tablename = 'objects'
        AND policyname = 'Allow public insert to dish-images'
    ) THEN
      CREATE POLICY "Allow public insert to dish-images" ON storage.objects
        FOR INSERT
        TO anon
        WITH CHECK (bucket_id = 'dish-images');
    END IF;

    -- Update policy
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

    -- Delete policy
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

  END IF;
END
$$;
