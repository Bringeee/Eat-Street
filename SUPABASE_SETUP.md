# Supabase Setup Guide for Eat Street Restaurant

This guide will help you connect your Eat Street Restaurant admin portal to Supabase for dish management and order tracking.

## Prerequisites

- A Supabase account (sign up at https://supabase.com if you don't have one)
- Your project already has the basic structure in place
- Node.js and npm/bun installed

## Step-by-Step Setup

### Step 1: Create a Supabase Project

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Click "New Project"
3. Fill in the project details:
   - **Name**: `eat-street-restaurant` (or your preferred name)
   - **Database Password**: Create a strong password (save it securely)
   - **Region**: Choose the region closest to your users (e.g., `ap-south-1` for India)
4. Click "Create new project" and wait for it to initialize (2-3 minutes)

### Step 2: Get Your Credentials

1. Once your project is created, go to **Settings** → **API**
2. You'll see:
   - **Project URL**: Copy this (looks like `https://xxxxx.supabase.co`)
   - **anon public**: Copy this key
   - **service_role**: Keep this SECRET - don't share it

### Step 3: Create Environment Variables

1. In your project root, create or update a `.env.local` file:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

2. Replace:
   - `your-project-id` with your actual Supabase project ID
   - `your-anon-key-here` with the anon public key

3. **Important**: Add `.env.local` to your `.gitignore` so you don't commit secrets

### Step 4: Install Supabase Package

Run this command to install the Supabase JavaScript client:

```bash
bun add @supabase/supabase-js
```

(Or use `npm install @supabase/supabase-js` if using npm)

### Step 5: Create Database Tables

1. Go to your Supabase dashboard
2. Click on **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy and paste the entire content from `supabase/migrations/001_create_tables.sql`
5. Click **Run** to execute the SQL

This will create:

- `dishes` table - stores all menu items
- `orders` table - stores customer orders
- Indexes for faster queries
- Automatic timestamp updates

### Step 6: Set Up Storage for Images (Optional but Recommended)

To upload dish images:

1. Go to **Storage** in the sidebar
2. Click **Create a new bucket**
3. Name it `dish-images`
4. Choose **Public** (so images can be displayed)
5. Click **Create bucket**

### Step 7: Enable Authentication (For Admin Access)

This step ensures only authorized admins can modify dishes:

1. Go to **Authentication** → **Providers**
2. Email/Password should already be enabled
3. Go to **Authentication** → **Users**
4. Optionally add admin users here (you'll implement auth checks in the app)

### Step 8: Update Admin Routes to Use Supabase

The database service files are already created in:

- `src/lib/supabase.ts` - Supabase client initialization
- `src/lib/database-service.ts` - Database operations

You can import and use them in your admin panel:

```typescript
import { dishesService } from "@/lib/database-service";

// Fetch all dishes
const dishes = await dishesService.getAllDishes();

// Create a new dish
await dishesService.createDish({
  name: "New Dish",
  description: "Description",
  price: 300,
  category: "Main Course",
  image_url: null,
  is_available: true,
});

// Update a dish
await dishesService.updateDish(dishId, {
  name: "Updated Name",
  price: 350,
});

// Delete a dish
await dishesService.deleteDish(dishId);

// Upload image
const imageUrl = await dishesService.uploadDishImage(file, dishId);
```

### Step 9: Test the Connection

1. Start your development server:

   ```bash
   bun run dev
   ```

2. Navigate to your admin page (`/admin`)

3. If Supabase is properly configured, you should see:
   - No console errors about missing Supabase credentials
   - Ability to fetch and manage dishes from the database

## File Structure

```
src/lib/
├── supabase.ts              # Supabase client & types
├── database-service.ts      # Database operations (dishes, orders)
└── site-config.ts          # Site configuration (already exists)

supabase/
└── migrations/
    └── 001_create_tables.sql  # Database schema
```

## Database Schema

### Dishes Table

```
- id (UUID) - Primary key
- name (String) - Dish name
- description (Text) - Dish description
- price (Integer) - Price in paise (multiply by 100 for INR)
- category (String) - One of: Starters, Main Course, Desserts, Beverages
- image_url (String) - URL to dish image
- is_available (Boolean) - Whether dish is available
- created_at (Timestamp) - When dish was added
- updated_at (Timestamp) - When dish was last updated
```

### Orders Table

```
- id (UUID) - Primary key
- customer_name (String) - Customer name
- customer_email (String) - Customer email
- customer_phone (String) - Customer phone
- items (JSON) - Array of order items
- total_price (Integer) - Total in paise
- status (String) - One of: pending, confirmed, completed, cancelled
- created_at (Timestamp) - When order was created
- updated_at (Timestamp) - When order was last updated
```

## Troubleshooting

### Connection Issues

**Error**: "Supabase credentials not found"

- Solution: Check that `.env.local` is in your project root
- Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are correct
- Restart your dev server after adding env variables

**Error**: "Cannot find module '@supabase/supabase-js'"

- Solution: Run `bun add @supabase/supabase-js` (or `npm install`)

**Error**: "Invalid JWT" or "401 Unauthorized"

- Solution: Check your anon key is correct (not the service role key)
- Service role key should be kept secret and used only on the backend

### Database Issues

**Error**: "Relation 'dishes' does not exist"

- Solution: Run the SQL migration in the Supabase SQL Editor

**Error**: "Permission denied"

- Solution: Check Row Level Security (RLS) policies are correctly set

## Best Practices

1. **Never commit `.env.local`** - Keep secrets safe
2. **Use environment variables** - All credentials should be in `.env.local`
3. **Validate data** - Always validate user input before saving to database
4. **Use TypeScript** - Take advantage of the types provided by `supabase.ts`
5. **Handle errors** - Always wrap database calls in try-catch
6. **Backup regularly** - Use Supabase's backup features

## Next Steps

1. Integrate with existing admin panel in `src/routes/admin.tsx`
2. Add image upload functionality with preview
3. Implement order management dashboard
4. Set up real-time updates using Supabase subscriptions
5. Add role-based access control for multiple admin users

## Support

For more information:

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript)
- [React Integration Guide](https://supabase.com/docs/guides/getting-started/with-react)
