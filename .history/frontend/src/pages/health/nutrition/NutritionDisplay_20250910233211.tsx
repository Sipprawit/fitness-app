import { useState } from "react";
import type { NutritionData } from "../../../interface/Nutrition";
import type { HealthData } from "../../../interface/HealthData";
import MealPlan from "./MealPlan";
import NutritionForm from "./NutritionForm";
import HealthDisplay from "./HealthDisplay";

interface Props {
  currentNutrition: NutritionData | undefined;
  latestNutrition: NutritionData | undefined; // เป้าหมายล่าสุด
  selectedDate: string;
  onDateChange: (date: string) => void;
  onNutritionSubmit: (data: { goal: string; total_calories_per_day: number; note?: string; date: string; }) => Promise<void>;
  onGoalUpdate?: (goal: string) => void;
  health: HealthData | null; // ข้อมูลสุขภาพล่าสุด
}

function NutritionDisplay({ 
  currentNutrition, 
  latestNutrition,
  selectedDate, 
  onDateChange, 
  onNutritionSubmit,
  onGoalUpdate,
  health
}: Props) {
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [newGoal, setNewGoal] = useState(latestNutrition?.goal || "");

  const handleGoalSave = () => {
    if (onGoalUpdate && newGoal.trim()) {
      onGoalUpdate(newGoal.trim());
      setIsEditingGoal(false);
    }
  };

  const handleGoalCancel = () => {
    setNewGoal(latestNutrition?.goal || "");
    setIsEditingGoal(false);
  };

  return (
    <div style={{ 
      background: "rgba(255, 255, 255, 0.85)",
      backdropFilter: "blur(10px)",
      WebkitBackdropFilter: "blur(10px)",
      padding: "2rem", 
      borderRadius: "20px", 
      marginTop: "2rem",
      border: "2px solid rgba(254, 202, 202, 0.6)",
      boxShadow: "0 20px 40px rgba(197, 0, 0, 0.15)"
    }}>
      {/* Header with Date Selector */}
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        marginBottom: "2rem",
        flexWrap: "wrap",
        gap: "1rem"
      }}>
        <h2 style={{ 
          color: "#c50000", 
          margin: 0, 
          fontSize: "2rem", 
          fontWeight: "700",
          textShadow: "0 2px 4px rgba(197, 0, 0, 0.3)"
        }}>
          🍎 แผนโภชนาการ
        </h2>
        
        {/* Enhanced Date Selector */}
        <div style={{ 
          display: "flex", 
          alignItems: "center", 
          gap: "1rem",
          backgroundColor: "rgba(255,255,255,0.9)",
          padding: "0.75rem 1.5rem",
          borderRadius: "15px",
          boxShadow: "0 8px 20px rgba(0,0,0,0.1)"
        }}>
          <label style={{ 
            color: "#374151", 
            fontWeight: "600", 
            fontSize: "1rem" 
          }}>
            วันที่:
          </label>
          <input 
            type="date" 
            value={selectedDate} 
            onChange={(e) => onDateChange(e.target.value)}
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "10px",
              border: "2px solid #fecaca",
              fontSize: "1rem",
              fontWeight: "500",
              backgroundColor: "#fff",
              color: "#374151",
              outline: "none",
              transition: "all 0.2s ease",
              boxShadow: "0 2px 4px rgba(197, 0, 0, 0.05)"
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "#c50000";
              e.target.style.boxShadow = "0 0 0 3px rgba(197, 0, 0, 0.1)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#fecaca";
              e.target.style.boxShadow = "0 2px 4px rgba(197, 0, 0, 0.05)";
            }}
          />
        </div>
      </div>

      {/* Goal Display/Edit Section - แสดงเป้าหมายล่าสุดตลอดเวลา */}
      {latestNutrition && (
        <div style={{ 
          backgroundColor: "rgba(255,255,255,0.95)", 
          padding: "1.5rem", 
          borderRadius: "15px", 
          marginBottom: "2rem",
          boxShadow: "0 8px 20px rgba(0,0,0,0.08)"
        }}>
          <div style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1rem"
          }}>
            <div>
              <h3 style={{ 
                margin: "0 0 0.5rem 0", 
                color: "#c50000", 
                fontSize: "1.25rem",
                fontWeight: "600"
              }}>
                🎯 เป้าหมายล่าสุด
                {latestNutrition.date && (
                  <span style={{ 
                    fontSize: "0.9rem", 
                    fontWeight: "400", 
                    color: "#6b7280",
                    marginLeft: "0.5rem"
                  }}>
                    (ล่าสุด: {latestNutrition.date})
                  </span>
                )}
              </h3>
              {isEditingGoal ? (
                <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                  <input
                    type="text"
                    value={newGoal}
                    onChange={(e) => setNewGoal(e.target.value)}
                    style={{
                      padding: "0.5rem 1rem",
                      borderRadius: "8px",
                      border: "2px solid #4f46e5",
                      fontSize: "1rem",
                      minWidth: "200px"
                    }}
                    placeholder="เป้าหมายของคุณ"
                  />
                  <button
                    onClick={handleGoalSave}
                    style={{
                      padding: "0.5rem 1rem",
                      borderRadius: "8px",
                      border: "none",
                      backgroundColor: "#10b981",
                      color: "#fff",
                      fontWeight: "600",
                      cursor: "pointer",
                      transition: "all 0.2s ease"
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#059669"}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#10b981"}
                  >
                    บันทึก
                  </button>
                  <button
                    onClick={handleGoalCancel}
                    style={{
                      padding: "0.5rem 1rem",
                      borderRadius: "8px",
                      border: "none",
                      backgroundColor: "#6b7280",
                      color: "#fff",
                      fontWeight: "600",
                      cursor: "pointer",
                      transition: "all 0.2s ease"
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#4b5563"}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#6b7280"}
                  >
                    ยกเลิก
                  </button>
                </div>
              ) : (
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <span style={{ 
                    color: "#c50000", 
                    fontSize: "1.1rem", 
                    fontWeight: "600",
                    padding: "0.5rem 1rem",
                    backgroundColor: "#fef2f2",
                    borderRadius: "10px",
                    border: "1px solid #fecaca"
                  }}>
                    {latestNutrition.goal}
                  </span>
                  <button
                    onClick={() => setIsEditingGoal(true)}
                    style={{
                      padding: "0.5rem 1rem",
                      borderRadius: "8px",
                      border: "none",
                      backgroundColor: "#c50000",
                      color: "#fff",
                      fontWeight: "600",
                      cursor: "pointer",
                      fontSize: "0.9rem",
                      transition: "all 0.2s ease"
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#dc2626"}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#c50000"}
                  >
                    แก้ไข
                  </button>
                </div>
              )}
            </div>
            
            <div style={{ textAlign: "right" }}>
              <div style={{ 
                color: "#6b7280", 
                fontSize: "0.9rem", 
                marginBottom: "0.25rem" 
              }}>
                แคลอรี่ต่อวัน
              </div>
              <div style={{ 
                color: "#c50000", 
                fontSize: "1.5rem", 
                fontWeight: "700" 
              }}>
                {latestNutrition.total_calories_per_day.toFixed(0)} kcal
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Nutrition Form with Health Display */}
      <div style={{ 
        display: "flex", 
        gap: "2rem", 
        flexWrap: "wrap", 
        justifyContent: "center",
        marginBottom: "2rem" 
      }}>
        <NutritionForm
          onSubmit={(data) => onNutritionSubmit({ ...data, date: selectedDate })}
          currentGoal={latestNutrition?.goal}
          currentNote={currentNutrition?.note}
        />
        <HealthDisplay health={health} />
      </div>

      {/* Meal Plan */}
      {currentNutrition && (
        <MealPlan 
          meals={[]} 
          totalCaloriesGoal={currentNutrition.total_calories_per_day}
          proteinG={currentNutrition.protein_g}
          fatG={currentNutrition.fat_g}
          carbG={currentNutrition.carb_g}
        />
      )}
    </div>
  );
}

export default NutritionDisplay;
