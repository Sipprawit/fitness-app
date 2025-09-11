import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useState } from "react";
import type { NutritionData } from "../interface/Nutrition";
import { getNutrition, upsertNutrition } from "../services/https";
import { useNotification } from "../components/Notification/NotificationProvider";

interface NutritionContextType {
  selectedDate: string;
  setSelectedDate: (d: string) => void;
  byDate: Record<string, NutritionData>;
  save: (data: Omit<NutritionData, "id" | "user_id">) => Promise<void>;
}

const NutritionContext = createContext<NutritionContextType>({
  selectedDate: new Date().toISOString().split("T")[0],
  setSelectedDate: () => {},
  byDate: {},
  save: async () => {},
});

export const useNutrition = () => useContext(NutritionContext);

export function NutritionProvider({ children }: { children: ReactNode }) {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [byDate, setByDate] = useState<Record<string, NutritionData>>({});
  const { showNotification } = useNotification();

  useEffect(() => {
    const loadAll = async () => {
      try {
        const res = await getNutrition();
        console.log("Nutrition API response:", res);
        
        if (res?.status === 200) {
          const map: Record<string, NutritionData> = {};
          
          // Handle different response formats
          if (res.data?.data && !Array.isArray(res.data.data)) {
            // Single nutrition record
            const n = res.data.data;
            if (n && n.date) {
              const key = (n as any).date || (n as any).Date;
              map[key] = {
                id: (n as any).ID || (n as any).id,
                user_id: (n as any).user_id,
                date: key,
                goal: (n as any).goal || (n as any).Goal,
                total_calories_per_day:
                  (n as any).total_calories_per_day || (n as any).TotalCaloriesPerDay,
                protein_g: (n as any).protein_g || (n as any).ProteinG,
                fat_g: (n as any).fat_g || (n as any).FatG,
                carb_g: (n as any).carb_g || (n as any).CarbG,
                note: (n as any).note || (n as any).Note,
              };
            }
          } else if (Array.isArray(res.data) || Array.isArray(res.data?.data)) {
            // Array of nutrition records
            const arr = Array.isArray(res.data) ? res.data : res.data.data;
            for (const n of arr) {
              if (n && n.date) {
                const key = (n as any).date || (n as any).Date;
                map[key] = {
                  id: (n as any).ID || (n as any).id,
                  user_id: (n as any).user_id,
                  date: key,
                  goal: (n as any).goal || (n as any).Goal,
                  total_calories_per_day:
                    (n as any).total_calories_per_day || (n as any).TotalCaloriesPerDay,
                  protein_g: (n as any).protein_g || (n as any).ProteinG,
                  fat_g: (n as any).fat_g || (n as any).FatG,
                  carb_g: (n as any).carb_g || (n as any).CarbG,
                  note: (n as any).note || (n as any).Note,
                };
              }
            }
          }
          
          console.log("Processed nutrition data:", map);
          setByDate(map);
        }
      } catch (error) {
        console.error("Error loading nutrition data:", error);
        setByDate({});
      }
    };
    loadAll();
  }, []);

  const save = async (data: Omit<NutritionData, "id" | "user_id">) => {
    try {
      const res = await upsertNutrition({
        date: data.date,
        goal: data.goal,
        total_calories_per_day: data.total_calories_per_day,
        note: data.note,
      });
      
      console.log("Save nutrition response:", res);
      
      if (res?.status === 200) {
        // Handle response format from backend
        const n = res.data?.data || res.data;
        const key = (n as any).date || (n as any).Date || data.date;
        
        setByDate((prev) => ({
          ...prev,
          [key]: {
            id: (n as any).ID || (n as any).id,
            user_id: (n as any).user_id,
            date: key,
            goal: (n as any).goal || data.goal,
            total_calories_per_day:
              (n as any).total_calories_per_day || data.total_calories_per_day,
            protein_g: (n as any).protein_g || (n as any).ProteinG,
            fat_g: (n as any).fat_g || (n as any).FatG,
            carb_g: (n as any).carb_g || (n as any).CarbG,
            note: (n as any).note || data.note,
          },
        }));
        
        showNotification({
          type: 'success',
          title: 'บันทึกข้อมูลโภชนาการสำเร็จ!',
          message: `เป้าหมาย: ${data.goal} ถูกบันทึกเรียบร้อยแล้ว`,
          duration: 2000
        });
        console.log("Updated nutrition data for date:", key);
      } else {
        showNotification({
          type: 'error',
          title: 'บันทึกข้อมูลโภชนาการไม่สำเร็จ',
          message: 'ไม่สามารถบันทึกข้อมูลโภชนาการได้ กรุณาลองใหม่อีกครั้ง',
          duration: 3000
        });
      }
    } catch (error) {
      console.error("Error saving nutrition data:", error);
    }
  };

  return (
    <NutritionContext.Provider value={{ selectedDate, setSelectedDate, byDate, save }}>
      {children}
    </NutritionContext.Provider>
  );
}


