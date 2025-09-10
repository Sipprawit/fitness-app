import { useState, useEffect } from "react";
import { useHealthActivity } from "../../../contexts/HealthContext";

interface Props {
  activitiesList: { name: string; met: number }[];
}

function ActivityForm({ activitiesList }: Props) {
  const { health, addActivity } = useHealthActivity();
  
  // Debug: ดู health data เมื่อ component re-render
  console.log("=== ActivityForm render ===");
  console.log("Health data:", health);
  console.log("Health type:", typeof health);
  console.log("Health is null:", health === null);
  console.log("Health is undefined:", health === undefined);
  console.log("=== End ActivityForm render ===");
  const [type, setType] = useState(activitiesList[0]?.name ?? "");
  const [distance, setDistance] = useState(0);
  const [duration, setDuration] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const token = localStorage.getItem("token");
  
  // Debug: ดู health data เมื่อเปลี่ยนแปลง
  useEffect(() => {
    console.log("=== ActivityForm useEffect - health changed ===");
    console.log("New health data:", health);
    console.log("Health type:", typeof health);
    console.log("=== End useEffect ===");
  }, [health]);

  const handleSubmit = async () => {
    // Debug: ตรวจสอบข้อมูล health
    console.log("Health data:", health);
    console.log("Health ID:", health?.id);
    console.log("Health object keys:", health ? Object.keys(health) : "No health data");
    
    // ตรวจสอบข้อมูล health อย่างละเอียด
    // ใช้ ID (ตัวใหญ่) แทน id (ตัวเล็ก) เพราะ backend ส่งมาเป็น ID
    const healthId = (health as any)?.ID || health?.id;
    if (!health || !healthId || !health.weight || !health.height) {
      console.log("Health validation failed:", {
        hasHealth: !!health,
        hasId: !!healthId,
        hasWeight: !!health?.weight,
        hasHeight: !!health?.height,
        healthId: healthId,
        healthKeys: health ? Object.keys(health) : []
      });
      alert("กรุณากรอกข้อมูลสุขภาพก่อนบันทึกกิจกรรม");
      return;
    }
    
    if (!type || duration <= 0) {
      alert("กรุณากรอกข้อมูลกิจกรรมให้ถูกต้อง");
      return;
    }

    setSubmitting(true);

    // Backend ต้องการเฉพาะ Type, Distance, Duration
    // Backend จะคำนวณ Calories และหา HealthID, UserID เอง
    const activityData = {
      type,
      distance,
      duration,
    };

    console.log("=== Sending Activity Data ===");
    console.log("activityData:", activityData);
    console.log("JSON stringified:", JSON.stringify(activityData, null, 2));
    console.log("=== End Activity Data ===");

    try {
      const res = await fetch("http://localhost:8000/api/activity", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(activityData),
      });

      if (!res.ok) {
        const err = await res.json();
        console.log("=== Activity API Error ===");
        console.log("Response status:", res.status);
        console.log("Response statusText:", res.statusText);
        console.log("Error response:", err);
        console.log("=== End Activity API Error ===");
        alert("บันทึกกิจกรรมไม่สำเร็จ: " + (err.error || err.message || "Unknown error"));
        return;
      }

      const result = await res.json();
      console.log("=== Activity API Success ===");
      console.log("Response:", result);
      console.log("=== End Activity API Success ===");
      
      // Backend ส่งข้อมูล activity กลับมา
      addActivity(result);
      setDistance(0);
      setDuration(0);
      
      // แสดงข้อความสำเร็จ
      alert("บันทึกกิจกรรมสำเร็จ!");
    } catch (err) {
      console.error(err);
      alert("เกิดข้อผิดพลาดในการบันทึกกิจกรรม");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={containerStyle}>
      <h3 style={headerStyle}>บันทึกกิจกรรม</h3>
      
      {/* แสดงสถานะข้อมูลสุขภาพ */}
      <div style={{ fontSize: "0.9rem", marginBottom: "1rem", textAlign: "center" }}>
        {health ? (
          <span style={{ color: "#4caf50" }}>✓ มีข้อมูลสุขภาพ</span>
        ) : (
          <span style={{ color: "#f44336" }}>✗ ยังไม่มีข้อมูลสุขภาพ</span>
        )}
      </div>

      <label>ประเภทกิจกรรม</label>
      <select value={type} onChange={(e) => setType(e.target.value)} style={inputStyle}>
        {activitiesList.map((a) => (
          <option key={a.name} value={a.name}>
            {a.name}
          </option>
        ))}
      </select>

      <label>ระยะทาง (กม.)</label>
      <input
        type="number"
        value={distance}
        onChange={(e) => setDistance(Number(e.target.value) || 0)}
        style={inputStyle}
      />

      <label>เวลา (ชม.)</label>
      <input
        type="number"
        value={duration}
        onChange={(e) => setDuration(Number(e.target.value) || 0)}
        style={inputStyle}
      />

      <button onClick={handleSubmit} disabled={submitting} style={buttonStyle}>
        {submitting ? "กำลังบันทึก..." : "บันทึก"}
      </button>
    </div>
  );
}

const containerStyle: React.CSSProperties = {
  background: "linear-gradient(135deg, #f7f9fc 0%, #666 100%)",
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

export default ActivityForm;
