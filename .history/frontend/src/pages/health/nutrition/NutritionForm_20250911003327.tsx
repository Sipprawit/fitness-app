import { useState } from "react";
// no direct use of NutritionData type in this component

interface Props {
  onSubmit: (data: { goal: string; total_calories_per_day: number; note?: string }) => void;
  currentGoal?: string;
  currentNote?: string;
}

function NutritionForm({ onSubmit, currentGoal, currentNote }: Props) {
  const [goal, setGoal] = useState(currentGoal || "");
  const [note, setNote] = useState(currentNote || "");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = () => {
    // ตรวจเฉพาะเป้าหมาย ส่วนแคลอรี่ให้ backend คำนวณอัตโนมัติ
    if (!goal.trim()) {
      alert("กรุณาระบุเป้าหมาย");
      return;
    }

    setSubmitting(true);

    onSubmit({
      goal: goal.trim(),
      total_calories_per_day: 0, // ให้ backend คำนวณอัตโนมัติ
      note: note.trim() || undefined,
      protein_g: proteinG ? parseFloat(proteinG) : undefined,
      fat_g: fatG ? parseFloat(fatG) : undefined,
      carb_g: carbG ? parseFloat(carbG) : undefined,
    });

    setSubmitting(false);
  };

// Styles with white-red theme
const containerStyle: React.CSSProperties = {
  background: "linear-gradient(135deg, #ffffff 0%, #fef2f2 100%)",
  padding: "2rem",
  borderRadius: "20px",
  maxWidth: "450px",
  width: "100%",
  boxShadow: "0 20px 40px rgba(197, 0, 0, 0.15)",
  border: "2px solid #fecaca",
  position: "relative",
  overflow: "hidden",
};

const headerContainerStyle: React.CSSProperties = {
  textAlign: "center",
  marginBottom: "2rem",
  paddingBottom: "1.5rem",
  borderBottom: "2px solid #fecaca",
};

const iconStyle: React.CSSProperties = {
  fontSize: "3rem",
  marginBottom: "1rem",
  filter: "drop-shadow(0 4px 8px rgba(197, 0, 0, 0.2))",
};

const headerStyle: React.CSSProperties = {
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

const formContainerStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "1.5rem",
};

const inputGroupStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "0.5rem",
};

const labelStyle: React.CSSProperties = {
  color: "#374151",
  fontSize: "0.9rem",
  fontWeight: "600",
  marginBottom: "0.25rem",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "1rem 1.25rem",
  borderRadius: "12px",
  border: "2px solid #fecaca",
  background: "#ffffff",
  color: "#1f2937",
  fontSize: "1rem",
  fontWeight: "500",
  boxSizing: "border-box",
  outline: "none",
  transition: "all 0.3s ease",
  boxShadow: "0 2px 4px rgba(197, 0, 0, 0.05)",
};

const textareaStyle: React.CSSProperties = {
  ...inputStyle,
  height: "110px",
  resize: "vertical",
  fontFamily: "inherit",
};

const buttonStyle: React.CSSProperties = {
  width: "100%",
  padding: "1rem 1.5rem",
  background: "linear-gradient(135deg, #c50000 0%, #dc2626 100%)",
  color: "#ffffff",
  fontSize: "1rem",
  fontWeight: "700",
  border: "none",
  borderRadius: "12px",
  cursor: "pointer",
  marginTop: "1rem",
  boxShadow: "0 8px 20px rgba(197, 0, 0, 0.3)",
  transition: "all 0.3s ease",
};

const buttonContentStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "0.5rem",
};

const spinnerStyle: React.CSSProperties = {
  animation: "spin 1s linear infinite",
};

  return (
    <div style={containerStyle}>
      <div style={headerContainerStyle}>
        <div style={iconStyle}>🍎</div>
        <h3 style={headerStyle}>วางแผนโภชนาการประจำวัน</h3>
        <p style={subtitleStyle}>กำหนดเป้าหมายและแผนการรับประทานอาหาร</p>
      </div>

      <div style={formContainerStyle}>
        <div style={inputGroupStyle}>
          <label style={labelStyle}>🎯 เป้าหมาย (Goal)</label>
          <input
            type="text"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            style={inputStyle}
            placeholder="เช่น ลดน้ำหนัก, เพิ่มกล้ามเนื้อ, รักษาน้ำหนัก"
          />
        </div>

        <div style={inputGroupStyle}>
          <label style={labelStyle}>📝 หมายเหตุ</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            style={textareaStyle}
            placeholder="เช่น แพ้อาหาร, ลดน้ำตาล, กินอาหารแบบคีโต..."
          />
        </div>

        {/* Macro Nutrients Section */}
        <div style={macroSectionStyle}>
          <h4 style={macroTitleStyle}>🍽️ ปรับแต่งมาโคร (ไม่บังคับ)</h4>
          <div style={macroGridStyle}>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>💪 โปรตีน (g)</label>
              <input
                type="number"
                value={proteinG}
                onChange={(e) => setProteinG(e.target.value)}
                style={inputStyle}
                placeholder="เช่น 120"
              />
            </div>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>🥑 ไขมัน (g)</label>
              <input
                type="number"
                value={fatG}
                onChange={(e) => setFatG(e.target.value)}
                style={inputStyle}
                placeholder="เช่น 60"
              />
            </div>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>🍞 คาร์บ (g)</label>
              <input
                type="number"
                value={carbG}
                onChange={(e) => setCarbG(e.target.value)}
                style={inputStyle}
                placeholder="เช่น 200"
              />
            </div>
          </div>
        </div>

        <button 
          onClick={handleSubmit} 
          style={{
            ...buttonStyle,
            opacity: submitting ? 0.7 : 1,
            cursor: submitting ? 'not-allowed' : 'pointer'
          }} 
          disabled={submitting}
        >
          {submitting ? (
            <span style={buttonContentStyle}>
              <span style={spinnerStyle}>⏳</span>
              กำลังบันทึก...
            </span>
          ) : (
            <span style={buttonContentStyle}>
              <span>💾</span>
              บันทึกแผนโภชนาการ
            </span>
          )}
        </button>
      </div>
    </div>
  );
}

const macroSectionStyle: React.CSSProperties = {
  padding: "1.5rem",
  background: "rgba(255, 255, 255, 0.6)",
  borderRadius: "15px",
  border: "1px solid #fecaca",
  marginTop: "1rem",
};

const macroTitleStyle: React.CSSProperties = {
  color: "#c50000",
  fontSize: "1rem",
  fontWeight: "600",
  margin: "0 0 1rem 0",
  textAlign: "center",
};

const macroGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
  gap: "1rem",
};

export default NutritionForm;
