// interface/Meal.ts
export interface Meal {
  id?: number;
  nutrition_id?: number;
  user_id?: number;
  protein_g: number;
  fat_g: number;
  carb_g: number;
}