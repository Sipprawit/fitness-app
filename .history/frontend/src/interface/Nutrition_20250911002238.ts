// interface/Nutrition.ts
export interface NutritionData {
  id?: number; // record id
  user_id?: number;
  goal: string;
  total_calories_per_day: number;
  date: string; // YYYY-MM-DD
  note?: string;
  protein_g?: number; // โปรตีนต่อวัน (g) - มาจาก Meal table
  fat_g?: number;     // ไขมันต่อวัน (g) - มาจาก Meal table
  carb_g?: number;    // คาร์โบไฮเดรตต่อวัน (g) - มาจาก Meal table
}