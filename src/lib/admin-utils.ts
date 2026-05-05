/**
 * Admin Database Utilities
 * Helper functions for the admin panel to work with Supabase
 */

import { supabase, supabaseStorageBucket, type SupabaseDish } from "./supabase";
import { formatINR } from "./site-config";

/**
 * Convert price from paise to INR for display
 */
export const formatPrice = (paise: number): number => paise / 100;

/**
 * Convert price from INR to paise for storage
 */
export const convertToPaise = (inr: number): number => Math.round(inr * 100);

/**
 * Format a Supabase dish to match the local Dish interface for compatibility
 */
export const supabaseDishToLocal = (dish: SupabaseDish) => ({
  id: dish.id,
  name: dish.name,
  description: dish.description,
  price: formatPrice(dish.price),
  category: dish.category,
  image: dish.image_url || "",
});

/**
 * Check if Supabase is configured
 */
export const isSupabaseConfigured = (): boolean => {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
  return !!(url && key);
};

/**
 * Get a public URL for an uploaded image
 */
export const getImageUrl = (path: string): string => {
  if (!path) return "";

  // If it's already a full URL, return as is
  if (path.startsWith("http")) return path;

  // Otherwise, construct the Supabase storage URL
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  return `${supabaseUrl}/storage/v1/object/public/${supabaseStorageBucket}/${path}`;
};

/**
 * Validate dish data before saving
 */
export const validateDish = (
  dish: Partial<Record<string, unknown>>,
): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!dish.name || typeof dish.name !== "string" || dish.name.trim().length === 0) {
    errors.push("Dish name is required");
  }

  if (
    !dish.description ||
    typeof dish.description !== "string" ||
    dish.description.trim().length === 0
  ) {
    errors.push("Description is required");
  }

  if (!dish.price || typeof dish.price !== "number" || dish.price <= 0) {
    errors.push("Price must be greater than 0");
  }

  if (!dish.category) {
    errors.push("Category is required");
  }

  const validCategories = [
    "Veg Main-Course",
    "Starters",
    "Breads",
    "Fast Food & Chinese",
    "Special Thali",
    "Rice",
    "Salad/Papad",
    "Non-Veg Snacks",
    "Non-Veg Curry",
    "Special Biryani",
    "Side Orders",
  ];
  if (!validCategories.includes(dish.category as string)) {
    errors.push("Invalid category");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Handle image upload and get the public URL
 */
export const handleImageUpload = async (file: File, dishId: string): Promise<string | null> => {
  try {
    if (!file) return null;

    if (!supabaseStorageBucket) {
      throw new Error("Missing Supabase storage bucket name");
    }

    // Validate file
    if (!file.type.startsWith("image/")) {
      throw new Error("Please select an image file");
    }

    if (file.size > 5 * 1024 * 1024) {
      throw new Error("Image must be less than 5MB");
    }

    const fileName = `${dishId}-${Date.now()}.${file.name.split(".").pop()}`;

    const { data, error } = await supabase.storage
      .from(supabaseStorageBucket)
      .upload(`dishes/${fileName}`, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) throw error;

    const {
      data: { publicUrl },
    } = supabase.storage.from(supabaseStorageBucket).getPublicUrl(`dishes/${fileName}`);

    return publicUrl;
  } catch (error) {
    console.error("Error uploading image:", error);
    // Normalize Supabase error info
    const message =
      error && typeof error === "object"
        ? (error as any).message || (error as any).statusText || JSON.stringify(error)
        : String(error);

    if (String(message).toLowerCase().includes("bucket")) {
      throw new Error(
        `Supabase bucket not found. Create a public bucket named "${supabaseStorageBucket}" in Supabase Storage, or set VITE_SUPABASE_STORAGE_BUCKET to the correct bucket name.`,
      );
    }

    throw new Error(message);
  }
};

/**
 * Generate a unique ID for a new dish
 */
export const generateDishId = (dishName: string): string => {
  return dishName
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "");
};
