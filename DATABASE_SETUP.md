# Database Files Created - Summary

## 📁 Files Created

### 1. Core Database Integration

- **`src/lib/supabase.ts`** - Supabase client setup and TypeScript interfaces
- **`src/lib/database-service.ts`** - Complete CRUD operations for dishes and orders
- **`src/lib/admin-utils.ts`** - Utility functions for admin operations

### 2. Database Schema

- **`supabase/migrations/001_create_tables.sql`** - SQL schema for dishes and orders tables

### 3. Documentation

- **`SUPABASE_SETUP.md`** - Comprehensive step-by-step setup guide
- **`SUPABASE_QUICK_REF.md`** - Quick reference for common operations
- **`.env.example`** - Environment variables template

---

## 🚀 Quick Start (7 Steps)

### Step 1: Create Supabase Account & Project

- Visit https://supabase.com
- Sign up and create a new project
- Choose region: `ap-south-1` (India) recommended

### Step 2: Get Credentials

From Supabase Dashboard → Settings → API:

- Copy **Project URL** (e.g., `https://xxxxx.supabase.co`)
- Copy **anon public key**

### Step 3: Create `.env.local`

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### Step 4: Install Supabase Package

```bash
bun add @supabase/supabase-js
```

### Step 5: Create Database Tables

1. Go to Supabase → **SQL Editor**
2. Click **New Query**
3. Copy entire content from `supabase/migrations/001_create_tables.sql`
4. Click **Run**

### Step 6: Create Storage Bucket (Optional)

1. Go to **Storage**
2. Create bucket: `dish-images`
3. Set to **Public**

### Step 7: Start Development

```bash
bun run dev
```

---

## 📊 What You Can Now Do

### Manage Dishes

```typescript
import { dishesService } from "@/lib/database-service";

// Get all dishes
const dishes = await dishesService.getAllDishes();

// Add new dish
await dishesService.createDish({
  name: "Paneer Tikka Masala",
  description: "Creamy tomato curry with paneer chunks",
  price: 35000, // ₹350
  category: "Main Course",
  image_url: null,
  is_available: true,
});

// Update dish
await dishesService.updateDish(dishId, {
  price: 40000,
  name: "Updated Name",
});

// Delete dish
await dishesService.deleteDish(dishId);

// Toggle availability
await dishesService.toggleAvailability(dishId, false);

// Upload image
const url = await dishesService.uploadDishImage(imageFile, dishId);
```

### Manage Orders

```typescript
import { ordersService } from "@/lib/database-service";

// Get all orders
const orders = await ordersService.getAllOrders();

// Create order
await ordersService.createOrder({
  customer_name: "John Doe",
  customer_email: "john@example.com",
  customer_phone: "+91 9876543210",
  items: [{ dish_id: "paneer-tikka", dish_name: "Paneer Tikka", quantity: 2, price: 28000 }],
  total_price: 56000,
  status: "pending",
});

// Update order status
await ordersService.updateOrderStatus(orderId, "confirmed");

// Get specific order
await ordersService.getOrderById(orderId);

// Delete order
await ordersService.deleteOrder(orderId);
```

---

## 🔐 Important Security Notes

1. **Never commit `.env.local`** - Add to `.gitignore`
2. **Keep `service_role` key secret** - Only for backend/edge functions
3. **Use `anon` key in frontend** - This is already set up
4. **Validate all user input** - Before saving to database
5. **Use HTTPS only** - Supabase uses SSL by default

---

## 📋 Database Structure

### Dishes Table

```
dishes
├── id (UUID) - Auto-generated
├── name (String) - Dish name
├── description (Text) - Full description
├── price (Integer) - In paise (e.g., 30000 = ₹300)
├── category (String) - Starters | Main Course | Desserts | Beverages
├── image_url (String) - URL to dish image
├── is_available (Boolean) - Whether dish is available
├── created_at (Timestamp) - Auto-set
└── updated_at (Timestamp) - Auto-updated
```

### Orders Table

```
orders
├── id (UUID) - Auto-generated
├── customer_name (String)
├── customer_email (String)
├── customer_phone (String)
├── items (JSON) - Array of {dish_id, dish_name, quantity, price}
├── total_price (Integer) - In paise
├── status (String) - pending | confirmed | completed | cancelled
├── created_at (Timestamp) - Auto-set
└── updated_at (Timestamp) - Auto-updated
```

---

## 💡 Helper Functions

### Convert prices

```typescript
import { formatPrice, convertToPaise } from "@/lib/admin-utils";

formatPrice(30000); // Returns 300 (for display)
convertToPaise(300); // Returns 30000 (for storage)
```

### Format for display

```typescript
import { formatINR } from "@/lib/site-config";

formatINR(300); // Returns "₹300"
```

### Validate dish data

```typescript
import { validateDish } from "@/lib/admin-utils";

const { valid, errors } = validateDish(dishData);
if (!valid) {
  console.log("Errors:", errors);
}
```

### Generate dish ID

```typescript
import { generateDishId } from "@/lib/admin-utils";

const id = generateDishId("Paneer Tikka"); // Returns "paneer-tikka"
```

---

## 🔗 Integration with Admin Panel

The database files are ready to integrate with your existing admin panel at `src/routes/admin.tsx`.

You can:

1. Replace localStorage with Supabase database
2. Keep real-time sync between clients
3. Add order management
4. Upload and manage dish images
5. Implement multiple admin users

Example integration:

```typescript
// In admin.tsx
import { dishesService } from "@/lib/database-service";

// Fetch dishes from Supabase instead of localStorage
const dishes = await dishesService.getAllDishes();

// Save new dish to Supabase
await dishesService.createDish(newDishData);
```

---

## 📚 Documentation Files

- **`SUPABASE_SETUP.md`** - Read this first! Detailed setup guide
- **`SUPABASE_QUICK_REF.md`** - Quick lookup for common operations
- **`src/lib/supabase.ts`** - Inline comments explaining the code
- **`src/lib/database-service.ts`** - Detailed JSDoc comments

---

## ✅ Next Steps

1. **Create Supabase project** (Step 1 above)
2. **Run SQL migration** to create tables
3. **Set environment variables** in `.env.local`
4. **Install @supabase/supabase-js** package
5. **Test connection** by importing and using `dishesService`
6. **Integrate with admin panel** to use database instead of localStorage

---

## 🆘 Troubleshooting

**Q: "Cannot find module '@supabase/supabase-js'"**
A: Run `bun add @supabase/supabase-js`

**Q: "Supabase credentials not found"**
A: Create `.env.local` with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`

**Q: "Relation 'dishes' does not exist"**
A: Run the SQL migration in Supabase SQL Editor

**Q: "Permission denied"**
A: Check Row Level Security (RLS) settings in Supabase

---

## 📞 Support Resources

- [Supabase Documentation](https://supabase.com/docs)
- [JavaScript Client Reference](https://supabase.com/docs/reference/javascript)
- [Database Guide](https://supabase.com/docs/guides/database)
- [Storage Guide](https://supabase.com/docs/guides/storage)

---

## 🎉 You're All Set!

All the database files are in place. Follow the 7 quick steps above to connect your Supabase project, and you'll have a fully functional admin portal for managing dishes and orders!
