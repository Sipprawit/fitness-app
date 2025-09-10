import type { NutritionData } from "../../../interface/Nutrition";

interface Props {
  meals: NutritionData[];
  totalCaloriesGoal: number;
  proteinG?: number;  // โปรตีนต่อวัน (g)
  fatG?: number;      // ไขมันต่อวัน (g)
  carbG?: number;     // คาร์โบไฮเดรตต่อวัน (g)
}

function MealPlan({ totalCaloriesGoal, proteinG, fatG, carbG }: Props) {
  // คำนวณมาโครต่อมื้อ (หาร 3)
  const caloriesPerMeal = Math.round(totalCaloriesGoal / 3);
  const proteinPerMeal = proteinG ? Math.round(proteinG / 3) : 0;
  const fatPerMeal = fatG ? Math.round(fatG / 3) : 0;
  const carbPerMeal = carbG ? Math.round(carbG / 3) : 0;

  // สร้างข้อมูลมื้ออาหาร 3 มื้อ
  const mealData = [
    { name: "เช้า", calories: caloriesPerMeal, protein: proteinPerMeal, carbs: carbPerMeal, fat: fatPerMeal },
    { name: "กลางวัน", calories: caloriesPerMeal, protein: proteinPerMeal, carbs: carbPerMeal, fat: fatPerMeal },
    { name: "เย็น", calories: caloriesPerMeal, protein: proteinPerMeal, carbs: carbPerMeal, fat: fatPerMeal }
  ];

  return (
    <div style={{ 
      background: "linear-gradient(135deg, #f7f9fc 0%, #666 100%)", 
      padding: "1.5rem", 
      borderRadius: "16px", 
      marginTop: "1.5rem",
      border: "1px solid #eef2f7",
      boxShadow: "0 10px 24px rgba(0,0,0,0.08)"
    }}>
      <h3 style={{ 
        textAlign: "center", 
        color: "#fff", 
        margin: "0 0 1rem 0",
        fontSize: "1.5rem",
        fontWeight: "700"
      }}>
        แผนมื้ออาหารวันนี้ (เป้าหมาย {totalCaloriesGoal} kcal)
      </h3>
      
      {/* แสดงสรุปมาโครต่อวัน */}
      {(proteinG || fatG || carbG) && (
        <div style={{ 
          backgroundColor: "rgba(255,255,255,0.9)", 
          padding: "1rem", 
          borderRadius: "12px", 
          marginBottom: "1rem",
          textAlign: "center"
        }}>
          <h4 style={{ margin: "0 0 0.5rem 0", color: "#333" }}>สรุปมาโครต่อวัน</h4>
          <div style={{ display: "flex", justifyContent: "space-around", flexWrap: "wrap", gap: "1rem" }}>
            {proteinG && <span style={{ color: "#ef4444", fontWeight: "600" }}>โปรตีน: {proteinG.toFixed(2)}g</span>}
            {fatG && <span style={{ color: "#f59e0b", fontWeight: "600" }}>ไขมัน: {fatG.toFixed(2)}g</span>}
            {carbG && <span style={{ color: "#10b981", fontWeight: "600" }}>คาร์บ: {carbG.toFixed(2)}g</span>}
          </div>
        </div>
      )}

      <table style={{ 
        width: "100%", 
        borderCollapse: "collapse", 
        textAlign: "center", 
        backgroundColor: "rgba(255,255,255,0.95)",
        borderRadius: "12px",
        overflow: "hidden"
      }}>
        <thead>
          <tr style={{ backgroundColor: "#4f46e5" }}>
            <th style={{ padding: "1rem", color: "#fff", fontWeight: "600" }}>มื้อ</th>
            <th style={{ padding: "1rem", color: "#fff", fontWeight: "600" }}>แคลอรี่</th>
            <th style={{ padding: "1rem", color: "#fff", fontWeight: "600" }}>โปรตีน (g)</th>
            <th style={{ padding: "1rem", color: "#fff", fontWeight: "600" }}>คาร์โบไฮเดรต (g)</th>
            <th style={{ padding: "1rem", color: "#fff", fontWeight: "600" }}>ไขมัน (g)</th>
          </tr>
        </thead>
        <tbody>
          {mealData.map((meal, idx) => (
            <tr key={idx} style={{ 
              borderBottom: idx < mealData.length - 1 ? "1px solid #e5e7eb" : "none",
              backgroundColor: idx % 2 === 0 ? "rgba(255,255,255,0.8)" : "rgba(249,250,251,0.8)"
            }}>
              <td style={{ padding: "1rem", fontWeight: "600", color: "#374151" }}>{meal.name}</td>
              <td style={{ padding: "1rem", color: "#1f2937" }}>{meal.calories}</td>
              <td style={{ padding: "1rem", color: "#ef4444", fontWeight: "500" }}>{meal.protein}</td>
              <td style={{ padding: "1rem", color: "#10b981", fontWeight: "500" }}>{meal.carbs}</td>
              <td style={{ padding: "1rem", color: "#f59e0b", fontWeight: "500" }}>{meal.fat}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MealPlan;
