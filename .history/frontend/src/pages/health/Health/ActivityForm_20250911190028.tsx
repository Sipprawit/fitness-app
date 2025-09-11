import { useState, useEffect } from "react";
import { useHealthActivity } from "../../../contexts/HealthContext";
import { useNotification } from "../../../components/Notification/NotificationProvider";

interface Props {
  activitiesList: { name: string; met: number }[];
}

function ActivityForm({ activitiesList }: Props) {
  const { health, addActivity } = useHealthActivity();
  const { showNotification } = useNotification();
  
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
      showNotification({
        type: 'warning',
        title: 'ข้อมูลไม่ครบถ้วน',
        message: 'กรุณากรอกข้อมูลสุขภาพ (น้ำหนัก, ส่วนสูง) ก่อนบันทึกกิจกรรม',
        duration: 2000
      });
      return;
    }
    
    if (!type || duration <= 0) {
      showNotification({
        type: 'warning',
        title: 'ข้อมูลกิจกรรมไม่ถูกต้อง',
        message: 'กรุณาเลือกประเภทกิจกรรมและกรอกระยะเวลาที่ถูกต้อง',
        duration: 4000
      });
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
        showNotification({
          type: 'error',
          title: 'เกิดข้อผิดพลาด',
          message: `ไม่สามารถบันทึกกิจกรรมได้: ${err.error || err.message || "Unknown error"}`,
          duration: 5000
        });
        return;
      }

      const result = await res.json();
      console.log("=== Activity API Success ===");
      console.log("Response:", result);
      console.log("=== End Activity API Success ===");
      
      // Backend ส่งข้อมูล activity กลับมา
      addActivity(result);
      
      showNotification({
        type: 'success',
        title: 'บันทึกกิจกรรมสำเร็จ!',
        message: `${result.type} ระยะทาง: ${result.distance} กม. เวลา: ${result.duration} นาที เผาผลาญ: ${result.calories?.toFixed(0) || 0} แคลอรี่`,
        duration: 5000
      });
      setDistance(0);
      setDuration(0);
    } catch (err) {
      console.error(err);
      showNotification({
        type: 'error',
        title: 'เกิดข้อผิดพลาด',
        message: 'ไม่สามารถบันทึกกิจกรรมได้ กรุณาลองใหม่อีกครั้ง',
        duration: 5000
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={containerStyle}>
      <div style={headerContainerStyle}>
        <div style={iconStyle}>🏃‍♂️</div>
        <h3 style={headerStyle}>บันทึกกิจกรรม</h3>
        <p style={subtitleStyle}>เพิ่มกิจกรรมการออกกำลังกายของคุณ</p>
      </div>
      
      {/* แสดงสถานะข้อมูลสุขภาพ */}
      <div style={statusContainerStyle}>
        {health ? (
          <div style={statusSuccessStyle}>
            <span style={statusIconStyle}>✅</span>
            <span>มีข้อมูลสุขภาพ</span>
          </div>
        ) : (
          <div style={statusErrorStyle}>
            <span style={statusIconStyle}>❌</span>
            <span>ยังไม่มีข้อมูลสุขภาพ</span>
          </div>
        )}
      </div>

      <div style={formContainerStyle}>
        <div style={inputGroupStyle}>
          <label style={labelStyle}>🏃‍♂️ ประเภทกิจกรรม</label>
          <select 
            value={type} 
            onChange={(e) => setType(e.target.value)} 
            style={selectStyle}
          >
            {activitiesList.map((a) => (
              <option key={a.name} value={a.name}>
                {a.name}
              </option>
            ))}
          </select>
        </div>

        <div style={inputGroupStyle}>
          <label style={labelStyle}>📏 ระยะทาง (กม.)</label>
          <input
            type="text"
            value={distance === 0 ? "" : distance}
            onChange={(e) => setDistance(Number(e.target.value) || 0)}
            style={inputStyle}
            placeholder="เช่น 5"
          />
        </div>

        <div style={inputGroupStyle}>
          <label style={labelStyle}>⏱️ เวลา (นาที)</label>
          <input
            type="text"
            value={duration === 0 ? "" : duration}
            onChange={(e) => setDuration(Number(e.target.value) || 0)}
            style={inputStyle}
            placeholder="เช่น 90"
          />
        </div>

        <button 
          onClick={handleSubmit} 
          disabled={submitting || !health} 
          style={{
            ...buttonStyle,
            opacity: (submitting || !health) ? 0.7 : 1,
            cursor: (submitting || !health) ? 'not-allowed' : 'pointer'
          }}
        >
          {submitting ? (
            <span style={buttonContentStyle}>
              <span style={spinnerStyle}>⏳</span>
              กำลังบันทึก...
            </span>
          ) : (
            <span style={buttonContentStyle}>
              <span>💾</span>
              บันทึกกิจกรรม
            </span>
          )}
        </button>
      </div>
    </div>
  );
}

const containerStyle: React.CSSProperties = {
  background: "linear-gradient(135deg, #ffffff 0%, #fef2f2 100%)",
  padding: "2rem",
  borderRadius: "20px",
  width: "400px",
  display: "flex",
  flexDirection: "column",
  boxShadow: "0 20px 40px rgba(197, 0, 0, 0.15)",
  border: "2px solid #fecaca",
  color: "#1f2937",
  position: "relative",
  overflow: "hidden",
};

const headerContainerStyle: React.CSSProperties = {
  textAlign: "center",
  marginBottom: "1.5rem",
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

const statusContainerStyle: React.CSSProperties = {
  marginBottom: "1.5rem",
  textAlign: "center",
};

const statusSuccessStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "0.5rem",
  backgroundColor: "#dcfce7",
  color: "#166534",
  padding: "0.75rem 1.5rem",
  borderRadius: "12px",
  fontSize: "0.9rem",
  fontWeight: "600",
  border: "2px solid #bbf7d0",
};

const statusErrorStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "0.5rem",
  backgroundColor: "#fef2f2",
  color: "#dc2626",
  padding: "0.75rem 1.5rem",
  borderRadius: "12px",
  fontSize: "0.9rem",
  fontWeight: "600",
  border: "2px solid #fecaca",
};

const statusIconStyle: React.CSSProperties = {
  fontSize: "1rem",
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
  padding: "1rem 1.25rem",
  borderRadius: "12px",
  border: "2px solid #fecaca",
  background: "#ffffff",
  fontSize: "1rem",
  fontWeight: "500",
  color: "#1f2937",
  transition: "all 0.3s ease",
  outline: "none",
  boxShadow: "0 2px 4px rgba(197, 0, 0, 0.05)",
};

const selectStyle: React.CSSProperties = {
  padding: "1rem 1.25rem",
  borderRadius: "12px",
  border: "2px solid #fecaca",
  background: "#ffffff",
  fontSize: "1rem",
  fontWeight: "500",
  color: "#1f2937",
  transition: "all 0.3s ease",
  outline: "none",
  boxShadow: "0 2px 4px rgba(197, 0, 0, 0.05)",
  cursor: "pointer",
};

const buttonStyle: React.CSSProperties = {
  padding: "1rem 1.5rem",
  borderRadius: "12px",
  border: "none",
  background: "linear-gradient(135deg, #c50000 0%, #dc2626 100%)",
  color: "#ffffff",
  cursor: "pointer",
  fontWeight: "700",
  fontSize: "1rem",
  width: "100%",
  boxShadow: "0 8px 20px rgba(197, 0, 0, 0.3)",
  transition: "all 0.3s ease",
  marginTop: "1rem",
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

export default ActivityForm;
