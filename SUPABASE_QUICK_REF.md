# Supabase Integration - Quick Reference

## Files Created

### Core Database Files

1. **`src/lib/supabase.ts`** - Supabase client initialization and TypeScript types
2. **`src/lib/database-service.ts`** - Database operations (CRUD for dishes and orders)
3. **`src/lib/admin-utils.ts`** - Helper utilities for admin panel
4. **`supabase/migrations/001_create_tables.sql`** - Database schema

### Documentation & Configuration

5. **`SUPABASE_SETUP.md`** - Complete setup guide
6. **`.env.example`** - Environment variables template

---

## Quick Connection Steps

### 1️⃣ Create Supabase Project

- Go to https://supabase.com and create an account
- Create a new project
- Choose region closest to India (e.g., ap-south-1)

### 2️⃣ Get Your Credentials

- Navigate to: **Settings** → **API**
- Copy: **Project URL** and **anon public key**

### 3️⃣ Add Environment Variables

Create `.env.local` in your project root:

```env
VITE_SUPABASE_URL=https://your-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-key-here
```

### 4️⃣ Install Supabase Package

```bash
bun add @supabase/supabase-js
```

### 5️⃣ Create Database Tables

- Go to Supabase **SQL Editor**
- Create new query
- Copy content from `supabase/migrations/001_create_tables.sql`
- Run the query

### 6️⃣ Set Up Storage (Optional)

- Go to **Storage** → Create new bucket
- Name: `dish-images`
- Set to **Public**

### 7️⃣ Start Using It!

```typescript
import { dishesService } from "@/lib/database-service";

// Get all dishes
const dishes = await dishesService.getAllDishes();

// Add new dish
await dishesService.createDish({
  name: "New Dish",
  description: "Description",
  price: 30000, // in paise (300 INR)
  category: "Main Course",
  image_url: null,
  is_available: true,
});

// Update dish
await dishesService.updateDish(dishId, {
  price: 35000,
  is_available: false,
});

// Delete dish
await dishesService.deleteDish(dishId);

// Upload image
const imageUrl = await dishesService.uploadDishImage(file, dishId);
```

---

## Database Tables

### `dishes` Table

```
id              UUID (auto-generated)
name            String (required)
description     String (required)
price           Integer (in paise, e.g., 30000 = ₹300)
category        String (Starters | Main Course | Desserts | Beverages)
image_url       String (optional)
is_available    Boolean (default: true)
created_at      Timestamp (auto)
updated_at      Timestamp (auto)
```

### `orders` Table

```
id              UUID (auto-generated)
customer_name   String
customer_email  String
customer_phone  String
items           JSON (array of orders)
total_price     Integer (in paise)
status          String (pending | confirmed | completed | cancelled)
created_at      Timestamp (auto)
updated_at      Timestamp (auto)
```

---

## Common Operations

### Fetch all dishes

```typescript
const dishes = await dishesService.getAllDishes();
```

### Get dish by ID

```typescript
const dish = await dishesService.getDishById("paneer-tikka");
```

### Create dish with image

```typescript
const imageUrl = await dishesService.uploadDishImage(imageFile, "new-dish");
const dish = await dishesService.createDish({
  name: "New Dish",
  description: "Description",
  price: 30000,
  category: "Main Course",
  image_url: imageUrl,
  is_available: true,
});
```

### Update dish

```typescript
await dishesService.updateDish(dishId, {
  name: "Updated Name",
  price: 35000,
});
```

### Delete dish

```typescript
const success = await dishesService.deleteDish(dishId);
```

### Toggle availability

```typescript
await dishesService.toggleAvailability(dishId, false);
```

### Create order

```typescript
const order = await ordersService.createOrder({
  customer_name: "John Doe",
  customer_email: "john@example.com",
  customer_phone: "+91 9876543210",
  items: [
    { dish_id: "paneer-tikka", dish_name: "Paneer Tikka", quantity: 2, price: 28000 },
    { dish_id: "dal-makhani", dish_name: "Dal Makhani", quantity: 1, price: 32000 },
  ],
  total_price: 88000,
  status: "pending",
});
```

### Get all orders

```typescript
const orders = await ordersService.getAllOrders();
```

### Update order status

```typescript
await ordersService.updateOrderStatus(orderId, "confirmed");
```

---

## Price Handling

Prices are stored in **paise** (1 INR = 100 paise) to avoid floating point issues.

### Converting for display:

```typescript
import { formatPrice } from "@/lib/admin-utils";

const displayPrice = formatPrice(30000); // Returns 300
```

### Converting for storage:

```typescript
import { convertToPaise } from "@/lib/admin-utils";

const priceInPaise = convertToPaise(300); // Returns 30000
```

### Formatting for display:

```typescript
import { formatINR } from "@/lib/site-config";

formatINR(300); // Returns "₹300"
```

---

## Troubleshooting

| Problem                                      | Solution                                                                  |
| -------------------------------------------- | ------------------------------------------------------------------------- |
| "Cannot find module '@supabase/supabase-js'" | Run `bun add @supabase/supabase-js`                                       |
| "Supabase credentials not found"             | Create `.env.local` with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` |
| "Relation 'dishes' does not exist"           | Run the SQL migration in Supabase SQL Editor                              |
| "401 Unauthorized"                           | Check you're using anon key, not service role key                         |
| "No rows returned"                           | Check table is created and has data                                       |

---

## Next Steps

1. Integrate with existing admin panel (`src/routes/admin.tsx`)
2. Add real-time updates (Supabase subscriptions)
3. Implement order management dashboard
4. Set up authentication for admin users
5. Add backup and recovery procedures

---

## Resources

- [Supabase Docs](https://supabase.com/docs)
- [JavaScript Client Library](https://supabase.com/docs/reference/javascript)
- [SQL Guide](https://supabase.com/docs/guides/database)
- [Storage Guide](https://supabase.com/docs/guides/storage)
