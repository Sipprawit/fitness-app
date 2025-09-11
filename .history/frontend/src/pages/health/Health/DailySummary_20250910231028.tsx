import { useState } from "react";
import type { HealthData } from "../../../interface/HealthData";
import type { Activity } from "../../../interface/Activity";

interface DailySummaryProps {
  health: HealthData | null;
  activities: Activity[];
}

export default function DailySummary({ health, activities }: DailySummaryProps) {
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split("T")[0]);

  if (!health) {
    return (
      <div style={emptyStateContainerStyle}>
        <div style={emptyStateIconStyle}>📊</div>
        <h2 style={emptyStateTitleStyle}>สรุปข้อมูลประจำวัน</h2>
        <p style={emptyStateTextStyle}>กรุณากรอกและบันทึกข้อมูลสุขภาพของคุณ</p>
      </div>
    );
  }

  const activitiesByDate = activities.reduce<Record<string, Activity[]>>((acc, act) => {
    // ใช้ CreatedAt หรือ date ตามที่มี
    const date = (act as any).CreatedAt ? 
      new Date((act as any).CreatedAt).toISOString().split("T")[0] : 
      (act.date ?? new Date().toISOString().split("T")[0]);
    if (!acc[date]) acc[date] = [];
    acc[date].push(act);
    return acc;
  }, {});

  const sortedDates = Object.keys(activitiesByDate).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  );

  // กรองข้อมูลตามวันที่ที่เลือก
  const filteredActivities = activitiesByDate[selectedDate] || [];

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={headerContainerStyle}>
        <div style={headerIconStyle}>📊</div>
        <h2 style={headerTitleStyle}>สรุปข้อมูลประจำวัน</h2>
        <p style={headerSubtitleStyle}>
          {new Date(selectedDate).toLocaleDateString('th-TH', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </p>
      </div>
      
      {/* Date Selector */}
      <div style={dateSelectorContainerStyle}>
        <div style={dateSelectorStyle}>
          <label style={dateLabelStyle}>
            📅 เลือกวันที่:
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            style={dateInputStyle}
          />
        </div>
        <div style={dateInfoStyle}>
          วันที่ที่มีข้อมูล: {sortedDates.length > 0 ? sortedDates.join(", ") : "ไม่มีข้อมูล"}
        </div>
      </div>

      {/* Health Data Card */}
      <div style={cardStyle}>
        <div style={cardHeaderStyle}>
          <div style={cardIconStyle}>💪</div>
          <h3 style={cardTitleStyle}>
            ข้อมูลสุขภาพล่าสุด
          </h3>
          <p style={cardSubtitleStyle}>
            วันที่: {new Date(health.date ?? new Date()).toLocaleDateString("th-TH")}
          </p>
        </div>
        
        <div style={healthDataGridStyle}>
          <div style={healthDataItemStyle}>
            <div style={healthDataIconStyle}>📏</div>
            <div style={healthDataValueStyle}>{health.height}</div>
            <div style={healthDataLabelStyle}>ส่วนสูง (ซม.)</div>
          </div>
          
          <div style={healthDataItemStyle}>
            <div style={healthDataIconStyle}>⚖️</div>
            <div style={healthDataValueStyle}>{health.weight}</div>
            <div style={healthDataLabelStyle}>น้ำหนัก (กก.)</div>
          </div>
          
          <div style={healthDataItemStyle}>
            <div style={healthDataIconStyle}>💪</div>
            <div style={healthDataValueStyle}>{health.fat}%</div>
            <div style={healthDataLabelStyle}>ไขมันในร่างกาย</div>
          </div>
          
          <div style={healthDataItemStyle}>
            <div style={healthDataIconStyle}>🩺</div>
            <div style={healthDataValueStyle}>{health.pressure}</div>
            <div style={healthDataLabelStyle}>ความดันโลหิต</div>
          </div>
          
          <div style={healthDataItemStyle}>
            <div style={healthDataIconStyle}>📊</div>
            <div style={healthDataValueStyle}>{health.bmi}</div>
            <div style={healthDataLabelStyle}>BMI</div>
          </div>
          
          <div style={healthDataItemStyle}>
            <div style={healthDataIconStyle}>✅</div>
            <div style={healthDataValueStyle}>{health.status}</div>
            <div style={healthDataLabelStyle}>สถานะ</div>
          </div>
        </div>
      </div>

      {/* Activities Card */}
      <div style={cardStyle}>
        <div style={cardHeaderStyle}>
          <div style={cardIconStyle}>🏃‍♂️</div>
          <h3 style={cardTitleStyle}>
            กิจกรรมประจำวัน
          </h3>
          <p style={cardSubtitleStyle}>
            วันที่: {new Date(selectedDate).toLocaleDateString("th-TH")}
          </p>
        </div>
        
        {filteredActivities.length === 0 ? (
          <div style={emptyActivitiesStyle}>
            <div style={emptyActivitiesIconStyle}>🏃‍♂️</div>
            <h4 style={emptyActivitiesTitleStyle}>ยังไม่มีกิจกรรม</h4>
            <p style={emptyActivitiesTextStyle}>ยังไม่มีข้อมูลกิจกรรมสำหรับวันที่นี้</p>
          </div>
        ) : (
          <div style={activitiesListStyle}>
            {filteredActivities.map((act, index) => (
              <div key={(act as any).ID || act.id || (act as any).CreatedAt || index} style={activityItemStyle}>
                <div style={activityIconStyle}>
                  {act.type === "วิ่ง" ? "🏃‍♂️" : 
                   act.type === "เดิน" ? "🚶‍♂️" : 
                   act.type === "ปั่นจักรยาน" ? "🚴‍♂️" : 
                   act.type === "ว่ายน้ำ" ? "🏊‍♂️" : 
                   act.type === "ยกน้ำหนัก" ? "🏋️‍♂️" : 
                   act.type === "โยคะ" ? "🧘‍♀️" : "💪"}
                </div>
                
                <div style={activityInfoStyle}>
                  <div style={activityTypeStyle}>{act.type}</div>
                  <div style={activityDetailsStyle}>
                    <span>📏 {act.distance} กม.</span>
                    <span>⏱️ {act.duration} ชม.</span>
                    <span>🔥 {act.calories} แคลอรี่</span>
                  </div>
                </div>
                
                <div style={activityTimeStyle}>
                  {(act as any).CreatedAt ? 
                    new Date((act as any).CreatedAt).toLocaleTimeString("th-TH", { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    }) : 
                    "ไม่ระบุ"
                  }
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Styles with white-red theme
const emptyStateContainerStyle: React.CSSProperties = {
  marginTop: "2rem",
  maxWidth: "980px",
  margin: "0 auto",
  padding: "3rem 2rem",
  background: "linear-gradient(135deg, #ffffff 0%, #fef2f2 100%)",
  borderRadius: "20px",
  border: "2px solid #fecaca",
  textAlign: "center",
  boxShadow: "0 20px 40px rgba(197, 0, 0, 0.15)",
};

const emptyStateIconStyle: React.CSSProperties = {
  fontSize: "4rem",
  marginBottom: "1.5rem",
  filter: "drop-shadow(0 4px 8px rgba(197, 0, 0, 0.2))",
};

const emptyStateTitleStyle: React.CSSProperties = {
  color: "#c50000",
  fontWeight: "700",
  fontSize: "1.75rem",
  margin: "0 0 1rem 0",
  textShadow: "0 2px 4px rgba(197, 0, 0, 0.1)",
};

const emptyStateTextStyle: React.CSSProperties = {
  color: "#6b7280",
  fontSize: "1rem",
  margin: 0,
};

const containerStyle: React.CSSProperties = {
  marginTop: "2rem",
  maxWidth: "980px",
  margin: "0 auto",
  padding: "2rem",
  background: "linear-gradient(135deg, #ffffff 0%, #fef2f2 100%)",
  borderRadius: "20px",
  border: "2px solid #fecaca",
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
  fontWeight: "700",
  fontSize: "1.75rem",
  margin: "0 0 0.5rem 0",
  textShadow: "0 2px 4px rgba(197, 0, 0, 0.1)",
};

const headerSubtitleStyle: React.CSSProperties = {
  color: "#dc2626",
  fontSize: "1rem",
  fontWeight: "500",
  margin: 0,
};

const dateSelectorContainerStyle: React.CSSProperties = {
  marginBottom: "2rem",
  textAlign: "center",
};

const dateSelectorStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "1rem",
  backgroundColor: "rgba(255,255,255,0.9)",
  padding: "1rem 1.5rem",
  borderRadius: "15px",
  boxShadow: "0 8px 20px rgba(197, 0, 0, 0.1)",
  marginBottom: "1rem",
};

const dateLabelStyle: React.CSSProperties = {
  color: "#374151",
  fontWeight: "600",
  fontSize: "1rem",
};

const dateInputStyle: React.CSSProperties = {
  padding: "0.5rem 1rem",
  borderRadius: "8px",
  border: "2px solid #fecaca",
  fontSize: "1rem",
  fontWeight: "500",
  backgroundColor: "#fff",
  color: "#374151",
  outline: "none",
  transition: "all 0.2s ease",
  boxShadow: "0 2px 4px rgba(197, 0, 0, 0.05)",
};

const dateInfoStyle: React.CSSProperties = {
  fontSize: "0.9rem",
  color: "#6b7280",
  fontStyle: "italic",
};

const cardStyle: React.CSSProperties = {
  backgroundColor: "rgba(255,255,255,0.9)",
  padding: "2rem",
  borderRadius: "15px",
  boxShadow: "0 8px 20px rgba(197, 0, 0, 0.08)",
  marginBottom: "2rem",
  border: "1px solid #fecaca",
};

const cardHeaderStyle: React.CSSProperties = {
  textAlign: "center",
  marginBottom: "2rem",
  paddingBottom: "1rem",
  borderBottom: "1px solid #fecaca",
};

const cardIconStyle: React.CSSProperties = {
  fontSize: "2.5rem",
  marginBottom: "1rem",
  filter: "drop-shadow(0 2px 4px rgba(197, 0, 0, 0.2))",
};

const cardTitleStyle: React.CSSProperties = {
  color: "#c50000",
  fontSize: "1.25rem",
  fontWeight: "600",
  margin: "0 0 0.5rem 0",
};

const cardSubtitleStyle: React.CSSProperties = {
  color: "#6b7280",
  fontSize: "0.9rem",
  margin: 0,
};

const healthDataGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
  gap: "1.5rem",
};

const healthDataItemStyle: React.CSSProperties = {
  backgroundColor: "rgba(255,255,255,0.8)",
  padding: "1.5rem",
  borderRadius: "12px",
  textAlign: "center",
  boxShadow: "0 4px 8px rgba(197, 0, 0, 0.05)",
  border: "1px solid #fecaca",
};

const healthDataIconStyle: React.CSSProperties = {
  fontSize: "2rem",
  marginBottom: "0.5rem",
};

const healthDataValueStyle: React.CSSProperties = {
  fontSize: "1.5rem",
  fontWeight: "700",
  color: "#c50000",
  marginBottom: "0.25rem",
};

const healthDataLabelStyle: React.CSSProperties = {
  color: "#64748b",
  fontSize: "0.8rem",
  fontWeight: "500",
};

const emptyActivitiesStyle: React.CSSProperties = {
  textAlign: "center",
  padding: "3rem 2rem",
  color: "#6b7280",
};

const emptyActivitiesIconStyle: React.CSSProperties = {
  fontSize: "3rem",
  marginBottom: "1rem",
  opacity: 0.5,
};

const emptyActivitiesTitleStyle: React.CSSProperties = {
  margin: "0 0 0.5rem 0",
  color: "#64748b",
  fontSize: "1.1rem",
  fontWeight: "600",
};

const emptyActivitiesTextStyle: React.CSSProperties = {
  margin: 0,
  fontSize: "0.9rem",
};

const activitiesListStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
};

const activityItemStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "1rem",
  backgroundColor: "rgba(255,255,255,0.8)",
  padding: "1.5rem",
  borderRadius: "12px",
  boxShadow: "0 4px 8px rgba(197, 0, 0, 0.05)",
  border: "1px solid #fecaca",
  transition: "all 0.2s ease",
};

const activityIconStyle: React.CSSProperties = {
  fontSize: "2rem",
  minWidth: "3rem",
  textAlign: "center",
};

const activityInfoStyle: React.CSSProperties = {
  flex: 1,
};

const activityTypeStyle: React.CSSProperties = {
  fontSize: "1.1rem",
  fontWeight: "600",
  color: "#c50000",
  marginBottom: "0.25rem",
};

const activityDetailsStyle: React.CSSProperties = {
  display: "flex",
  gap: "1rem",
  fontSize: "0.9rem",
  color: "#64748b",
  flexWrap: "wrap",
};

const activityTimeStyle: React.CSSProperties = {
  fontSize: "0.8rem",
  color: "#9ca3af",
  textAlign: "right",
  minWidth: "4rem",
};
