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
    });

    setSubmitting(false);
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "0.7rem 0.9rem",
    marginBottom: "1rem",
    borderRadius: 10,
    border: "1px solid #e5e7eb",
    background: "#fff",
    color: "#111827",
    fontSize: "1rem",
    boxSizing: "border-box",
    outline: "none",
  };

  const buttonStyle: React.CSSProperties = {
    width: "100%",
    padding: "0.85rem 1rem",
    background: "linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)",
    color: "white",
    fontSize: "1.05rem",
    border: "none",
    borderRadius: 12,
    cursor: submitting ? "not-allowed" : "pointer",
    opacity: submitting ? 0.7 : 1,
    marginTop: "0.75rem",
    boxShadow: "0 8px 18px rgba(239,68,68,0.35)",
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

export default NutritionForm;
