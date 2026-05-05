import { createClient } from "@supabase/supabase-js";
import type { Category } from "./menu-data";

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();
export const supabaseStorageBucket =
  import.meta.env.VITE_SUPABASE_STORAGE_BUCKET?.trim() || "dish-images";

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    "Supabase credentials are missing. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local, then restart the dev server.",
  );
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Database types
export interface SupabaseDish {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Category;
  image_url: string | null;
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

export interface SupabaseOrder {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  items: OrderItem[];
  total_price: number;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  dish_id: string;
  dish_name: string;
  quantity: number;
  price: number;
}
