-- Replace restrictive storage upload policies with public ones for the anon-key frontend.
-- Run this in the Supabase SQL editor as the project owner.

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_tables WHERE schemaname = 'storage' AND tablename = 'objects'
  ) THEN
    BEGIN
      DROP POLICY IF EXISTS "Allow public insert to dish-images" ON storage.objects;
      DROP POLICY IF EXISTS "Allow public update to dish-images" ON storage.objects;
      DROP POLICY IF EXISTS "Allow public delete from dish-images" ON storage.objects;
    EXCEPTION
      WHEN insufficient_privilege THEN
        RAISE NOTICE 'Skipping policy drop because current role is not owner of storage.objects';
    END;

    CREATE POLICY "Allow public insert to dish-images" ON storage.objects
      FOR INSERT
      TO public
      WITH CHECK (bucket_id = 'dish-images');

    CREATE POLICY "Allow public update to dish-images" ON storage.objects
      FOR UPDATE
      TO public
      USING (bucket_id = 'dish-images')
      WITH CHECK (bucket_id = 'dish-images');

    CREATE POLICY "Allow public delete from dish-images" ON storage.objects
      FOR DELETE
      TO public
      USING (bucket_id = 'dish-images');
  END IF;
END
$$;
