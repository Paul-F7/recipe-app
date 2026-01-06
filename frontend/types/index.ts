/*
Types match those found in schme in the python schemas
*/

export interface UserPreferences {
  categories: string[];
  diets?: string[] | null; // Optional because of 'Optional[List[str]]'
}

export interface Recipe {
  id: number;
  title: string;
  image_name: string;

  ingredients: string;
  
  instructions: string[]; 

  // 'dict' string key and number
  nutrition: Record<string, number>;
  
  diets: string[];
  dish_type: string[];

  taste_profile: Record<string, number>;
}

export interface SwipeData {
  device_id: string;
  recipe_id: number;
  liked: boolean;
}