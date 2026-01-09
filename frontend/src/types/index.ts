/*
Types match those found in schme in the python schemas
*/

export interface UserPreferences {
  categories: DishType[];
  diets?: DietType[] | null; // Optional because of 'Optional[List[str]]'
}

export interface Recipe {
  id: number;
  title: string;
  image_name: string;

  ingredients: string[];
  
  instructions: string; 

  // 'dict' string key and number
  nutrition: Nutrition;
  
  diets: DietType[];
  dish_type: DishType[];

  taste_profile: Record<string, number>;
}

export interface SwipeData {
  device_id: string;
  recipe_id: number;
  liked: boolean;
}

export interface Nutrition {
  fat: number;
  carbs: number;
  protein: number;
  calories: number;
}

export interface taste_profile {
  fattiness: number;
  saltiness: number;
  sweetness: number;
  bitterness: number;
}

export type DishType = "breakfast" | "lunch" | "dinner" | "dessert" | "drink";


export type DietType =  "Vegetarian" | "Gluten Free" | "Keto" | "Lactose-Free";