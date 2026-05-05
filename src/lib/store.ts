import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DEFAULT_MENU, type Category, type Dish } from "./menu-data";
import { SITE } from "./site-config";

// ---------- Cart ----------
interface CartItem {
  dish: Dish;
  qty: number;
}

interface CartState {
  items: CartItem[];
  add: (d: Dish) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  total: () => number;
  count: () => number;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (dish) =>
        set((s) => {
          const existing = s.items.find((i) => i.dish.id === dish.id);
          if (existing) {
            return {
              items: s.items.map((i) => (i.dish.id === dish.id ? { ...i, qty: i.qty + 1 } : i)),
            };
          }

          return { items: [...s.items, { dish, qty: 1 }] };
        }),
      remove: (id) => set((s) => ({ items: s.items.filter((i) => i.dish.id !== id) })),
      setQty: (id, qty) =>
        set((s) => ({
          items:
            qty <= 0
              ? s.items.filter((i) => i.dish.id !== id)
              : s.items.map((i) => (i.dish.id === id ? { ...i, qty } : i)),
        })),
      clear: () => set({ items: [] }),
      total: () => get().items.reduce((sum, i) => sum + i.dish.price * i.qty, 0),
      count: () => get().items.reduce((sum, i) => sum + i.qty, 0),
    }),
    { name: "saffron-cart" },
  ),
);

// ---------- Menu (admin-editable) ----------
interface MenuState {
  dishes: Dish[];
  setDishes: (dishes: Dish[]) => void;
  addDish: (d: Dish) => void;
  updateDish: (id: string, patch: Partial<Dish>) => void;
  deleteDish: (id: string) => void;
  resetMenu: () => void;
}

export const useMenu = create<MenuState>()(
  persist(
    (set) => ({
      dishes: DEFAULT_MENU,
      setDishes: (dishes) => set({ dishes }),
      addDish: (d) => set((s) => ({ dishes: [...s.dishes, d] })),
      updateDish: (id, patch) =>
        set((s) => ({ dishes: s.dishes.map((d) => (d.id === id ? { ...d, ...patch } : d)) })),
      deleteDish: (id) => set((s) => ({ dishes: s.dishes.filter((d) => d.id !== id) })),
      resetMenu: () => set({ dishes: DEFAULT_MENU }),
    }),
    { name: "saffron-menu" },
  ),
);

// ---------- Reviews ----------
export interface Review {
  id: string;
  name: string;
  rating: number;
  text: string;
  createdAt: number;
}

interface ReviewsState {
  reviews: Review[];
  add: (r: Omit<Review, "id" | "createdAt">) => void;
  remove: (id: string) => void;
}

export const useReviews = create<ReviewsState>()(
  persist(
    (set) => ({
      reviews: [],
      add: (r) =>
        set((s) => ({
          reviews: [{ ...r, id: crypto.randomUUID(), createdAt: Date.now() }, ...s.reviews],
        })),
      remove: (id) => set((s) => ({ reviews: s.reviews.filter((r) => r.id !== id) })),
    }),
    { name: "saffron-reviews" },
  ),
);

// ---------- Admin auth (simple) ----------
interface AdminState {
  isAdmin: boolean;
  login: (pw: string) => boolean;
  logout: () => void;
}

export const useAdmin = create<AdminState>((set) => ({
  isAdmin: false,
  login: (pw) => {
    if (pw === SITE.adminPassword) {
      set({ isAdmin: true });
      return true;
    }

    return false;
  },
  logout: () => set({ isAdmin: false }),
}));

export type { Dish, Category };
