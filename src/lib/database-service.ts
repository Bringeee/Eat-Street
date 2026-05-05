import { supabase, type SupabaseDish, type SupabaseOrder } from "./supabase";
import { toast } from "sonner";

/**
 * Dishes Service - Handle all dish-related database operations
 */
export const dishesService = {
  /**
   * Fetch all dishes from Supabase
   */
  async getAllDishes(): Promise<SupabaseDish[]> {
    try {
      const { data, error } = await supabase
        .from("dishes")
        .select("*")
        .order("category", { ascending: true })
        .order("name", { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching dishes:", error);
      toast.error("Failed to fetch dishes");
      return [];
    }
  },

  /**
   * Fetch a single dish by ID
   */
  async getDishById(id: string): Promise<SupabaseDish | null> {
    try {
      const { data, error } = await supabase.from("dishes").select("*").eq("id", id).single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error fetching dish:", error);
      return null;
    }
  },

  /**
   * Create a new dish
   */
  async createDish(
    dish: Omit<SupabaseDish, "id" | "created_at" | "updated_at">,
  ): Promise<SupabaseDish | null> {
    try {
      const { data, error } = await supabase
        .from("dishes")
        .insert([
          {
            ...dish,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (error) throw error;
      toast.success("Dish added successfully");
      return data;
    } catch (error) {
      console.error("Error creating dish:", error);
      toast.error("Failed to add dish");
      return null;
    }
  },

  /**
   * Update an existing dish
   */
  async updateDish(
    id: string,
    updates: Partial<Omit<SupabaseDish, "id" | "created_at">>,
  ): Promise<SupabaseDish | null> {
    try {
      const { data, error } = await supabase
        .from("dishes")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      toast.success("Dish updated successfully");
      return data;
    } catch (error) {
      console.error("Error updating dish:", error);
      toast.error("Failed to update dish");
      return null;
    }
  },

  /**
   * Delete a dish
   */
  async deleteDish(id: string): Promise<boolean> {
    try {
      const { error } = await supabase.from("dishes").delete().eq("id", id);

      if (error) throw error;
      toast.success("Dish deleted successfully");
      return true;
    } catch (error) {
      console.error("Error deleting dish:", error);
      toast.error("Failed to delete dish");
      return false;
    }
  },

  /**
   * Upload a dish image to Supabase Storage
   */
  async uploadDishImage(file: File, dishId: string): Promise<string | null> {
    try {
      const fileName = `${dishId}-${Date.now()}.${file.name.split(".").pop()}`;
      const bucket =
        (import.meta.env.VITE_SUPABASE_STORAGE_BUCKET as string) || "dish-images";

      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(`dishes/${fileName}`, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (error) throw error;

      const {
        data: { publicUrl },
      } = supabase.storage.from(bucket).getPublicUrl(`dishes/${fileName}`);

      return publicUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      const message = error instanceof Error ? error.message : String(error);
      toast.error(`Failed to upload image: ${message}`);
      return null;
    }
  },

  /**
   * Toggle dish availability
   */
  async toggleAvailability(id: string, isAvailable: boolean): Promise<SupabaseDish | null> {
    return this.updateDish(id, { is_available: isAvailable });
  },
};

/**
 * Orders Service - Handle all order-related database operations
 */
export const ordersService = {
  /**
   * Fetch all orders
   */
  async getAllOrders(): Promise<SupabaseOrder[]> {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to fetch orders");
      return [];
    }
  },

  /**
   * Fetch a single order by ID
   */
  async getOrderById(id: string): Promise<SupabaseOrder | null> {
    try {
      const { data, error } = await supabase.from("orders").select("*").eq("id", id).single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error fetching order:", error);
      return null;
    }
  },

  /**
   * Create a new order
   */
  async createOrder(
    order: Omit<SupabaseOrder, "id" | "created_at" | "updated_at">,
  ): Promise<SupabaseOrder | null> {
    try {
      const { data, error } = await supabase
        .from("orders")
        .insert([
          {
            ...order,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (error) throw error;
      toast.success("Order created successfully");
      return data;
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error("Failed to create order");
      return null;
    }
  },

  /**
   * Update order status
   */
  async updateOrderStatus(
    id: string,
    status: SupabaseOrder["status"],
  ): Promise<SupabaseOrder | null> {
    try {
      const { data, error } = await supabase
        .from("orders")
        .update({
          status,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      toast.success("Order updated successfully");
      return data;
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error("Failed to update order");
      return null;
    }
  },

  /**
   * Delete an order
   */
  async deleteOrder(id: string): Promise<boolean> {
    try {
      const { error } = await supabase.from("orders").delete().eq("id", id);

      if (error) throw error;
      toast.success("Order deleted successfully");
      return true;
    } catch (error) {
      console.error("Error deleting order:", error);
      toast.error("Failed to delete order");
      return false;
    }
  },
};
