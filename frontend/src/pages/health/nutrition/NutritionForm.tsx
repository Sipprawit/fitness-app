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
    <div
      style={{
        background: "linear-gradient(135deg, #666 0%, #f7f9fc 100%)",
        padding: "1.5rem",
        borderRadius: 16,
        boxShadow: "0 10px 24px rgba(0,0,0,0.08)",
        maxWidth: 420,
        width: "100%",
        border: "1px solid #eef2f7",
      }}
    >
      <h3 style={{ marginBottom: "1.25rem", textAlign: "center", fontSize: "1.25rem", fontWeight: 700 ,color: "#111827"}}>
        วางแผนโภชนาการประจำวัน
      </h3>

      <div style={{ marginBottom: "0.5rem", fontWeight: 700 , color: "#111827"}}>เป้าหมาย (Goal)</div>
      <input
        type="text"
        value={goal}
        onChange={(e) => setGoal(e.target.value)}
        style={inputStyle}
        placeholder="เช่น ลดน้ำหนัก, เพิ่มกล้ามเนื้อ, รักษาน้ำหนัก"
      />

      <div style={{ marginBottom: "0.5rem", fontWeight: 700, color: "#111827" }}>หมายเหตุ</div>
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        style={{ ...inputStyle, height: 110, resize: "vertical" }}
        placeholder="เช่น แพ้อาหาร,ลดน้ำตาล,กินอาหารแบบคีโต..."
      />

      <button onClick={handleSubmit} style={buttonStyle} disabled={submitting}>
        {submitting ? "กำลังบันทึก..." : "บันทึก"}
      </button>
    </div>
  );
}

export default NutritionForm;
