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

  const cardStyle: React.CSSProperties = {
    background: "linear-gradient(135deg, #f7f9fc 0%, #666 100%)",
    padding: "1.5rem",
    borderRadius: 16,
    boxShadow: "0 10px 24px rgba(0,0,0,0.08)",
    minWidth: 320,
    maxWidth: 420,
    border: "1px solid #eef2f7",
  };

  const headerStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1rem",
  };

  const titleStyle: React.CSSProperties = {
    margin: 0,
    color: "#000",
    fontSize: "1.25rem",
    fontWeight: 700,
    letterSpacing: 0.2,
  };

  const dateBadgeStyle: React.CSSProperties = {
    background: "#eef2ff",
    color: "#3730a3",
    border: "1px solid #e0e7ff",
    padding: "0.25rem 0.5rem",
    borderRadius: 8,
    fontSize: "0.8rem",
    fontWeight: 600,
  };

  const gridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "0.75rem",
  };

  const itemStyle: React.CSSProperties = {
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: 12,
    padding: "0.75rem",
    boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: "0.8rem",
    color: "#6b7280",
    marginBottom: 4,
  };

  const valueStyle: React.CSSProperties = {
    fontSize: "1.1rem",
    color: "#111827",
    fontWeight: 700,
  };

  const statusChipStyle: React.CSSProperties = {
    display: "inline-block",
    padding: "0.35rem 0.6rem",
    borderRadius: 999,
    fontSize: "0.85rem",
    fontWeight: 700,
    border: "1px solid #e5e7eb",
    background: getStatusBg(health.status),
    color: getStatusColor(health.status),
    marginTop: 8,
  };

  const dateText = new Date(health.date ?? new Date()).toLocaleDateString("th-TH");

  return (
    <div style={cardStyle}>
      <div style={headerStyle}>
        <h3 style={titleStyle}>ข้อมูลสุขภาพล่าสุด</h3>
        <span style={dateBadgeStyle}>วันที่: {dateText}</span>
      </div>
      <div style={gridStyle}>
        <div style={itemStyle}>
          <div style={labelStyle}>ส่วนสูง</div>
          <div style={valueStyle}>{health.height} ซม.</div>
        </div>
        <div style={itemStyle}>
          <div style={labelStyle}>น้ำหนัก</div>
          <div style={valueStyle}>{health.weight} กก.</div>
        </div>
        <div style={itemStyle}>
          <div style={labelStyle}>เปอร์เซ็นต์ไขมัน</div>
          <div style={valueStyle}>{health.fat ?? 0} %</div>
        </div>
        <div style={itemStyle}>
          <div style={labelStyle}>ความดัน</div>
          <div style={valueStyle}>{health.pressure ?? "-"}</div>
        </div>
        <div style={itemStyle}>
          <div style={labelStyle}>ค่า BMI</div>
          <div style={valueStyle}>{health.bmi}</div>
        </div>
        <div style={{ ...itemStyle, display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
          <div style={labelStyle}>สถานะ</div>
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

export default HealthDisplay;
