-- Migration 006: change price and total_price columns to bigint to avoid overflow
-- Idempotent: safe to run multiple times

DO $$
BEGIN
  -- Change dishes.price to bigint if not already
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'dishes'
      AND column_name = 'price'
      AND data_type <> 'bigint'
  ) THEN
    ALTER TABLE public.dishes
      ALTER COLUMN price TYPE bigint USING price::bigint;
  END IF;

  -- Change orders.total_price to bigint if not already
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'orders'
      AND column_name = 'total_price'
      AND data_type <> 'bigint'
  ) THEN
    ALTER TABLE public.orders
      ALTER COLUMN total_price TYPE bigint USING total_price::bigint;
  END IF;
END
$$;
