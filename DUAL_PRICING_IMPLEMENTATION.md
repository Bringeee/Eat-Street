# Dual Pricing Implementation - Step by Step

## 🎯 Overview
This guide walks you through enabling dual pricing (Half Plate / Full Plate) for dishes in Supabase.

---

## STEP 1: Update Supabase Database Schema

### In Supabase Dashboard:
1. Go to **SQL Editor**
2. Click **New Query**
3. Paste this SQL:

```sql
-- Add dual pricing columns to dishes table
ALTER TABLE dishes
ADD COLUMN has_dual_pricing BOOLEAN DEFAULT FALSE,
ADD COLUMN half_plate_price BIGINT,
ADD COLUMN full_plate_price BIGINT;

-- Add constraints
ALTER TABLE dishes
ADD CONSTRAINT half_plate_price_check CHECK (half_plate_price IS NULL OR half_plate_price > 0),
ADD CONSTRAINT full_plate_price_check CHECK (full_plate_price IS NULL OR full_plate_price > 0);
```

4. Click **Run**

✅ **Result**: Your dishes table now has 3 new columns

---

## STEP 2: Update TypeScript Types

**File**: `src/lib/supabase.ts`

Replace the `SupabaseDish` interface:

```typescript
export interface SupabaseDish {
  id: string;
  name: string;
  description: string;
  price: number | null;  // Changed: Can be null if using dual pricing
  category: Category;
  image_url: string | null;
  is_available: boolean;
  has_dual_pricing: boolean;           // NEW
  half_plate_price: number | null;     // NEW
  full_plate_price: number | null;     // NEW
  created_at: string;
  updated_at: string;
}
```

✅ **Result**: TypeScript now knows about the new columns

---

## STEP 3: Update Database Service

**File**: `src/lib/database-service.ts`

No changes needed! The service uses spread operator (`...dish`) which will automatically handle the new columns.

**However**, if you want to be explicit, the methods already handle it correctly via the spread operator.

✅ **Result**: Database service ready to save dual pricing data

---

## STEP 4: Update Admin Form

**File**: `src/routes/admin.tsx`

Find the `DishForm` component's `onSubmit` handler (around line 296).

Replace it with this updated version:

```typescript
return (
  <form
    className="space-y-3 max-h-[80vh] overflow-y-auto pr-4"
    onSubmit={(e) => {
      e.preventDefault();
      const trimmedName = name.trim();
      const trimmedDescription = description.trim();

      // Validation
      if (!trimmedName) {
        toast.error("Name required");
        return;
      }
      
      if (hasDualPricing) {
        if (halfPrice <= 0 || fullPrice <= 0) {
          toast.error("Both prices required for dual pricing");
          return;
        }
      } else {
        if (price <= 0) {
          toast.error("Price required");
          return;
        }
      }

      // Submit with correct data
      onSubmit({
        name: trimmedName,
        description: trimmedDescription,
        price: hasDualPricing ? null : price,        // null if dual pricing
        category,
        image,
        hasDualPricing,
        halfPrice: hasDualPricing ? halfPrice : undefined,
        fullPrice: hasDualPricing ? fullPrice : undefined,
      });
    }}
  >
    {/* Form fields... */}
  </form>
);
```

Now find the part where dishes are saved to Supabase (around line 192-243).

Update the `onSubmit` callback:

```typescript
onSubmit={async (d) => {
  try {
    if (editing.id) {
      // UPDATE existing dish
      await dishesService.updateDish(editing.id, {
        name: d.name,
        description: d.description,
        price: d.hasDualPricing ? null : convertToPaise(d.price),
        category: d.category,
        image_url: d.image || null,
        has_dual_pricing: d.hasDualPricing,                              // NEW
        half_plate_price: d.hasDualPricing ? convertToPaise(d.halfPrice!) : null, // NEW
        full_plate_price: d.hasDualPricing ? convertToPaise(d.fullPrice!) : null, // NEW
      });
      updateDish(editing.id, d);
      toast.success("Dish updated in Supabase");
    } else {
      // CREATE new dish
      const newDish = await dishesService.createDish({
        name: d.name,
        description: d.description,
        price: d.hasDualPricing ? null : convertToPaise(d.price),
        category: d.category,
        image_url: null,
        is_available: true,
        has_dual_pricing: d.hasDualPricing,                              // NEW
        half_plate_price: d.hasDualPricing ? convertToPaise(d.halfPrice!) : null, // NEW
        full_plate_price: d.hasDualPricing ? convertToPaise(d.fullPrice!) : null, // NEW
      });

      if (newDish) {
        let imageUrl = d.image || null;

        // ... image upload code stays the same ...

        const id =
          d.name.toLowerCase().replace(/\s+/g, "-") + "-" + Date.now().toString(36);
        addDish({ ...d, id });
        toast.success("Dish added to Supabase");
      }
    }
    setOpen(false);
  } catch (error) {
    console.error("Error saving dish:", error);
    toast.error("Failed to save dish to Supabase");
  }
}}
```

✅ **Result**: Admin form now saves dual pricing to Supabase

---

## STEP 5: Verify Menu Display (Already Done ✓)

The menu page already handles dual pricing correctly!

**File**: `src/routes/menu.tsx` (lines 151-157)

It displays:
- Single price if not dual pricing
- Half/Full prices if dual pricing is enabled

And the variant dialog (lines 184-196) already shows the size selection popup!

✅ **Result**: Menu shows dual prices and lets users choose size

---

## 📋 Quick Checklist

- [ ] Step 1: Run SQL migration in Supabase
- [ ] Step 2: Update `src/lib/supabase.ts` types
- [ ] Step 3: Confirm `src/lib/database-service.ts` is good (no changes needed)
- [ ] Step 4: Update `src/routes/admin.tsx` save logic
- [ ] Step 5: Test in admin panel

---

## 🧪 Testing

### Add a Dual-Priced Dish:
1. Go to `/admin`
2. Click **Add Dish**
3. Fill in details:
   - **Name**: "Paneer Butter Masala"
   - **Description**: "Rich tomato cream curry"
   - **Category**: "Veg Main-Course"
4. **CHECK**: "Enable Dual Pricing (Half & Full)"
5. **Half Price**: 250 (INR)
6. **Full Price**: 400 (INR)
7. Click **Save**

### View in Menu:
1. Go to `/categories` → Select "Veg Main-Course"
2. Find your dish
3. Should show: **₹250 / ₹400**
4. Click **Add to Thali**
5. Dialog pops up: "Choose Size"
   - "Half Plate - ₹250"
   - "Full Plate - ₹400"
6. Select one
7. Item added to cart with size suffix

---

## 🐛 Troubleshooting

**Issue**: "Column does not exist" error in Supabase

**Solution**: Make sure you ran the SQL migration in Step 1

---

**Issue**: Prices not saving

**Solution**: Check that `convertToPaise()` is working (multiply by 100 to convert INR to paise)

---

**Issue**: Dialog not showing size options

**Solution**: Verify `hasDualPricing` is being set to `true` in Supabase

---

## 📊 Database Before & After

### Before:
```
dishes:
- id
- name
- price (single price)
- category
```

### After:
```
dishes:
- id
- name
- price (can be null if dual pricing)
- has_dual_pricing (true/false)
- half_plate_price (null or price)
- full_plate_price (null or price)
- category
```

---

## 🎓 How It Works

1. **Admin adds dish** with dual pricing checkbox
2. **Admin enters** half price & full price
3. **Saved to Supabase** with all fields
4. **User views menu** → sees both prices
5. **User clicks "Add to Thali"** → dialog appears
6. **User selects size** → added to cart with size in name
7. **Checkout** → correct price based on size selected

---

## 🔧 Code Files to Modify

| File | What to Change |
|------|--------|
| `src/lib/supabase.ts` | Add 3 fields to SupabaseDish interface |
| `src/routes/admin.tsx` | Update save logic to include dual pricing fields |
| Supabase Dashboard | Run SQL migration |

---

## ✅ That's It!

Your dual pricing system is now fully implemented. Users can:
- See both half and full plate prices
- Choose which size they want
- Have the correct price charged for their selection
