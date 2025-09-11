import type { ReactNode } from "react";
import { createContext, useContext, useState, useEffect } from "react";
import type { HealthData } from "../interface/HealthData";
import type { Activity } from "../interface/Activity";
import type { NutritionData } from "../interface/Nutrition";

interface HealthActivityContextType {
  health: HealthData | null;
  activities: Activity[];
  allHealthData: HealthData[];
  allActivities: Activity[];
  nutrition: NutritionData | null;
  setHealth: (h: HealthData) => void;
  addActivity: (a: Activity) => void;
  updateActivity: (id: number, updatedActivity: Partial<Activity>) => Promise<void>;
  deleteActivity: (id: number) => Promise<void>;
  refreshHealthData: () => Promise<void>;
}

const HealthActivityContext = createContext<HealthActivityContextType>({
  health: null,
  activities: [],
  allHealthData: [],
  allActivities: [],
  nutrition: null,
  setHealth: () => {},
  addActivity: () => {},
  deleteActivity: async () => {},
  refreshHealthData: async () => {},
});

export const useHealthActivity = () => useContext(HealthActivityContext);

export const HealthActivityProvider = ({ children }: { children: ReactNode }) => {
  const [health, setHealthState] = useState<HealthData | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [allHealthData, setAllHealthData] = useState<HealthData[]>([]);
  const [allActivities, setAllActivities] = useState<Activity[]>([]);
  const [nutrition, setNutrition] = useState<NutritionData | null>(null);

  const fetchData = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const [healthRes, activityRes, nutritionRes] = await Promise.all([
        fetch("http://localhost:8000/api/health", {
          method: "GET",
          headers: { "Authorization": `Bearer ${token}` },
        }),
        fetch("http://localhost:8000/api/activity", {
          method: "GET",
          headers: { "Authorization": `Bearer ${token}` },
        }),
        fetch("http://localhost:8000/api/nutrition", {
          method: "GET",
          headers: { "Authorization": `Bearer ${token}` },
        }),
      ]);

      if (healthRes.ok) {
        const result = await healthRes.json();
        // รองรับทั้งรูปแบบที่เป็น array ตรง ๆ และแบบที่ห่อ data
        const rawHealthList = Array.isArray(result)
          ? result
          : Array.isArray(result?.data)
          ? result.data
          : result?.data
          ? [result.data]
          : [];

        // เรียงตามวันที่ล่าสุดถ้ามี date มิฉะนั้นใช้ ID
        const sorted = [...rawHealthList].sort((a: any, b: any) => {
          const ad = a?.date ? new Date(a.date).getTime() : 0;
          const bd = b?.date ? new Date(b.date).getTime() : 0;
          if (ad !== bd) return bd - ad;
          return (b?.ID || b?.id || 0) - (a?.ID || a?.id || 0);
        });

        const latestHealth = sorted[0] || null;

        const healthData = latestHealth
          ? { ...latestHealth, id: latestHealth.ID || latestHealth.id }
          : null;

        setHealthState(healthData);
        
        // เก็บข้อมูลสุขภาพทั้งหมด
        const allHealthList = sorted.map((h: any) => ({ ...h, id: h.ID || h.id }));
        setAllHealthData(allHealthList);
      } else {
        console.log("Health API response not ok:", healthRes.status, healthRes.statusText);
      }

      if (activityRes.ok) {
        const result = await activityRes.json();
        // รองรับทั้ง array ตรง ๆ และแบบที่ห่อ data
        const list = Array.isArray(result) ? result : result?.data ?? [];
        
        // แปลง ID (uppercase) เป็น id (lowercase) สำหรับ frontend
        const processedList = list.map((activity: any) => ({
          ...activity,
          id: activity.ID || activity.id, // ใช้ ID จาก backend หรือ id ที่มีอยู่แล้ว
        }));
        
        console.log("=== Activity API Response ===");
        console.log("Raw result:", result);
        console.log("Processed list:", processedList);
        console.log("First activity:", processedList[0]);
        console.log("=== End Activity API Response ===");
        setActivities(processedList);
        setAllActivities(processedList);
      } else {
        console.log("Activity API response not ok:", activityRes.status, activityRes.statusText);
      }

      if (nutritionRes.ok) {
        const result = await nutritionRes.json();
        // รองรับทั้ง array ตรง ๆ และแบบที่ห่อ data
        const nutritionData = Array.isArray(result) ? result[0] : result?.data ?? result;
        setNutrition(nutritionData);
      } else {
        console.log("Nutrition API response not ok:", nutritionRes.status, nutritionRes.statusText);
      }
    } catch (err) {
      console.error("Error fetching health/activity data:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const setHealth = (h: HealthData) => {
    console.log("=== setHealth called ===");
    console.log("Setting health data:", h);
    console.log("Current health state before update:", health);
    console.log("Health data type:", typeof h);
    console.log("Health data keys:", h ? Object.keys(h) : "No keys");
    
    setHealthState(h);
    
    console.log("setHealthState called");
    console.log("=== setHealth completed ===");
  };
  
  const addActivity = (a: Activity) => setActivities((prev) => [...prev, a]);
  
  const deleteActivity = async (id: number) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch(`http://localhost:8000/api/activity/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` },
      });

      if (response.ok) {
        // อัปเดต state หลังจากลบสำเร็จ
        setActivities((prev) => prev.filter(activity => activity.id !== id));
        setAllActivities((prev) => prev.filter(activity => activity.id !== id));
        console.log("Activity deleted successfully:", id);
      } else {
        console.error("Failed to delete activity:", response.status, response.statusText);
      }
    } catch (error) {
      console.error("Error deleting activity:", error);
    }
  };
  
  const refreshHealthData = async () => {
    await fetchData();
  };

  return (
    <HealthActivityContext.Provider value={{ health, activities, allHealthData, allActivities, nutrition, setHealth, addActivity, deleteActivity, refreshHealthData }}>
      {children}
    </HealthActivityContext.Provider>
  );
};
