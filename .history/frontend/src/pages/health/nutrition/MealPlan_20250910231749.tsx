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

export default MealPlan;
