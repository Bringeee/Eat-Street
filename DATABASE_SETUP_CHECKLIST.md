# Database Setup Checklist

## ✅ Files Created (All Done!)

- [x] `src/lib/supabase.ts` - Supabase client & types
- [x] `src/lib/database-service.ts` - Database operations
- [x] `src/lib/admin-utils.ts` - Helper utilities
- [x] `supabase/migrations/001_create_tables.sql` - Database schema
- [x] `SUPABASE_SETUP.md` - Complete setup guide
- [x] `SUPABASE_QUICK_REF.md` - Quick reference
- [x] `DATABASE_SETUP.md` - Summary document
- [x] `INTEGRATION_EXAMPLES.md` - Integration patterns
- [x] `.env.example` - Environment template

---

## 🚀 Connection Steps (7 Steps Total)

### Step 1: Create Supabase Project

- [ ] Go to https://supabase.com
- [ ] Click "Sign Up"
- [ ] Create account (use email or GitHub)
- [ ] Create new project
  - [ ] Project name: `eat-street-restaurant`
  - [ ] Database password: (create and save)
  - [ ] Region: `ap-south-1` (India) or your region
- [ ] Wait for project to initialize (2-3 minutes)

### Step 2: Get Your Credentials

- [ ] Go to **Settings** → **API**
- [ ] Copy **Project URL**
  - Example: `https://xxxxxxxxxxxx.supabase.co`
- [ ] Copy **anon public** key
  - Example: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- [ ] ⚠️ DON'T copy **service_role** key for frontend

### Step 3: Create `.env.local` File

- [ ] Create file in project root: `.env.local`
- [ ] Add these lines:
  ```env
  VITE_SUPABASE_URL=https://your-project-id.supabase.co
  VITE_SUPABASE_ANON_KEY=your-anon-key-here
  ```
- [ ] Replace `your-project-id` and `your-anon-key-here`
- [ ] **Important**: Add `.env.local` to `.gitignore`

### Step 4: Install Supabase Package

- [ ] Open terminal in your project
- [ ] Run: `bun add @supabase/supabase-js`
  - OR if using npm: `npm install @supabase/supabase-js`
- [ ] Wait for installation to complete

### Step 5: Create Database Tables

- [ ] Go to Supabase dashboard
- [ ] Click **SQL Editor** (left sidebar)
- [ ] Click **New Query**
- [ ] Copy entire content from: `supabase/migrations/001_create_tables.sql`
- [ ] Paste into SQL Editor
- [ ] Click **Run** (or press Cmd+Enter)
- [ ] Wait for success message

### Step 6: Set Up Storage (Optional but Recommended)

- [ ] Go to Supabase dashboard
- [ ] Click **Storage** (left sidebar)
- [ ] Click **Create a new bucket**
- [ ] Bucket name: `dish-images`
- [ ] Set to **Public** (checkmark)
- [ ] Click **Create bucket**

### Step 7: Start Development

- [ ] Restart your dev server: `bun run dev`
- [ ] Check browser console - should see no Supabase errors
- [ ] Navigate to admin page (`/admin`)
- [ ] You should be able to add/edit dishes

---

## 📋 Verification Checklist

### Can you...?

- [ ] Start dev server without errors (`bun run dev`)
- [ ] See no errors in browser console about Supabase
- [ ] Access admin page (`/admin`)
- [ ] Login to admin panel
- [ ] Try to add a new dish
- [ ] See success toast notifications
- [ ] Check Supabase dashboard and see dishes were created
- [ ] Edit an existing dish
- [ ] Delete a dish
- [ ] See changes reflected in Supabase

### Security Checklist

- [ ] `.env.local` is in `.gitignore`
- [ ] Never commit `.env.local`
- [ ] Using **anon key**, not **service_role key**
- [ ] Credentials are unique for this project
- [ ] No hardcoded credentials in code

---

## 🔧 If Something Goes Wrong

### Error: "Supabase credentials not found"

- [ ] Check `.env.local` exists in project root
- [ ] Check `VITE_SUPABASE_URL` is correct
- [ ] Check `VITE_SUPABASE_ANON_KEY` is correct
- [ ] Restart dev server
- [ ] Refresh browser

### Error: "Cannot find module '@supabase/supabase-js'"

- [ ] Run: `bun add @supabase/supabase-js`
- [ ] Or: `npm install @supabase/supabase-js`
- [ ] Restart dev server

### Error: "Relation 'dishes' does not exist"

- [ ] Go to Supabase SQL Editor
- [ ] Create new query
- [ ] Copy content from `supabase/migrations/001_create_tables.sql`
- [ ] Run the query
- [ ] Refresh your admin page

### Error: "401 Unauthorized"

- [ ] Check you're using **anon key**, not **service_role key**
- [ ] Verify credentials in `.env.local`
- [ ] Go to Supabase Settings → API
- [ ] Confirm you copied the right key

### Data not persisting?

- [ ] Check Supabase dashboard → SQL Editor → `SELECT * FROM dishes;`
- [ ] Verify network tab in browser (should see requests to supabase.co)
- [ ] Check browser console for errors
- [ ] Make sure you're not in an incognito window (storage issues)

---

## 📚 Documentation Files

| File                          | Purpose                        |
| ----------------------------- | ------------------------------ |
| `SUPABASE_SETUP.md`           | 📖 Complete step-by-step guide |
| `SUPABASE_QUICK_REF.md`       | ⚡ Quick lookup for operations |
| `DATABASE_SETUP.md`           | 📋 Summary & overview          |
| `INTEGRATION_EXAMPLES.md`     | 💡 Code examples & patterns    |
| `DATABASE_SETUP_CHECKLIST.md` | ✅ This file                   |

---

## 🎯 Next Steps After Connection

1. **Test the connection** - Add a test dish to verify everything works
2. **Integrate with admin panel** - Use `dishesService` in `src/routes/admin.tsx`
3. **Upload images** - Use the storage bucket
4. **Set up orders** - Use `ordersService` for order management
5. **Real-time updates** - Add Supabase subscriptions for multi-admin sync
6. **Backup & recovery** - Set up Supabase backups

---

## 💾 Database Structure at a Glance

```
🗄️ Supabase Database
│
├─ 📊 dishes table
│  ├─ id (UUID)
│  ├─ name (String)
│  ├─ description (Text)
│  ├─ price (Integer in paise)
│  ├─ category (String)
│  ├─ image_url (String)
│  ├─ is_available (Boolean)
│  ├─ created_at (Timestamp)
│  └─ updated_at (Timestamp)
│
├─ 📊 orders table
│  ├─ id (UUID)
│  ├─ customer_name (String)
│  ├─ customer_email (String)
│  ├─ customer_phone (String)
│  ├─ items (JSON array)
│  ├─ total_price (Integer in paise)
│  ├─ status (String)
│  ├─ created_at (Timestamp)
│  └─ updated_at (Timestamp)
│
└─ 💾 Storage
   └─ dish-images/ (folder for dish photos)
```

---

## 🔗 Useful Links

- [Supabase Dashboard](https://app.supabase.com)
- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript)
- [Database Guide](https://supabase.com/docs/guides/database)
- [Storage Guide](https://supabase.com/docs/guides/storage)

---

## ✨ Tips & Tricks

1. **Local Development**: Keep using localStorage while developing, switch to Supabase for production
2. **Testing**: Use Supabase's built-in test suite before going live
3. **Backups**: Supabase automatically backs up daily (check Settings → Backups)
4. **Rate Limiting**: Free tier has generous limits (good for testing)
5. **API Docs**: Auto-generated API docs available in your Supabase dashboard

---

## 🎉 Congratulations!

You have everything you need to connect your admin portal to Supabase!

Follow the 7 connection steps above, and you'll be able to:

- ✅ Add and edit dishes
- ✅ Upload dish images
- ✅ Manage availability
- ✅ Track orders
- ✅ Real-time sync across devices

**Happy coding! 🚀**
