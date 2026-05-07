# Dual Pricing Setup Guide - Half Plate & Full Plate

This guide will help you set up dual pricing in Supabase for dishes that offer both Half Plate and Full Plate options.

## Step 1: Add Dual Pricing Columns to Supabase

Go to your **Supabase Dashboard** → **SQL Editor** → **New Query**

Copy and paste this SQL:

```sql
-- Add dual pricing columns to dishes table
ALTER TABLE dishes
ADD COLUMN has_dual_pricing BOOLEAN DEFAULT FALSE,
ADD COLUMN half_plate_price BIGINT,
ADD COLUMN full_plate_price BIGINT;

-- Add constraints to ensure prices are positive when set
ALTER TABLE dishes
ADD CONSTRAINT half_plate_price_positive CHECK (half_plate_price IS NULL OR half_plate_price > 0),
ADD CONSTRAINT full_plate_price_positive CHECK (full_plate_price IS NULL OR full_plate_price > 0);

-- If you want to migrate existing dual-priced dishes, run this:
-- UPDATE dishes SET has_dual_pricing = TRUE WHERE id IN (SELECT id FROM dishes WHERE half_plate_price IS NOT NULL);
```

Click **Run** to execute.

## Step 2: Update Database Service

Update the file `src/lib/database-service.ts`

Find the section where you create dishes and update it to include dual pricing columns:

```typescript
export const dishesService = {
  async createDish(data: any) {
    const { data: dish, error } = await supabase
      .from('dishes')
      .insert([{
        name: data.name,
        description: data.description,
        price: data.price,
        category: data.category,
        image_url: data.image_url,
        is_available: data.is_available,
        has_dual_pricing: data.has_dual_pricing || false,
        half_plate_price: data.half_plate_price || null,
        full_plate_price: data.full_plate_price || null,
      }])
      .select()
      .single();

    if (error) throw error;
    return dish;
  },

  async updateDish(dishId: string, data: any) {
    const { data: dish, error } = await supabase
      .from('dishes')
      .update({
        name: data.name,
        description: data.description,
        price: data.price,
        category: data.category,
        image_url: data.image_url,
        is_available: data.is_available,
        has_dual_pricing: data.has_dual_pricing,
        half_plate_price: data.half_plate_price || null,
        full_plate_price: data.full_plate_price || null,
      })
      .eq('id', dishId)
      .select()
      .single();

    if (error) throw error;
    return dish;
  },

  // ... rest of the service
};
```

## Step 3: Update Admin Form

The admin form in `/admin` page already has dual pricing fields. When saving, pass these values:

**In `src/routes/admin.tsx`, update the form submission:**

```typescript
// When creating a new dish:
const newDish = await dishesService.createDish({
  name: d.name,
  description: d.description,
  price: d.hasDualPricing ? null : convertToPaise(d.price),
  category: d.category,
  image_url: null,
  is_available: true,
  has_dual_pricing: d.hasDualPricing,
  half_plate_price: d.hasDualPricing ? convertToPaise(d.halfPrice) : null,
  full_plate_price: d.hasDualPricing ? convertToPaise(d.fullPrice) : null,
});

// When updating:
await dishesService.updateDish(editing.id, {
  name: d.name,
  description: d.description,
  price: d.hasDualPricing ? null : convertToPaise(d.price),
  category: d.category,
  image_url: d.image || null,
  has_dual_pricing: d.hasDualPricing,
  half_plate_price: d.hasDualPricing ? convertToPaise(d.halfPrice) : null,
  full_plate_price: d.hasDualPricing ? convertToPaise(d.fullPrice) : null,
});
```

## Step 4: Add Variant Dialog (Already Implemented!)

Good news! The variant selection dialog is already in place in `/src/routes/menu.tsx`:

The "Add to Thali" button shows a dialog when a dish has dual pricing:
- User clicks "Add to Thali"
- Dialog pops up asking "Choose Size: Half Plate or Full Plate"
- Two buttons show prices for each option
- User selects one and it's added to cart

**Current Implementation Flow:**
```
Menu Item
  ↓
Click "Add to Thali"
  ↓
Check if hasDualPricing is true
  ↓
YES → Show Size Selection Dialog (Half/Full)
NO  → Add directly to cart
```

## Step 5: Example Dishes with Dual Pricing

Here's how to add dual-priced dishes in the admin panel:

1. Click **Add Dish**
2. Fill in:
   - **Name**: "Paneer Tikka Masala"
   - **Description**: "Cottage cheese in tomato-cream gravy"
   - **Category**: "Veg Main-Course"
   - **Check**: "Enable Dual Pricing (Half & Full)"
   - **Half Plate Price**: 250 (INR)
   - **Full Plate Price**: 400 (INR)
3. Click Save

The dish will be saved to Supabase with both prices.

## Step 6: Display Dual Pricing in Menu

Dishes with dual pricing already show both prices in the menu:

**Current Display:**
```
Paneer Tikka Masala
₹250 / ₹400  ← Shows both half and full prices
Cottage cheese in tomato-cream gravy
[Add to Thali]  ← Opens size selection dialog
```

## Database Schema After Setup

```sql
dishes table:
- id (UUID)
- name (VARCHAR)
- description (TEXT)
- price (BIGINT) - NULL if dual pricing
- category (VARCHAR)
- image_url (TEXT)
- is_available (BOOLEAN)
- has_dual_pricing (BOOLEAN) ← NEW
- half_plate_price (BIGINT) ← NEW
- full_plate_price (BIGINT) ← NEW
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

## How It Works - Order Flow

1. **User selects a dish with dual pricing**
   - Sees: "₹250 / ₹400"

2. **User clicks "Add to Thali"**
   - Dialog pops up: "Choose Size"
   - "Half Plate - ₹250" button
   - "Full Plate - ₹400" button

3. **User selects size**
   - Item added to cart with:
     - `name: "Paneer Tikka Masala (Half Plate)"`
     - `price: 25000` (paise)
   - Or:
     - `name: "Paneer Tikka Masala (Full Plate)"`
     - `price: 40000` (paise)

4. **Cart shows full names**
   - "Paneer Tikka Masala (Half Plate) - ₹250"

## Summary of Changes Needed

### Supabase Side (Backend)
✅ Add columns to dishes table
✅ Add constraints for prices

### Code Side (Frontend)
✅ Update database-service.ts (createDish & updateDish methods)
✅ Update admin.tsx form submission
✅ Dialog already exists in menu.tsx ✓

## Testing

1. Add a dish with dual pricing in admin panel
2. Go to categories/menu page
3. Find the dual-priced dish
4. Click "Add to Thali"
5. Dialog should appear asking for size
6. Select Half or Full Plate
7. Item should be added to cart with correct price and size label

## Troubleshooting

**Issue**: Dialog not appearing when clicking "Add to Thali"
- **Solution**: Check that `hasDualPricing` is being saved correctly in Supabase

**Issue**: Price shows as 0
- **Solution**: Make sure prices are in INR (not paise) in the admin form, they're converted to paise before saving

**Issue**: Can't see dual pricing fields in admin form
- **Solution**: They're already there! Look for the checkbox "Enable Dual Pricing (Half & Full)"

## Next Steps

1. Run the SQL migration in Supabase
2. Update the database-service.ts file
3. Update the admin.tsx form submission code
4. Test by adding a dual-priced dish
5. Order it from the menu and select Half/Full plate
