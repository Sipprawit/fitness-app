import type { HealthData } from "../../../interface/HealthData";
import type { Activity } from "../../../interface/Activity";
import type { NutritionData } from "../../../interface/Nutrition";

interface Props {
  health: HealthData | null;
  activities: Activity[];
  nutrition: NutritionData | null;
  allHealthData: HealthData[];
  allActivities: Activity[];
}

function WeeklySummary({ health, activities, nutrition, allHealthData, allActivities }: Props) {
  // คำนวณข้อมูลของสัปดาห์นี้ (7 วันล่าสุด)
  const getWeeklyData = () => {
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - 6); // 7 วันรวมวันนี้

    // กรองข้อมูลสุขภาพของสัปดาห์นี้
    const weeklyHealth = allHealthData.filter(h => {
      if (!h.date) return false;
      const healthDate = new Date(h.date);
      return healthDate >= weekStart && healthDate <= today;
    });

    // กรองข้อมูลกิจกรรมของสัปดาห์นี้
    const weeklyActivities = allActivities.filter(activity => {
      if (!activity.date) return false;
      const activityDate = new Date(activity.date);
      return activityDate >= weekStart && activityDate <= today;
    });

    // คำนวณสถิติ
    const totalCaloriesBurned = weeklyActivities.reduce((sum, activity) => sum + (activity.calories || 0), 0);
    const totalActivityMinutes = weeklyActivities.reduce((sum, activity) => sum + (activity.duration || 0), 0);
    const activityCount = weeklyActivities.length;
    
    // คำนวณน้ำหนักเฉลี่ย
    const weights = weeklyHealth.map(h => h.weight).filter(w => w && w > 0);
    const averageWeight = weights.length > 0 ? weights.reduce((sum, weight) => sum + weight, 0) / weights.length : 0;

    // คำนวณแคลอรี่ที่บริโภคต่อวัน (ถ้ามีข้อมูลโภชนาการ)
    const dailyCalories = nutrition?.total_calories_per_day || 0;
    const totalCaloriesConsumed = dailyCalories * 7; // 7 วัน

    return {
      totalCaloriesBurned,
      totalCaloriesConsumed,
      totalActivityMinutes,
      averageWeight,
      activityCount,
      weeklyHealth,
      weeklyActivities
    };
  };

  const weeklyData = getWeeklyData();
  const calorieBalance = weeklyData.totalCaloriesConsumed - weeklyData.totalCaloriesBurned;

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h3 style={titleStyle}>📅 สรุปรายสัปดาห์</h3>
        <p style={subtitleStyle}>สถิติ 7 วันล่าสุดของคุณ</p>
      </div>

      <div style={contentGridStyle}>
        {/* แคลอรี่สมดุล */}
        <div style={cardStyle}>
          <div style={cardHeaderStyle}>
            <span style={cardIconStyle}>⚖️</span>
            <h4 style={cardTitleStyle}>แคลอรี่สมดุล</h4>
          </div>
          <div style={dataGridStyle}>
            <div style={dataItemStyle}>
              <span style={dataLabelStyle}>บริโภค</span>
              <span style={dataValueStyle}>{weeklyData.totalCaloriesConsumed.toFixed(0)} kcal</span>
            </div>
            <div style={dataItemStyle}>
              <span style={dataLabelStyle}>เผาผลาญ</span>
              <span style={dataValueStyle}>{weeklyData.totalCaloriesBurned.toFixed(0)} kcal</span>
            </div>
            <div style={dataItemStyle}>
              <span style={dataLabelStyle}>สมดุล</span>
              <span style={{
                ...dataValueStyle,
                color: calorieBalance > 0 ? "#ef4444" : "#10b981"
              }}>
                {calorieBalance > 0 ? "+" : ""}{calorieBalance.toFixed(0)} kcal
              </span>
            </div>
          </div>
        </div>

        {/* กิจกรรม */}
        <div style={cardStyle}>
          <div style={cardHeaderStyle}>
            <span style={cardIconStyle}>🏃‍♂️</span>
            <h4 style={cardTitleStyle}>กิจกรรม</h4>
          </div>
          <div style={dataGridStyle}>
            <div style={dataItemStyle}>
              <span style={dataLabelStyle}>จำนวนกิจกรรม</span>
              <span style={dataValueStyle}>{weeklyData.activityCount} ครั้ง</span>
            </div>
            <div style={dataItemStyle}>
              <span style={dataLabelStyle}>เวลารวม</span>
              <span style={dataValueStyle}>{Math.round(weeklyData.totalActivityMinutes / 60)} ชม.</span>
            </div>
            <div style={dataItemStyle}>
              <span style={dataLabelStyle}>แคลอรี่เผาผลาญ</span>
              <span style={dataValueStyle}>{weeklyData.totalCaloriesBurned.toFixed(0)} kcal</span>
            </div>
          </div>
        </div>

        {/* น้ำหนัก */}
        <div style={cardStyle}>
          <div style={cardHeaderStyle}>
            <span style={cardIconStyle}>⚖️</span>
            <h4 style={cardTitleStyle}>น้ำหนัก</h4>
          </div>
          <div style={dataGridStyle}>
            <div style={dataItemStyle}>
              <span style={dataLabelStyle}>น้ำหนักเฉลี่ย</span>
              <span style={dataValueStyle}>{weeklyData.averageWeight.toFixed(1)} กก.</span>
            </div>
            <div style={dataItemStyle}>
              <span style={dataLabelStyle}>จำนวนการบันทึก</span>
              <span style={dataValueStyle}>{weeklyData.weeklyHealth.length} ครั้ง</span>
            </div>
            <div style={dataItemStyle}>
              <span style={dataLabelStyle}>ล่าสุด</span>
              <span style={dataValueStyle}>{health?.weight || 0} กก.</span>
            </div>
          </div>
        </div>
      </div>

      {/* วันที่ */}
      <div style={dateStyle}>
        สัปดาห์นี้ ({new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toLocaleDateString('th-TH')} - {new Date().toLocaleDateString('th-TH')})
      </div>
    </div>
  );
}

// Styles with white-red theme
const containerStyle: React.CSSProperties = {
  background: "rgba(255, 255, 255, 0.9)",
  backdropFilter: "blur(10px)",
  WebkitBackdropFilter: "blur(10px)",
  padding: "2rem",
  borderRadius: "20px",
  border: "2px solid rgba(254, 202, 202, 0.6)",
  boxShadow: "0 20px 40px rgba(197, 0, 0, 0.15)",
  maxWidth: "1000px",
  width: "100%",
};

const headerStyle: React.CSSProperties = {
  textAlign: "center",
  marginBottom: "2rem",
  paddingBottom: "1.5rem",
  borderBottom: "2px solid #fecaca",
};

const titleStyle: React.CSSProperties = {
  color: "#c50000",
  fontSize: "1.5rem",
  margin: "0 0 0.5rem 0",
  fontWeight: "700",
  textShadow: "0 2px 4px rgba(197, 0, 0, 0.1)",
};

const subtitleStyle: React.CSSProperties = {
  color: "#6b7280",
  fontSize: "0.9rem",
  margin: 0,
  fontWeight: "500",
};

const contentGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
  gap: "1.5rem",
  marginBottom: "2rem",
};

const cardStyle: React.CSSProperties = {
  background: "rgba(255, 255, 255, 0.8)",
  padding: "1.5rem",
  borderRadius: "15px",
  border: "1px solid #fecaca",
  boxShadow: "0 8px 20px rgba(197, 0, 0, 0.1)",
};

const cardHeaderStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "0.75rem",
  marginBottom: "1rem",
  paddingBottom: "0.75rem",
  borderBottom: "1px solid #fecaca",
};

const cardIconStyle: React.CSSProperties = {
  fontSize: "1.5rem",
  filter: "drop-shadow(0 2px 4px rgba(197, 0, 0, 0.2))",
};

const cardTitleStyle: React.CSSProperties = {
  color: "#c50000",
  fontSize: "1.1rem",
  margin: 0,
  fontWeight: "600",
};

const dataGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
  gap: "1rem",
};

const dataItemStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  textAlign: "center",
  padding: "0.75rem",
  background: "rgba(255, 255, 255, 0.6)",
  borderRadius: "10px",
  border: "1px solid #fecaca",
};

const dataLabelStyle: React.CSSProperties = {
  color: "#6b7280",
  fontSize: "0.8rem",
  fontWeight: "500",
  marginBottom: "0.25rem",
};

const dataValueStyle: React.CSSProperties = {
  color: "#c50000",
  fontSize: "1.1rem",
  fontWeight: "700",
};

const dateStyle: React.CSSProperties = {
  textAlign: "center",
  color: "#6b7280",
  fontSize: "0.85rem",
  fontWeight: "500",
};

export default WeeklySummary;
