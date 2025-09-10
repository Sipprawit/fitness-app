import { useState } from "react";
import type { HealthData } from "../../../interface/HealthData";
import { useHealthActivity } from "../../../contexts/HealthContext";

function HealthForm() {
  const { setHealth } = useHealthActivity();
  const [weight, setWeight] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [fat, setFat] = useState<number>(0);
  const [pressure, setPressure] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  const token = localStorage.getItem("token");

  const handleSubmit = async () => {
    if (!weight || !height) {
      alert("กรุณากรอกน้ำหนักและส่วนสูง");
      return;
    }

    setSubmitting(true);

    const bmi = weight / Math.pow(height / 100, 2);
    let status = "ไม่ทราบ";
    if (bmi < 18.5) status = "ผอมเกินไป";
    else if (bmi < 24.9) status = "สมส่วน";
    else if (bmi < 29.9) status = "น้ำหนักเกิน";
    else status = "อ้วน";

    const dataToSave = {
      weight,
      height,
      fat,
      pressure,
      bmi: parseFloat(bmi.toFixed(2)),
      status,
      date: new Date().toISOString().split("T")[0],
    };

    try {
      const res = await fetch("http://localhost:8000/api/health", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dataToSave),
      });

      if (!res.ok) {
        const err = await res.json();
        alert("บันทึก Health ไม่สำเร็จ: " + err.error);
        return;
      }

      const result = await res.json();
      console.log("Health save response:", result);
      console.log("Health data from response:", result.data);
      
      const savedHealth: HealthData = {
        ...result.data,
        id: result.data.ID || result.data.id, // ใช้ ID (ตัวใหญ่) หรือ id (ตัวเล็ก)
        user_id: result.data.user_id,
      };
      
      console.log("Saved health object:", savedHealth);

      console.log("About to call setHealth with:", savedHealth);
      setHealth(savedHealth); // อัปเดต Context ทันที
      console.log("setHealth called successfully");
      
      // แสดงข้อความสำเร็จ
      alert("บันทึกข้อมูลสุขภาพสำเร็จ!");
      
      // ไม่ต้อง refresh เพราะข้อมูลถูกต้องแล้ว
      // await refreshHealthData();
    } catch (err) {
      console.error(err);
      alert("เกิดข้อผิดพลาดในการบันทึก Health");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={containerStyle}>
      <h3 style={headerStyle}>ข้อมูลส่วนตัว</h3>

      <label>ส่วนสูง (ซม.)</label>
      <input
        value={height}
        onChange={(e) => setHeight(Number(e.target.value) || 0)}
        style={inputStyle}
      />

      <label>น้ำหนัก (กก.)</label>
      <input
        value={weight}
        onChange={(e) => setWeight(Number(e.target.value) || 0)}
        style={inputStyle}
      />

      <label>% ไขมัน</label>
      <input
        value={fat}
        onChange={(e) => setFat(Number(e.target.value) || 0)}
        style={inputStyle}
      />

      <label>ค่าความดัน</label>
      <input
        value={pressure}
        onChange={(e) => setPressure(e.target.value)}
        style={inputStyle}
      />

      <button onClick={handleSubmit} disabled={submitting} style={buttonStyle}>
        {submitting ? "กำลังบันทึก..." : "บันทึก"}
      </button>
    </div>
  );
}

const containerStyle: React.CSSProperties = {
  background: "linear-gradient(135deg, #666 0%, #f7f9fc 100%)",
  padding: "1.5rem",
  borderRadius: 16,
  width: 340,
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
  alignItems: "stretch",
  boxShadow: "0 10px 24px rgba(0,0,0,0.08)",
  border: "1px solid #eef2f7",
  color: "#111827",
};

const headerStyle: React.CSSProperties = {
  color: "#111827",
  fontSize: "1.25rem",
  marginBottom: "0.25rem",
  fontWeight: 700,
};

const inputStyle: React.CSSProperties = {
  padding: "0.7rem 0.9rem",
  borderRadius: 10,
  border: "1px solid #e5e7eb",
  background: "#fff",
  width: "100%",
};

const buttonStyle: React.CSSProperties = {
  padding: "0.85rem 1rem",
  borderRadius: 12,
  border: "none",
  background: "linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)",
  color: "#fff",
  cursor: "pointer",
  fontWeight: 700,
  width: "100%",
  boxShadow: "0 8px 18px rgba(239,68,68,0.35)",
};

export default HealthForm;
