import type { HealthData } from "../../../interface/HealthData";

interface Props {
  health: HealthData | null;
}

function HealthDisplay({ health }: Props) {
  if (!health) {
    return (
      <div style={emptyCardStyle}>
        <div style={emptyIconStyle}>❤️</div>
        <h3 style={emptyTitleStyle}>ยังไม่มีข้อมูลสุขภาพ</h3>
        <p style={emptySubtitleStyle}>กรุณากรอกข้อมูลสุขภาพก่อน เพื่อแสดงผลและคำนวณโภชนาการได้แม่นยำ</p>
        <p style={emptyTipsStyle}>แนะนำ: กรอกส่วนสูง/น้ำหนัก เพื่อให้ระบบคำนวณ BMI และสถานะสุขภาพ</p>
        <button style={emptyButtonStyle} onClick={() => window.location.assign("/health/Health")}>
          <span>💪</span>
          ไปกรอกข้อมูลสุขภาพ
        </button>
      </div>
    );
  }

  const dateText = new Date(health.date ?? new Date()).toLocaleDateString("th-TH");

  return (
    <div style={cardStyle}>
      <div style={headerStyle}>
        <h3 style={titleStyle}>💪 ข้อมูลสุขภาพล่าสุด</h3>
        <span style={dateBadgeStyle}>📅 {dateText}</span>
      </div>
      <div style={gridStyle}>
        <div style={itemStyle}>
          <div style={labelStyle}>📏 ส่วนสูง</div>
          <div style={valueStyle}>{health.height} ซม.</div>
        </div>
        <div style={itemStyle}>
          <div style={labelStyle}>⚖️ น้ำหนัก</div>
          <div style={valueStyle}>{health.weight} กก.</div>
        </div>
        <div style={itemStyle}>
          <div style={labelStyle}>💪 เปอร์เซ็นต์ไขมัน</div>
          <div style={valueStyle}>{health.fat ?? 0} %</div>
        </div>
        <div style={itemStyle}>
          <div style={labelStyle}>🩺 ความดัน</div>
          <div style={valueStyle}>{health.pressure ?? "-"}</div>
        </div>
        <div style={itemStyle}>
          <div style={labelStyle}>📊 ค่า BMI</div>
          <div style={valueStyle}>{health.bmi}</div>
        </div>
        <div style={{ ...itemStyle, display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
          <div style={labelStyle}>✅ สถานะ</div>
          <span style={statusChipStyle}>{health.status}</span>
        </div>
      </div>
    </div>
  );
}

function getStatusColor(status?: string): string {
  const s = (status || "").toLowerCase();
  if (s.includes("ผอม") || s.includes("under")) return "#1d4ed8"; // blue
  if (s.includes("สมส่วน") || s.includes("normal")) return "#065f46"; // green
  if (s.includes("เกิน") || s.includes("over")) return "#92400e"; // amber
  if (s.includes("อ้วน") || s.includes("obese")) return "#7f1d1d"; // red-dark
  return "#374151";
}

function getStatusBg(status?: string): string {
  const s = (status || "").toLowerCase();
  if (s.includes("ผอม") || s.includes("under")) return "#dbeafe"; // blue-100
  if (s.includes("สมส่วน") || s.includes("normal")) return "#d1fae5"; // green-100
  if (s.includes("เกิน") || s.includes("over")) return "#ffedd5"; // amber-100
  if (s.includes("อ้วน") || s.includes("obese")) return "#fee2e2"; // red-100
  return "#f3f4f6"; // gray-100
}

// Styles with white-red theme
const emptyCardStyle: React.CSSProperties = {
  background: "linear-gradient(135deg, #ffffff 0%, #fef2f2 100%)",
  padding: "2rem",
  borderRadius: "20px",
  minWidth: "340px",
  maxWidth: "460px",
  border: "2px solid #fecaca",
  boxShadow: "0 20px 40px rgba(197, 0, 0, 0.15)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
  gap: "1rem",
};

const emptyIconStyle: React.CSSProperties = {
  width: "80px",
  height: "80px",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "linear-gradient(135deg, #fecaca 0%, #fca5a5 100%)",
  color: "#c50000",
  border: "2px solid #fecaca",
  boxShadow: "0 8px 20px rgba(197, 0, 0, 0.2)",
  fontSize: "2.5rem",
  filter: "drop-shadow(0 2px 4px rgba(197, 0, 0, 0.3))",
};

const emptyTitleStyle: React.CSSProperties = {
  margin: 0,
  color: "#c50000",
  fontSize: "1.5rem",
  fontWeight: "700",
  textShadow: "0 2px 4px rgba(197, 0, 0, 0.1)",
};

const emptySubtitleStyle: React.CSSProperties = {
  margin: 0,
  color: "#dc2626",
  fontSize: "1rem",
  lineHeight: 1.6,
  fontWeight: "500",
};

const emptyTipsStyle: React.CSSProperties = {
  margin: 0,
  color: "#6b7280",
  fontSize: "0.9rem",
  fontStyle: "italic",
};

const emptyButtonStyle: React.CSSProperties = {
  marginTop: "1rem",
  padding: "1rem 1.5rem",
  borderRadius: "12px",
  border: "none",
  background: "linear-gradient(135deg, #c50000 0%, #dc2626 100%)",
  color: "#ffffff",
  fontWeight: "700",
  cursor: "pointer",
  boxShadow: "0 8px 20px rgba(197, 0, 0, 0.3)",
  fontSize: "1rem",
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
  transition: "all 0.3s ease",
};

const cardStyle: React.CSSProperties = {
  background: "linear-gradient(135deg, #ffffff 0%, #fef2f2 100%)",
  padding: "2rem",
  borderRadius: "20px",
  boxShadow: "0 20px 40px rgba(197, 0, 0, 0.15)",
  minWidth: "320px",
  maxWidth: "420px",
  border: "2px solid #fecaca",
};

const headerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "1.5rem",
  paddingBottom: "1rem",
  borderBottom: "2px solid #fecaca",
};

const titleStyle: React.CSSProperties = {
  margin: 0,
  color: "#c50000",
  fontSize: "1.25rem",
  fontWeight: "700",
  textShadow: "0 2px 4px rgba(197, 0, 0, 0.1)",
};

const dateBadgeStyle: React.CSSProperties = {
  background: "linear-gradient(135deg, #fecaca 0%, #fca5a5 100%)",
  color: "#c50000",
  border: "1px solid #fecaca",
  padding: "0.5rem 1rem",
  borderRadius: "12px",
  fontSize: "0.8rem",
  fontWeight: "600",
  boxShadow: "0 2px 4px rgba(197, 0, 0, 0.1)",
};

const gridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "1rem",
};

const itemStyle: React.CSSProperties = {
  background: "rgba(255,255,255,0.8)",
  border: "2px solid #fecaca",
  borderRadius: "12px",
  padding: "1rem",
  boxShadow: "0 4px 8px rgba(197, 0, 0, 0.05)",
  transition: "all 0.2s ease",
};

const labelStyle: React.CSSProperties = {
  fontSize: "0.8rem",
  color: "#6b7280",
  marginBottom: "0.5rem",
  fontWeight: "500",
};

const valueStyle: React.CSSProperties = {
  fontSize: "1.1rem",
  color: "#c50000",
  fontWeight: "700",
};

const getStatusChipStyle = (status?: string): React.CSSProperties => ({
  display: "inline-block",
  padding: "0.5rem 1rem",
  borderRadius: "20px",
  fontSize: "0.85rem",
  fontWeight: "700",
  border: "2px solid #fecaca",
  background: getStatusBg(status),
  color: getStatusColor(status),
  marginTop: "0.5rem",
  boxShadow: "0 2px 4px rgba(197, 0, 0, 0.1)",
});

export default HealthDisplay;
