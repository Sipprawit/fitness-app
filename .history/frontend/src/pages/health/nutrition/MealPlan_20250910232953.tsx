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
    <div style={containerStyle}>
      <div style={headerContainerStyle}>
        <div style={headerIconStyle}>🍽️</div>
        <h3 style={headerTitleStyle}>
          แผนมื้ออาหารวันนี้
        </h3>
        <p style={headerSubtitleStyle}>
          เป้าหมาย {totalCaloriesGoal.toLocaleString()} แคลอรี่
        </p>
      </div>
      
      {/* แสดงสรุปมาโครต่อวัน */}
      {(proteinG || fatG || carbG) && (
        <div style={macrosSummaryStyle}>
          <h4 style={macrosTitleStyle}>📊 สรุปมาโครต่อวัน</h4>
          <div style={macrosGridStyle}>
            {proteinG && (
              <div style={macroItemStyle}>
                <div style={macroIconStyle}>💪</div>
                <div style={macroValueStyle}>{proteinG.toFixed(0)}g</div>
                <div style={macroLabelStyle}>โปรตีน</div>
              </div>
            )}
            {fatG && (
              <div style={macroItemStyle}>
                <div style={macroIconStyle}>🥑</div>
                <div style={macroValueStyle}>{fatG.toFixed(0)}g</div>
                <div style={macroLabelStyle}>ไขมัน</div>
              </div>
            )}
            {carbG && (
              <div style={macroItemStyle}>
                <div style={macroIconStyle}>🍞</div>
                <div style={macroValueStyle}>{carbG.toFixed(0)}g</div>
                <div style={macroLabelStyle}>คาร์บ</div>
              </div>
            )}
          </div>
        </div>
      )}

      <div style={tableContainerStyle}>
        <table style={tableStyle}>
          <thead>
            <tr style={tableHeaderStyle}>
              <th style={tableHeaderCellStyle}>🍽️ มื้อ</th>
              <th style={tableHeaderCellStyle}>🔥 แคลอรี่</th>
              <th style={tableHeaderCellStyle}>💪 โปรตีน (g)</th>
              <th style={tableHeaderCellStyle}>🍞 คาร์บ (g)</th>
              <th style={tableHeaderCellStyle}>🥑 ไขมัน (g)</th>
            </tr>
          </thead>
          <tbody>
            {mealData.map((meal, idx) => (
              <tr key={idx} style={tableRowStyle(idx)}>
                <td style={tableCellStyle}>{meal.name}</td>
                <td style={tableCellStyle}>{meal.calories.toLocaleString()}</td>
                <td style={{...tableCellStyle, color: "#c50000", fontWeight: "600"}}>{meal.protein}</td>
                <td style={{...tableCellStyle, color: "#dc2626", fontWeight: "600"}}>{meal.carbs}</td>
                <td style={{...tableCellStyle, color: "#b91c1c", fontWeight: "600"}}>{meal.fat}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Styles with white-red theme
const containerStyle: React.CSSProperties = {
  background: "rgba(255, 255, 255, 0.85)",
  backdropFilter: "blur(10px)",
  WebkitBackdropFilter: "blur(10px)",
  padding: "2rem",
  borderRadius: "20px",
  marginTop: "1.5rem",
  border: "2px solid rgba(254, 202, 202, 0.6)",
  boxShadow: "0 20px 40px rgba(197, 0, 0, 0.15)",
};

const headerContainerStyle: React.CSSProperties = {
  textAlign: "center",
  marginBottom: "2rem",
  paddingBottom: "1.5rem",
  borderBottom: "2px solid #fecaca",
};

const headerIconStyle: React.CSSProperties = {
  fontSize: "3rem",
  marginBottom: "1rem",
  filter: "drop-shadow(0 4px 8px rgba(197, 0, 0, 0.2))",
};

const headerTitleStyle: React.CSSProperties = {
  color: "#c50000",
  fontSize: "1.5rem",
  margin: "0 0 0.5rem 0",
  fontWeight: "700",
  textShadow: "0 2px 4px rgba(197, 0, 0, 0.1)",
};

const headerSubtitleStyle: React.CSSProperties = {
  color: "#dc2626",
  fontSize: "1rem",
  fontWeight: "500",
  margin: 0,
};

const macrosSummaryStyle: React.CSSProperties = {
  backgroundColor: "rgba(255,255,255,0.9)",
  padding: "1.5rem",
  borderRadius: "15px",
  marginBottom: "2rem",
  boxShadow: "0 8px 20px rgba(197, 0, 0, 0.08)",
  border: "1px solid #fecaca",
};

const macrosTitleStyle: React.CSSProperties = {
  color: "#c50000",
  fontSize: "1.1rem",
  fontWeight: "600",
  margin: "0 0 1rem 0",
  textAlign: "center",
};

const macrosGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
  gap: "1rem",
};

const macroItemStyle: React.CSSProperties = {
  backgroundColor: "rgba(255,255,255,0.8)",
  padding: "1rem",
  borderRadius: "12px",
  textAlign: "center",
  boxShadow: "0 4px 8px rgba(197, 0, 0, 0.05)",
  border: "1px solid #fecaca",
};

const macroIconStyle: React.CSSProperties = {
  fontSize: "1.5rem",
  marginBottom: "0.5rem",
};

const macroValueStyle: React.CSSProperties = {
  fontSize: "1.25rem",
  fontWeight: "700",
  color: "#c50000",
  marginBottom: "0.25rem",
};

const macroLabelStyle: React.CSSProperties = {
  color: "#64748b",
  fontSize: "0.8rem",
  fontWeight: "500",
};

const tableContainerStyle: React.CSSProperties = {
  backgroundColor: "rgba(255,255,255,0.9)",
  borderRadius: "15px",
  overflow: "hidden",
  boxShadow: "0 8px 20px rgba(197, 0, 0, 0.08)",
  border: "1px solid #fecaca",
};

const tableStyle: React.CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
  textAlign: "center",
};

const tableHeaderStyle: React.CSSProperties = {
  backgroundColor: "#c50000",
};

const tableHeaderCellStyle: React.CSSProperties = {
  padding: "1rem",
  color: "#ffffff",
  fontWeight: "600",
  fontSize: "0.9rem",
};

const tableRowStyle = (idx: number): React.CSSProperties => ({
  borderBottom: idx < 2 ? "1px solid #fecaca" : "none",
  backgroundColor: idx % 2 === 0 ? "rgba(255,255,255,0.8)" : "rgba(254,242,242,0.5)",
});

const tableCellStyle: React.CSSProperties = {
  padding: "1rem",
  color: "#1f2937",
  fontSize: "0.9rem",
};

export default MealPlan;
