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
