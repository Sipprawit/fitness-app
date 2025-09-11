import { useState, useEffect } from "react";
import type { HealthData } from "../../../interface/HealthData";
import type { Activity } from "../../../interface/Activity";
import type { NutritionData } from "../../../interface/Nutrition";

interface Props {
  health: HealthData | null;
  activities: Activity[];
  nutrition: NutritionData | null;
  selectedDate: string;
  allHealthData: HealthData[]; // ข้อมูลสุขภาพทั้งหมด
  allActivities: Activity[]; // ข้อมูลกิจกรรมทั้งหมด
}

function HealthSummary({ health, activities, nutrition, selectedDate, allHealthData = [], allActivities = [] }: Props) {
  const [weeklyData, setWeeklyData] = useState({
    totalCaloriesBurned: 0,
    totalCaloriesConsumed: 0,
    totalActivityMinutes: 0,
    averageWeight: 0,
    activityCount: 0
  });

  // หาข้อมูลสุขภาพของวันที่เลือก หรือข้อมูลล่าสุด
  const getHealthForDate = () => {
    if (!allHealthData || allHealthData.length === 0) return health;
    
    // หาข้อมูลของวันที่เลือก
    const healthForDate = allHealthData.find(h => h.date === selectedDate);
    if (healthForDate) return healthForDate;
    
    // ถ้าไม่มีข้อมูลของวันที่เลือก ให้หาข้อมูลล่าสุด
    const sortedHealth = allHealthData
      .filter(h => h.date && h.date <= selectedDate)
      .sort((a, b) => new Date(b.date!).getTime() - new Date(a.date!).getTime());
    
    return sortedHealth[0] || health;
  };

  // หาข้อมูลกิจกรรมของวันที่เลือก
  const getActivitiesForDate = () => {
    if (!allActivities || allActivities.length === 0) return activities;
    
    // แปลงวันที่ให้เป็นรูปแบบเดียวกัน
    const selectedDateStr = new Date(selectedDate).toISOString().split('T')[0];
    
    return allActivities.filter(activity => {
      if (!activity.date) return false;
      const activityDateStr = new Date(activity.date).toISOString().split('T')[0];
      return activityDateStr === selectedDateStr;
    });
  };

  useEffect(() => {
    const currentHealth = getHealthForDate();
    const currentActivities = getActivitiesForDate();
    
    // Debug logging
    console.log("=== HealthSummary Debug ===");
    console.log("selectedDate:", selectedDate);
    console.log("allActivities:", allActivities);
    console.log("currentActivities:", currentActivities);
    console.log("nutrition:", nutrition);
    console.log("=== End Debug ===");
    
    // คำนวณข้อมูลสรุป
    const totalCaloriesBurned = currentActivities.reduce((sum, activity) => sum + (activity.calories || 0), 0);
    const totalActivityMinutes = currentActivities.reduce((sum, activity) => sum + (activity.duration || 0), 0);
    const activityCount = currentActivities.length;
    
    // คำนวณแคลอรี่ที่บริโภค (ถ้ามีข้อมูลโภชนาการ)
    let totalCaloriesConsumed = 0;
    if (nutrition && nutrition.total_calories_per_day) {
      totalCaloriesConsumed = nutrition.total_calories_per_day;
    }

    console.log("=== Setting WeeklyData ===");
    console.log("totalCaloriesBurned:", totalCaloriesBurned);
    console.log("totalCaloriesConsumed:", totalCaloriesConsumed);
    console.log("totalActivityMinutes:", totalActivityMinutes);
    console.log("activityCount:", activityCount);
    console.log("=== End Setting WeeklyData ===");

    setWeeklyData({
      totalCaloriesBurned,
      totalCaloriesConsumed,
      totalActivityMinutes,
      averageWeight: currentHealth?.weight || 0,
      activityCount
    });
  }, [health, activities, nutrition, selectedDate, allHealthData, allActivities]);

  const calculateBMI = () => {
    const currentHealth = getHealthForDate();
    if (!currentHealth || !currentHealth.weight || currentHealth.weight === 0 || !currentHealth.height || currentHealth.height === 0) return 0;
    const heightInMeters = currentHealth.height / 100;
    return (currentHealth.weight / (heightInMeters * heightInMeters)).toFixed(1);
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { category: "น้ำหนักน้อย", color: "#3b82f6", bgColor: "#dbeafe" };
    if (bmi < 23) return { category: "ปกติ", color: "#10b981", bgColor: "#d1fae5" };
    if (bmi < 25) return { category: "น้ำหนักเกิน", color: "#f59e0b", bgColor: "#fef3c7" };
    if (bmi < 30) return { category: "อ้วนระดับ 1", color: "#f97316", bgColor: "#fed7aa" };
    return { category: "อ้วนระดับ 2", color: "#ef4444", bgColor: "#fecaca" };
  };

  const bmi = parseFloat(calculateBMI().toString());
  const bmiInfo = getBMICategory(bmi);

  const getCalorieBalance = () => {
    const balance = weeklyData.totalCaloriesConsumed - weeklyData.totalCaloriesBurned;
    
    // Debug logging
    console.log("=== Calorie Balance Debug ===");
    console.log("totalCaloriesConsumed:", weeklyData.totalCaloriesConsumed);
    console.log("totalCaloriesBurned:", weeklyData.totalCaloriesBurned);
    console.log("balance:", balance);
    console.log("=== End Calorie Balance Debug ===");
    
    if (balance > 0) return { status: "เกิน", color: "#ef4444", bgColor: "#fecaca" };
    if (balance < 0) return { status: "ขาด", color: "#10b981", bgColor: "#d1fae5" };
    return { status: "สมดุล", color: "#3b82f6", bgColor: "#dbeafe" };
  };

  const calorieBalance = getCalorieBalance();
  const balanceAmount = Math.abs(weeklyData.totalCaloriesConsumed - weeklyData.totalCaloriesBurned);

  return (
    <div style={{
      background: "linear-gradient(135deg, #ffffff 0%, #fef2f2 100%)",
      padding: "2rem",
      borderRadius: "20px",
      border: "2px solid #fecaca",
      boxShadow: "0 20px 40px rgba(197, 0, 0, 0.15)",
      minWidth: "600px"
    }}>
      {/* Header */}
      <div style={{
        textAlign: "center",
        marginBottom: "2rem"
      }}>
        <h2 style={{
          color: "#c50000",
          margin: "0 0 0.5rem 0",
          fontSize: "1.75rem",
          fontWeight: "700",
          textShadow: "0 2px 4px rgba(197, 0, 0, 0.1)"
        }}>
          สรุปสุขภาพประจำวัน
        </h2>
        <p style={{
          color: "#dc2626",
          margin: 0,
          fontSize: "1rem",
          fontWeight: "500"
        }}>
          {new Date(selectedDate).toLocaleDateString('th-TH', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </p>
        {(() => {
          const currentHealth = getHealthForDate();
          const hasDataForDate = currentHealth && currentHealth.date === selectedDate;
          
          if (hasDataForDate) {
            return (
              <p style={{
                color: "#10b981",
                margin: "0.5rem 0 0 0",
                fontSize: "0.85rem",
                fontWeight: "500"
              }}>
                📅 ข้อมูลของวันที่นี้
              </p>
            );
          } else {
            const latestDate = currentHealth?.date;
            return (
              <p style={{
                color: "#f59e0b",
                margin: "0.5rem 0 0 0",
                fontSize: "0.85rem",
                fontWeight: "500"
              }}>
                📅 แสดงข้อมูลล่าสุดของวันที่ {latestDate ? new Date(latestDate).toLocaleDateString('th-TH', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                }) : 'ไม่ระบุ'}
              </p>
            );
          }
        })()}
      </div>

      {/* Main Stats Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "1.5rem",
        marginBottom: "2rem"
      }}>
        {/* BMI Card */}
        <div style={{
          backgroundColor: "rgba(255,255,255,0.9)",
          padding: "1.5rem",
          borderRadius: "15px",
          textAlign: "center",
          boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
          border: `2px solid ${bmiInfo.color}20`
        }}>
          <div style={{
            fontSize: "2.5rem",
            marginBottom: "0.5rem"
          }}>
            📊
          </div>
          <div style={{
            fontSize: "2rem",
            fontWeight: "700",
            color: bmiInfo.color,
            marginBottom: "0.25rem"
          }}>
            {bmi}
          </div>
          <div style={{
            color: "#64748b",
            fontSize: "0.9rem",
            fontWeight: "500",
            marginBottom: "0.5rem"
          }}>
            BMI
          </div>
          <div style={{
            backgroundColor: bmiInfo.bgColor,
            color: bmiInfo.color,
            padding: "0.5rem 1rem",
            borderRadius: "20px",
            fontSize: "0.8rem",
            fontWeight: "600"
          }}>
            {bmiInfo.category}
          </div>
        </div>

        {/* Weight Card */}
        <div style={{
          backgroundColor: "rgba(255,255,255,0.9)",
          padding: "1.5rem",
          borderRadius: "15px",
          textAlign: "center",
          boxShadow: "0 8px 20px rgba(0,0,0,0.08)"
        }}>
          <div style={{
            fontSize: "2.5rem",
            marginBottom: "0.5rem"
          }}>
            ⚖️
          </div>
          <div style={{
            fontSize: "2rem",
            fontWeight: "700",
            color: "#c50000",
            marginBottom: "0.25rem"
          }}>
            {weeklyData.averageWeight}
          </div>
          <div style={{
            color: "#64748b",
            fontSize: "0.9rem",
            fontWeight: "500"
          }}>
            น้ำหนัก (กก.)
          </div>
        </div>

        {/* Calorie Balance Card */}
        <div style={{
          backgroundColor: "rgba(255,255,255,0.9)",
          padding: "1.5rem",
          borderRadius: "15px",
          textAlign: "center",
          boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
          border: `2px solid ${calorieBalance.color}20`
        }}>
          <div style={{
            fontSize: "2.5rem",
            marginBottom: "0.5rem"
          }}>
            ⚖️
          </div>
          <div style={{
            fontSize: "1.5rem",
            fontWeight: "700",
            color: calorieBalance.color,
            marginBottom: "0.25rem"
          }}>
            {balanceAmount.toFixed(0)}
          </div>
          <div style={{
            color: "#64748b",
            fontSize: "0.9rem",
            fontWeight: "500",
            marginBottom: "0.5rem"
          }}>
            แคลอรี่ {calorieBalance.status}
          </div>
          <div style={{
            backgroundColor: calorieBalance.bgColor,
            color: calorieBalance.color,
            padding: "0.5rem 1rem",
            borderRadius: "20px",
            fontSize: "0.8rem",
            fontWeight: "600"
          }}>
            {calorieBalance.status}
          </div>
        </div>
      </div>

      {/* Activity & Nutrition Summary */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gap: "1.5rem",
        marginBottom: "2rem"
      }}>
        {/* Activity Summary */}
        <div style={{
          backgroundColor: "rgba(255,255,255,0.9)",
          padding: "1.5rem",
          borderRadius: "15px",
          boxShadow: "0 8px 20px rgba(0,0,0,0.08)"
        }}>
          <h3 style={{
            color: "#c50000",
            margin: "0 0 1rem 0",
            fontSize: "1.1rem",
            fontWeight: "600",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem"
          }}>
            🏃‍♂️ สรุปกิจกรรม
          </h3>
          
          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem"
          }}>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <span style={{ color: "#64748b", fontSize: "0.9rem" }}>กิจกรรมทั้งหมด</span>
              <span style={{ color: "#c50000", fontWeight: "600" }}>{weeklyData.activityCount} ครั้ง</span>
            </div>
            
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <span style={{ color: "#64748b", fontSize: "0.9rem" }}>เวลารวม</span>
              <span style={{ color: "#c50000", fontWeight: "600" }}>{weeklyData.totalActivityMinutes} นาที</span>
            </div>
            
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <span style={{ color: "#64748b", fontSize: "0.9rem" }}>แคลอรี่เผาผลาญ</span>
              <span style={{ color: "#ef4444", fontWeight: "600" }}>{weeklyData.totalCaloriesBurned.toFixed(0)} kcal</span>
            </div>
          </div>
        </div>

        {/* Nutrition Summary */}
        <div style={{
          backgroundColor: "rgba(255,255,255,0.9)",
          padding: "1.5rem",
          borderRadius: "15px",
          boxShadow: "0 8px 20px rgba(0,0,0,0.08)"
        }}>
          <h3 style={{
            color: "#c50000",
            margin: "0 0 1rem 0",
            fontSize: "1.1rem",
            fontWeight: "600",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem"
          }}>
            🍎 สรุปโภชนาการ
          </h3>
          
          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem"
          }}>
            {weeklyData.totalCaloriesConsumed > 0 && (
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}>
                <span style={{ color: "#64748b", fontSize: "0.9rem" }}>แคลอรี่บริโภค</span>
                <span style={{ color: "#3b82f6", fontWeight: "600" }}>{weeklyData.totalCaloriesConsumed.toFixed(0)} kcal</span>
              </div>
            )}
            
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <span style={{ color: "#64748b", fontSize: "0.9rem" }}>เป้าหมาย</span>
              <span style={{ color: "#64748b", fontWeight: "600" }}>
                {nutrition?.total_calories_per_day ? `${nutrition.total_calories_per_day.toFixed(0)} kcal` : "ไม่ระบุ"}
              </span>
            </div>
            
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <span style={{ color: "#64748b", fontSize: "0.9rem" }}>เป้าหมาย</span>
              <span style={{ color: "#8b5cf6", fontWeight: "600" }}>
                {nutrition?.goal || "ไม่ระบุ"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Health Tips */}
      <div style={{
        backgroundColor: "rgba(255,255,255,0.9)",
        padding: "1.5rem",
        borderRadius: "15px",
        boxShadow: "0 8px 20px rgba(0,0,0,0.08)"
      }}>
          <h3 style={{
            color: "#c50000",
            margin: "0 0 1rem 0",
            fontSize: "1.1rem",
            fontWeight: "600",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem"
          }}>
            💡 คำแนะนำสุขภาพ
          </h3>
        
        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.75rem"
        }}>
          {bmi < 18.5 && (
            <div style={{
              color: "#3b82f6",
              fontSize: "0.9rem",
              lineHeight: "1.4"
            }}>
              💪 ควรเพิ่มน้ำหนักด้วยการออกกำลังกายและรับประทานอาหารที่มีประโยชน์
            </div>
          )}
          
          {bmi >= 18.5 && bmi < 23 && (
            <div style={{
              color: "#10b981",
              fontSize: "0.9rem",
              lineHeight: "1.4"
            }}>
              ✅ น้ำหนักอยู่ในเกณฑ์ปกติ ควรรักษาสุขภาพด้วยการออกกำลังกายสม่ำเสมอ
            </div>
          )}
          
          {bmi >= 23 && (
            <div style={{
              color: "#f59e0b",
              fontSize: "0.9rem",
              lineHeight: "1.4"
            }}>
              ⚠️ ควรควบคุมน้ำหนักด้วยการออกกำลังกายและควบคุมอาหาร
            </div>
          )}
          
          {weeklyData.totalActivityMinutes < 30 && (
            <div style={{
              color: "#ef4444",
              fontSize: "0.9rem",
              lineHeight: "1.4"
            }}>
              🏃‍♂️ ควรออกกำลังกายอย่างน้อย 30 นาทีต่อวัน
            </div>
          )}
          
          {calorieBalance.status === "เกิน" && (
            <div style={{
              color: "#ef4444",
              fontSize: "0.9rem",
              lineHeight: "1.4"
            }}>
              🍎 รับประทานแคลอรี่เกินเป้าหมาย ควรควบคุมอาหาร
            </div>
          )}
          
          {calorieBalance.status === "ขาด" && (
            <div style={{
              color: "#10b981",
              fontSize: "0.9rem",
              lineHeight: "1.4"
            }}>
              🎯 รับประทานแคลอรี่น้อยกว่าเป้าหมาย ควรเพิ่มอาหารที่มีประโยชน์
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default HealthSummary;
