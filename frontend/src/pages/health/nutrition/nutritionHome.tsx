import NutritionDisplay from "./NutritionDisplay";
import { useHealthActivity } from "../../../contexts/HealthContext";
import { useNutrition } from "../../../contexts/NutritionContext";

function NutritionHome() {
  const { health } = useHealthActivity();
  const { selectedDate, setSelectedDate, byDate, save } = useNutrition();

  const currentNutrition = byDate[selectedDate];
  
  // หาเป้าหมายล่าสุด (ไม่ว่าจะเป็นวันที่ไหน)
  const latestNutrition = Object.values(byDate).reduce((latest, nutrition) => {
    if (!latest || !nutrition.date) return nutrition;
    if (!nutrition.date) return latest;
    return new Date(nutrition.date) > new Date(latest.date) ? nutrition : latest;
  }, undefined as any);
  
  console.log("NutritionHome render:", {
    selectedDate,
    byDate,
    currentNutrition,
    latestNutrition,
    health
  });

  const handleNutritionSubmit = async (data: { goal: string; total_calories_per_day: number; note?: string; date: string; }) => {
    await save(data);
  };

  const handleGoalUpdate = async (newGoal: string) => {
    if (latestNutrition) {
      await save({
        goal: newGoal,
        total_calories_per_day: latestNutrition.total_calories_per_day,
        note: latestNutrition.note,
        date: latestNutrition.date,
      });
    }
  };

  return (
    <div
      style={{
        padding: "2rem",
        backgroundImage: "url('/gym.jpg')",
        backgroundSize: "cover",
        minHeight: "100vh",
      }}
    >
      <h1 style={{ 
        fontFamily: "serif", 
        fontSize: "3rem", 
        color: "white", 
        textAlign: "center",
        textShadow: "0 2px 4px rgba(0,0,0,0.5)",
        marginBottom: "2rem"
      }}>
        Nutrition Planner
      </h1>

      {/* Nutrition Display with enhanced UI */}
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <NutritionDisplay
          currentNutrition={currentNutrition}
          latestNutrition={latestNutrition}
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          onNutritionSubmit={handleNutritionSubmit}
          onGoalUpdate={handleGoalUpdate}
          health={health}
        />
      </div>
    </div>
  );
}

export default NutritionHome;