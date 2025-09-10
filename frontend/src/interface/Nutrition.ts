// interface/Nutrition.ts
export interface NutritionData {
  id?: number; // record id
  user_id?: number;
  goal: string;
  total_calories_per_day: number;
  protein_g?: number; // โปรตีนต่อวัน (g)
  fat_g?: number;     // ไขมันต่อวัน (g)
  carb_g?: number;    // คาร์โบไฮเดรตต่อวัน (g)
  date: string; // YYYY-MM-DD
  note?: string;
}