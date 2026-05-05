-- SQL Migration for Eat Street Restaurant Database
-- Run this in Supabase SQL Editor to create the required tables

-- ============================================
-- 1. DISHES TABLE
-- ============================================
CREATE TABLE dishes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  price INTEGER NOT NULL, -- Price in paise (multiply by 100 for INR)
  category VARCHAR(50) NOT NULL CHECK (category IN ('Starters', 'Main Course', 'Desserts', 'Beverages')),
  image_url TEXT,
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on category for faster queries
CREATE INDEX idx_dishes_category ON dishes(category);
CREATE INDEX idx_dishes_is_available ON dishes(is_available);

-- ============================================
-- 1B. DISH PHOTOS TABLE (Optimized for storage uploads)
-- ============================================
-- Store file metadata and storage path in Postgres.
-- Actual image binaries should be uploaded to Supabase Storage bucket: dish-images.
CREATE TABLE dish_photos (
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

CREATE INDEX idx_dish_photos_dish_id ON dish_photos(dish_id);
CREATE INDEX idx_dish_photos_sort ON dish_photos(dish_id, sort_order, created_at DESC);

-- Enforce max one primary photo per dish
CREATE UNIQUE INDEX idx_dish_photos_one_primary
  ON dish_photos(dish_id)
  WHERE is_primary = TRUE;

-- ============================================
-- 2. ORDERS TABLE
-- ============================================
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(20) NOT NULL,
  items JSONB NOT NULL, -- Array of {dish_id, dish_name, quantity, price}
  total_price INTEGER NOT NULL, -- Price in paise
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for orders
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_orders_customer_email ON orders(customer_email);

-- ============================================
-- 3. ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on dishes table
ALTER TABLE dishes ENABLE ROW LEVEL SECURITY;

-- Enable RLS on dish photos table
ALTER TABLE dish_photos ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read dishes
CREATE POLICY "Allow public read on dishes" ON dishes
  FOR SELECT
  USING (true);

-- Allow anyone to read dish photos
CREATE POLICY "Allow public read on dish_photos" ON dish_photos
  FOR SELECT
  USING (true);

-- Allow authenticated users to manage dish photos
CREATE POLICY "Allow authenticated insert on dish_photos" ON dish_photos
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated update on dish_photos" ON dish_photos
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated delete on dish_photos" ON dish_photos
  FOR DELETE
  TO authenticated
  USING (true);

-- Create auth.users reference if using Supabase Auth
-- For now, we'll use a simple admin check via JWT

-- ============================================
-- 4. FUNCTIONS FOR UPDATED_AT TIMESTAMP
-- ============================================

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE PLPGSQL;

-- Create triggers for updated_at
CREATE TRIGGER update_dishes_updated_at
  BEFORE UPDATE ON dishes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 5. SAMPLE DATA (Optional - Comment out if not needed)
-- ============================================

-- Insert sample dishes
INSERT INTO dishes (name, description, price, category, image_url, is_available)
VALUES
  ('Punjabi Samosa', 'Crispy pastry stuffed with spiced potato & peas, served with tamarind & mint chutneys.', 12000, 'Starters', NULL, true),
  ('Onion Pakora', 'Crisp gram-flour fritters with caramelised onion and ajwain.', 14000, 'Starters', NULL, true),
  ('Paneer Tikka', 'Charcoal-grilled cottage cheese marinated in yogurt and spices.', 28000, 'Starters', NULL, true),
  ('Tandoori Chicken', 'Half spring chicken marinated overnight, kissed by the tandoor.', 38000, 'Starters', NULL, true),
  ('Murgh Makhani', 'Velvety tomato-cream gravy with tandoor-roasted chicken.', 42000, 'Main Course', NULL, true),
  ('Dal Makhani', 'Black lentils slow-cooked overnight with butter and cream.', 32000, 'Main Course', NULL, true),
  ('Hyderabadi Dum Biryani', 'Saffron-laced basmati layered with marinated meat, sealed and slow-cooked.', 46000, 'Main Course', NULL, true),
  ('Palak Paneer', 'Cottage cheese in silky spinach gravy with garlic and cream.', 34000, 'Main Course', NULL, true),
  ('Kashmiri Rogan Josh', 'Tender lamb braised in aromatic Kashmiri spices.', 52000, 'Main Course', NULL, true),
  ('Chole Bhature', 'Spiced chickpea curry with golden puffed bhatura.', 28000, 'Main Course', NULL, true),
  ('Paneer Pasanda', 'Stuffed paneer parcels in a rich saffron-cashew gravy.', 36000, 'Main Course', NULL, true),
  ('Gulab Jamun', 'Warm milk dumplings in cardamom-rose syrup, dusted with pistachio.', 16000, 'Desserts', NULL, true),
  ('Rasmalai', 'Cottage cheese pillows in saffron-cardamom milk.', 18000, 'Desserts', NULL, true),
  ('Kulfi Falooda', 'Rose-scented vermicelli with pistachio kulfi and basil seeds.', 22000, 'Desserts', NULL, true),
  ('Masala Chai', 'Brewed slowly with ginger, cardamom and a whisper of clove.', 8000, 'Beverages', NULL, true),
  ('Mango Lassi', 'Alphonso mango whisked with creamy yogurt and a pinch of cardamom.', 14000, 'Beverages', NULL, true),
  ('Gulab Sharbat', 'Chilled rose syrup cooler with crushed ice and rose petals.', 11000, 'Beverages', NULL, true);
