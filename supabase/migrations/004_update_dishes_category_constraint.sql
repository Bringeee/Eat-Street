-- Align dishes.category with the app's actual category list.
-- This removes the old four-category constraint that was blocking inserts.

ALTER TABLE dishes
  DROP CONSTRAINT IF EXISTS dishes_category_check;

-- Normalize legacy rows so the new constraint can be added safely.
UPDATE dishes
SET category = CASE
  WHEN category = 'Main Course' THEN 'Veg Main-Course'
  WHEN category = 'Desserts' THEN 'Side Orders'
  WHEN category = 'Beverages' THEN 'Side Orders'
  ELSE category
END;

-- Fallback any other unexpected legacy values to a valid category.
UPDATE dishes
SET category = 'Veg Main-Course'
WHERE category NOT IN (
  'Veg Main-Course',
  'Starters',
  'Breads',
  'Fast Food & Chinese',
  'Special Thali',
  'Rice',
  'Salad/Papad',
  'Non-Veg Snacks',
  'Non-Veg Curry',
  'Special Biryani',
  'Side Orders'
);

ALTER TABLE dishes
  ADD CONSTRAINT dishes_category_check
  CHECK (
    category IN (
      'Veg Main-Course',
      'Starters',
      'Breads',
      'Fast Food & Chinese',
      'Special Thali',
      'Rice',
      'Salad/Papad',
      'Non-Veg Snacks',
      'Non-Veg Curry',
      'Special Biryani',
      'Side Orders'
    )
  );