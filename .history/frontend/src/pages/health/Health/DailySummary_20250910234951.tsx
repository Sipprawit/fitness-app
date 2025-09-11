import type { HealthData } from "../../../interface/HealthData";
import type { Activity } from "../../../interface/Activity";

interface Props {
  health: HealthData | null;
  activities: Activity[];
}

function DailySummary({ health, activities }: Props) {
  if (!health) {
    return (
      <div style={emptyStateStyle}>
        <div style={emptyIconStyle}>📊</div>
        <h3 style={emptyTitleStyle}>ยังไม่มีข้อมูลสุขภาพ</h3>
        <p style={emptySubtitleStyle}>กรุณาเพิ่มข้อมูลสุขภาพของคุณ</p>
      </div>
    );
  }

  const totalCaloriesBurned = activities.reduce((total, activity) => {
    return total + (activity.calories || 0);
  }, 0);

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h3 style={titleStyle}>📊 สรุปประจำวัน</h3>
        <p style={subtitleStyle}>ข้อมูลสุขภาพและกิจกรรมของคุณ</p>
      </div>

      <div style={contentGridStyle}>
        {/* Health Summary Card */}
        <div style={cardStyle}>
          <div style={cardHeaderStyle}>
            <span style={cardIconStyle}>💪</span>
            <h4 style={cardTitleStyle}>ข้อมูลสุขภาพ</h4>
          </div>
          <div style={dataGridStyle}>
            <div style={dataItemStyle}>
              <span style={dataLabelStyle}>น้ำหนัก</span>
              <span style={dataValueStyle}>{health.weight} กก.</span>
            </div>
            <div style={dataItemStyle}>
              <span style={dataLabelStyle}>ส่วนสูง</span>
              <span style={dataValueStyle}>{health.height} ซม.</span>
            </div>
            <div style={dataItemStyle}>
              <span style={dataLabelStyle}>BMI</span>
              <span style={dataValueStyle}>{health.bmi}</span>
            </div>
            <div style={dataItemStyle}>
              <span style={dataLabelStyle}>ไขมัน</span>
              <span style={dataValueStyle}>{health.fat}%</span>
            </div>
          </div>
        </div>

        {/* Activities Summary Card */}
        <div style={cardStyle}>
          <div style={cardHeaderStyle}>
            <span style={cardIconStyle}>🏃‍♂️</span>
            <h4 style={cardTitleStyle}>กิจกรรม</h4>
          </div>
          <div style={dataGridStyle}>
            <div style={dataItemStyle}>
              <span style={dataLabelStyle}>จำนวนกิจกรรม</span>
              <span style={dataValueStyle}>{activities.length} กิจกรรม</span>
            </div>
            <div style={dataItemStyle}>
              <span style={dataLabelStyle}>แคลอรี่เผาผลาญ</span>
              <span style={dataValueStyle}>{totalCaloriesBurned} แคลอรี่</span>
            </div>
            <div style={dataItemStyle}>
              <span style={dataLabelStyle}>เวลารวม</span>
              <span style={dataValueStyle}>
                {activities.reduce((total, activity) => total + (activity.duration || 0), 0)} นาที
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Note Section - Only show if note exists in health data */}
      {(health as any).note && (
        <div style={noteCardStyle}>
          <div style={noteHeaderStyle}>
            <span style={noteIconStyle}>📝</span>
            <h4 style={noteTitleStyle}>หมายเหตุ</h4>
          </div>
          <p style={noteContentStyle}>{(health as any).note}</p>
        </div>
      )}

      {/* Date */}
      <div style={dateStyle}>
        อัปเดตล่าสุด: {health.date}
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
  maxWidth: "800px",
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

const noteCardStyle: React.CSSProperties = {
  background: "rgba(255, 255, 255, 0.8)",
  padding: "1.5rem",
  borderRadius: "15px",
  border: "1px solid #fecaca",
  boxShadow: "0 8px 20px rgba(197, 0, 0, 0.1)",
  marginBottom: "1.5rem",
};

const noteHeaderStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "0.75rem",
  marginBottom: "1rem",
};

const noteIconStyle: React.CSSProperties = {
  fontSize: "1.25rem",
  color: "#c50000",
};

const noteTitleStyle: React.CSSProperties = {
  color: "#c50000",
  fontSize: "1rem",
  margin: 0,
  fontWeight: "600",
};

const noteContentStyle: React.CSSProperties = {
  color: "#374151",
  fontSize: "0.9rem",
  lineHeight: "1.6",
  margin: 0,
  padding: "1rem",
  background: "rgba(255, 255, 255, 0.6)",
  borderRadius: "10px",
  border: "1px solid #fecaca",
};

const dateStyle: React.CSSProperties = {
  textAlign: "center",
  color: "#6b7280",
  fontSize: "0.85rem",
  fontWeight: "500",
};

const emptyStateStyle: React.CSSProperties = {
  background: "rgba(255, 255, 255, 0.9)",
  backdropFilter: "blur(10px)",
  WebkitBackdropFilter: "blur(10px)",
  padding: "3rem 2rem",
  borderRadius: "20px",
  border: "2px solid rgba(254, 202, 202, 0.6)",
  boxShadow: "0 20px 40px rgba(197, 0, 0, 0.15)",
  textAlign: "center",
  maxWidth: "400px",
  width: "100%",
};

const emptyIconStyle: React.CSSProperties = {
  fontSize: "4rem",
  marginBottom: "1rem",
  color: "#c50000",
  filter: "drop-shadow(0 4px 8px rgba(197, 0, 0, 0.2))",
};

const emptyTitleStyle: React.CSSProperties = {
  color: "#c50000",
  fontSize: "1.25rem",
  margin: "0 0 0.5rem 0",
  fontWeight: "600",
};

const emptySubtitleStyle: React.CSSProperties = {
  color: "#6b7280",
  fontSize: "0.9rem",
  margin: 0,
  fontWeight: "500",
};

export default DailySummary;
