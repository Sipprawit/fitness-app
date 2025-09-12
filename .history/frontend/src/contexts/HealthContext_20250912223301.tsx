import type { ReactNode } from "react";
import { createContext, useContext, useState, useEffect } from "react";
import type { HealthData } from "../interface/HealthData";
import type { Activity } from "../interface/Activity";
import type { NutritionData } from "../interface/Nutrition";
import { useNotification } from "../components/Notification/NotificationProvider";
import { GetHealth, GetActivities, UpdateActivity, DeleteActivity, GetNutrition } from "../services/https";

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
  updateActivity: async () => {},
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
  const { showNotification } = useNotification();

  const fetchData = async () => {
    try {
      const [healthRes, activityRes, nutritionRes] = await Promise.all([
        GetHealth(),
        GetActivities(),
        GetNutrition(),
      ]);

      if (healthRes?.status === 200) {
        const result = healthRes.data;
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
          ? { 
              ...latestHealth, 
              id: latestHealth.ID || latestHealth.id,
              pressure: latestHealth.pressure || latestHealth.Pressure
            }
          : null;


        setHealthState(healthData);
        
        // เก็บข้อมูลสุขภาพทั้งหมด
        const allHealthList = sorted.map((h: any) => ({ 
          ...h, 
          id: h.ID || h.id,
          pressure: h.pressure || h.Pressure
        }));
        setAllHealthData(allHealthList);
      } else {
        console.log("Health API response not ok:", healthRes.status, healthRes.statusText);
      }

      if (activityRes?.status === 200) {
        const result = activityRes.data;
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

      if (nutritionRes?.status === 200) {
        const result = nutritionRes.data;
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
  
  const addActivity = (a: Activity) => {
    setActivities((prev) => [...prev, a]);
    setAllActivities((prev) => [...prev, a]);
  };
  
  const updateActivity = async (id: number, updatedActivity: Partial<Activity>) => {
    try {
      const response = await UpdateActivity(id, updatedActivity);

      if (response?.status === 200) {
        const updatedActivityData = response.data;
        // แปลง ID เป็น id สำหรับ frontend
        const processedActivity = {
          ...updatedActivityData,
          id: updatedActivityData.ID || updatedActivityData.id,
        };
        
        // อัปเดต state หลังจากแก้ไขสำเร็จ
        setActivities((prev) => prev.map(activity => {
          const activityId = activity.id || (activity as any).ID;
          return activityId === id ? processedActivity : activity;
        }));
        setAllActivities((prev) => prev.map(activity => {
          const activityId = activity.id || (activity as any).ID;
          return activityId === id ? processedActivity : activity;
        }));
        
        showNotification({
          type: 'success',
          title: 'อัปเดตกิจกรรมสำเร็จ!',
          message: `${updatedActivity.type || processedActivity.type} ถูกอัปเดตเรียบร้อยแล้ว`,
          duration: 2000
        });
        console.log("Activity updated successfully:", id);
      } else {
        console.error("Failed to update activity:", response.status, response.statusText);
        showNotification({
          type: 'error',
          title: 'อัปเดตกิจกรรมไม่สำเร็จ',
          message: 'ไม่สามารถอัปเดตกิจกรรมได้ กรุณาลองใหม่อีกครั้ง',
          duration: 3000
        });
      }
    } catch (error) {
      console.error("Error updating activity:", error);
      showNotification({
        type: 'error',
        title: 'เกิดข้อผิดพลาด',
        message: 'ไม่สามารถอัปเดตกิจกรรมได้ กรุณาลองใหม่อีกครั้ง',
        duration: 3000
      });
    }
  };
  
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
        setActivities((prev) => prev.filter(activity => {
          const activityId = activity.id || (activity as any).ID;
          return activityId !== id;
        }));
        setAllActivities((prev) => prev.filter(activity => {
          const activityId = activity.id || (activity as any).ID;
          return activityId !== id;
        }));
        
        showNotification({
          type: 'success',
          title: 'ลบกิจกรรมสำเร็จ!',
          message: 'กิจกรรมถูกลบออกจากรายการแล้ว',
          duration: 2000
        });
        console.log("Activity deleted successfully:", id);
      } else {
        console.error("Failed to delete activity:", response.status, response.statusText);
        showNotification({
          type: 'error',
          title: 'ลบกิจกรรมไม่สำเร็จ',
          message: 'ไม่สามารถลบกิจกรรมได้ กรุณาลองใหม่อีกครั้ง',
          duration: 3000
        });
      }
    } catch (error) {
      console.error("Error deleting activity:", error);
      showNotification({
        type: 'error',
        title: 'เกิดข้อผิดพลาด',
        message: 'ไม่สามารถลบกิจกรรมได้ กรุณาลองใหม่อีกครั้ง',
        duration: 3000
      });
    }
  };
  
  const refreshHealthData = async () => {
    await fetchData();
  };

  return (
    <HealthActivityContext.Provider value={{ health, activities, allHealthData, allActivities, nutrition, setHealth, addActivity, updateActivity, deleteActivity, refreshHealthData }}>
      {children}
    </HealthActivityContext.Provider>
  );
};
