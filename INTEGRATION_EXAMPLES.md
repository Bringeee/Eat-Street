/\*\*

- Example: How to integrate Supabase into the existing Admin Panel
- This is a reference implementation showing how to connect the database layer
-
- File: src/routes/admin-with-supabase.tsx (REFERENCE ONLY)
-
- This is NOT the actual file - it's a guide to show you how to integrate.
- Copy patterns from here into your actual src/routes/admin.tsx
  \*/

import { useEffect, useState } from "react";
import { dishesService } from "@/lib/database-service";
import { isSupabaseConfigured } from "@/lib/admin-utils";
import { SupabaseDish } from "@/lib/supabase";
import { toast } from "sonner";

/\*\*

- INTEGRATION OPTION 1: Use Supabase if configured, fallback to localStorage
  \*/
  export const useDishesWithFallback = () => {
  const [dishes, setDishes] = useState<SupabaseDish[]>([]);
  const [loading, setLoading] = useState(false);

useEffect(() => {
const loadDishes = async () => {
setLoading(true);
try {
if (isSupabaseConfigured()) {
// Use Supabase
const data = await dishesService.getAllDishes();
setDishes(data);
toast.success("Dishes loaded from database");
} else {
// Fallback to localStorage
const stored = localStorage.getItem("dishes");
const localDishes = stored ? JSON.parse(stored) : [];
setDishes(localDishes);
toast.info("Using local storage (Supabase not configured)");
}
} catch (error) {
console.error("Error loading dishes:", error);
toast.error("Failed to load dishes");
} finally {
setLoading(false);
}
};

    loadDishes();

}, []);

const addDish = async (dish: Omit<SupabaseDish, "id" | "created_at" | "updated_at">) => {
if (isSupabaseConfigured()) {
return dishesService.createDish(dish);
} else {
// Fallback: save to localStorage
const id = `${Date.now()}`;
const newDish: SupabaseDish = {
...dish,
id,
created_at: new Date().toISOString(),
updated_at: new Date().toISOString(),
};
const updated = [...dishes, newDish];
setDishes(updated);
localStorage.setItem("dishes", JSON.stringify(updated));
toast.success("Dish added locally");
return newDish;
}
};

const updateDish = async (id: string, updates: Partial<SupabaseDish>) => {
if (isSupabaseConfigured()) {
return dishesService.updateDish(id, updates);
} else {
const updated = dishes.map((d) => (d.id === id ? { ...d, ...updates, updated_at: new Date().toISOString() } : d));
setDishes(updated);
localStorage.setItem("dishes", JSON.stringify(updated));
toast.success("Dish updated locally");
return updated.find((d) => d.id === id);
}
};

const deleteDish = async (id: string) => {
if (isSupabaseConfigured()) {
return dishesService.deleteDish(id);
} else {
const updated = dishes.filter((d) => d.id !== id);
setDishes(updated);
localStorage.setItem("dishes", JSON.stringify(updated));
toast.success("Dish deleted locally");
return true;
}
};

return { dishes, loading, addDish, updateDish, deleteDish };
};

/\*\*

- INTEGRATION OPTION 2: Migrate from localStorage to Supabase
-
- Run this function once to migrate all your existing dishes
  \*/
  export const migrateLocalToSupabase = async () => {
  if (!isSupabaseConfigured()) {
  toast.error("Supabase not configured. Please set env variables first.");
  return;
  }

try {
const stored = localStorage.getItem("menu");
if (!stored) {
toast.info("No local dishes to migrate");
return;
}

    const localDishes = JSON.parse(stored);
    let migrated = 0;

    for (const dish of localDishes) {
      await dishesService.createDish({
        name: dish.name,
        description: dish.description,
        price: dish.price * 100, // Convert INR to paise
        category: dish.category,
        image_url: null, // Images need to be re-uploaded
        is_available: true,
      });
      migrated++;
    }

    toast.success(`Migrated ${migrated} dishes to Supabase`);
    localStorage.removeItem("menu"); // Clean up old data (OPTIONAL)

} catch (error) {
console.error("Migration error:", error);
toast.error("Migration failed");
}
};

/\*\*

- INTEGRATION OPTION 3: Handle Image Upload
  \*/
  export const handleDishImageUpload = async (file: File, dishId: string, existingImageUrl?: string) => {
  try {
  // Delete old image if exists
  if (existingImageUrl && isSupabaseConfigured()) {
  // Supabase storage cleanup would go here
  }

      // Upload new image
      const imageUrl = await dishesService.uploadDishImage(file, dishId);
      return imageUrl;

  } catch (error) {
  console.error("Image upload error:", error);
  toast.error("Failed to upload image");
  return null;
  }
  };

/\*\*

- INTEGRATION OPTION 4: Real-time Updates with Supabase Subscriptions
-
- Uncomment and use this to get real-time updates when other admins modify dishes
  \*/
  export const subscribeToDishesCha

nges = (onUpdate: (dish: SupabaseDish) => void) => {
if (!isSupabaseConfigured()) {
console.warn("Supabase not configured. Real-time updates not available.");
return null;
}

const subscription = supabase
.channel("dishes-channel")
.on(
"postgres_changes",
{ event: "\*", schema: "public", table: "dishes" },
(payload) => {
console.log("Change received:", payload);
onUpdate(payload.new);
}
)
.subscribe();

return subscription;
};

/\*\*

- INTEGRATION PATTERN 1: In your Admin component
-
- Replace the useState hook with the custom hook:
-
- // OLD (localStorage only)
- // const { dishes, addDish, updateDish, deleteDish } = useMenu();
-
- // NEW (Supabase with fallback)
- const { dishes, addDish, updateDish, deleteDish } = useDishesWithFallback();
-
- Everything else stays the same!
  \*/

/\*\*

- INTEGRATION PATTERN 2: In your admin form submission
-
- When user submits the form:
-
- const handleSubmit = async (dishData) => {
- try {
-     if (editing.id) {
-       await updateDish(editing.id, dishData);
-     } else {
-       await addDish(dishData);
-     }
-     setOpen(false);
- } catch (error) {
-     console.error("Submit error:", error);
- }
- };
  \*/

/\*\*

- INTEGRATION PATTERN 3: One-time migration on admin login
-
- Add this to your admin login flow:
-
- const handleAdminLogin = async (password: string) => {
- if (login(password)) {
-     toast.success("Welcome back, chef");
-
-     // Check if we need to migrate
-     if (isSupabaseConfigured() && !localStorage.getItem("migrated")) {
-       await migrateLocalToSupabase();
-       localStorage.setItem("migrated", "true");
-     }
- }
- };
  \*/

/\*\*

- KEY DIFFERENCES: localStorage vs Supabase
-
- localStorage:
- - Data stored only on this device/browser
- - Fast, no network requests
- - Data lost if browser cache cleared
- - No real-time sync between devices
-
- Supabase:
- - Data stored on remote server
- - Accessible from anywhere
- - Real-time sync with other admins (with subscriptions)
- - Backup and recovery built-in
- - Can upload and serve images
-
- RECOMMENDATION: Use Supabase for production, localStorage for development
  \*/
