import paneerPasanda from "@/assets/dishes/paneer-pasanda.jpg";
import butterChicken from "@/assets/dishes/butter-chicken.jpg";
import dalMakhani from "@/assets/dishes/dal-makhani.jpg";
import biryani from "@/assets/dishes/biryani.jpg";
import tandooriChicken from "@/assets/dishes/tandoori-chicken.jpg";
import paneerTikka from "@/assets/dishes/paneer-tikka.jpg";
import samosa from "@/assets/dishes/samosa.jpg";
import pakora from "@/assets/dishes/pakora.jpg";
import choleBhature from "@/assets/dishes/chole-bhature.jpg";
import palakPaneer from "@/assets/dishes/palak-paneer.jpg";
import roganJosh from "@/assets/dishes/rogan-josh.jpg";
import gulabJamun from "@/assets/dishes/gulab-jamun.jpg";
import rasmalai from "@/assets/dishes/rasmalai.jpg";
import kulfi from "@/assets/dishes/kulfi.jpg";
import masalaChai from "@/assets/dishes/masala-chai.jpg";
import mangoLassi from "@/assets/dishes/mango-lassi.jpg";
import roseSherbet from "@/assets/dishes/rose-sherbet.jpg";

export type Category =
  | "Veg Main-Course"
  | "Starters"
  | "Breads"
  | "Fast Food & Chinese"
  | "Special Thali"
  | "Rice"
  | "Salad/Papad"
  | "Non-Veg Snacks"
  | "Non-Veg Curry"
  | "Special Biryani"
  | "Side Orders";

export interface Dish {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Category;
  image: string;
  hasDualPricing?: boolean;
  halfPrice?: number;
  fullPrice?: number;
}

export interface CategoryInfo {
  name: Category;
  description: string;
  image: string;
}

export const CATEGORY_INFO: Record<Category, CategoryInfo> = {
  "Veg Main-Course": {
    name: "Veg Main-Course",
    description: "Delicious vegetarian curries and gravies",
    image: dalMakhani,
  },
  Starters: {
    name: "Starters",
    description: "Crispy and savory appetizers to begin your meal",
    image: paneerTikka,
  },
  Breads: {
    name: "Breads",
    description: "Freshly baked traditional Indian breads",
    image: choleBhature,
  },
  "Fast Food & Chinese": {
    name: "Fast Food & Chinese",
    description: "Quick bites with Indo-Chinese flavors",
    image: samosa,
  },
  "Special Thali": {
    name: "Special Thali",
    description: "Complete meal combinations",
    image: butterChicken,
  },
  Rice: {
    name: "Rice",
    description: "Aromatic rice preparations",
    image: biryani,
  },
  "Salad/Papad": {
    name: "Salad/Papad",
    description: "Fresh sides and crispy accompaniments",
    image: pakora,
  },
  "Non-Veg Snacks": {
    name: "Non-Veg Snacks",
    description: "Meat-based appetizers and starters",
    image: tandooriChicken,
  },
  "Non-Veg Curry": {
    name: "Non-Veg Curry",
    description: "Rich and flavorful meat curries",
    image: roganJosh,
  },
  "Special Biryani": {
    name: "Special Biryani",
    description: "Aromatic rice with tender meat and spices",
    image: biryani,
  },
  "Side Orders": {
    name: "Side Orders",
    description: "Desserts, beverages and sweet treats",
    image: gulabJamun,
  },
};

export const CATEGORIES: Category[] = [
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

export const DEFAULT_MENU: Dish[] = [];
