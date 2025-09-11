import { useState } from "react";
import type { Activity } from "../../../interface/Activity";
import { useNotification } from "../../../components/Notification/NotificationProvider";

interface Props {
  activity: Activity;
  onSave: (id: number, updatedActivity: Partial<Activity>) => void;
  onCancel: () => void;
}

const activities = [
  { name: "วิ่ง", met: 8 },
  { name: "ปั่นจักรยาน", met: 6 },
  { name: "ว่ายน้ำ", met: 7 },
  { name: "เดินเร็ว", met: 4 },
  { name: "เดินช้า", met: 3 },
  { name: "กระโดดเชือก", met: 12 },
  { name: "โยคะ", met: 3 },
  { name: "เต้นแอโรบิค", met: 6 },
  { name: "พายเรือ", met: 7 },
  { name: "ปีนเขา", met: 9 },
];

export default function ActivityEditForm({ activity, onSave, onCancel }: Props) {
  const [type, setType] = useState(activity.type || "");
  const [distance, setDistance] = useState(activity.distance || 0);
  const [duration, setDuration] = useState(activity.duration || 0);
  const { showNotification } = useNotification();
  
  // กิจกรรมที่ต้องใช้ระยะทาง
  const activitiesWithDistance = ["วิ่ง", "เดิน", "ปั่นจักรยาน", "ว่ายน้ำ", "เดินเร็ว", "เดินช้า"];
  
  // ตรวจสอบว่ากิจกรรมที่เลือกต้องใช้ระยะทางหรือไม่
  const needsDistance = activitiesWithDistance.includes(type);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!type || duration <= 0) {
      showNotification({
        type: 'warning',
        title: 'ข้อมูลไม่ครบถ้วน',
        message: 'กรุณาเลือกประเภทกิจกรรมและกรอกระยะเวลาที่ถูกต้อง',
        duration: 2000
      });
      return;
    }

    onSave(activity.id!, {
      type,
      distance,
      duration,
    });
  };

  return (
    <div style={{
      background: "linear-gradient(135deg, #ffffff 0%, #fef2f2 100%)",
      padding: "2rem",
      borderRadius: "20px",
      border: "2px solid #fecaca",
      boxShadow: "0 20px 40px rgba(197, 0, 0, 0.15)",
      minWidth: "500px",
      marginBottom: "2rem"
    }}>
      <h3 style={{
        color: "#c50000",
        margin: "0 0 1.5rem 0",
        fontSize: "1.5rem",
        fontWeight: "700",
        textAlign: "center"
      }}>
        ✏️ แก้ไขกิจกรรม
      </h3>

      <form onSubmit={handleSubmit} style={{
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem"
      }}>
        {/* Activity Type */}
        <div>
          <label style={labelStyle}>ประเภทกิจกรรม</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            style={selectStyle}
            required
          >
            <option value="">เลือกประเภทกิจกรรม</option>
            {activities.map((activity) => (
              <option key={activity.name} value={activity.name}>
                {activity.name}
              </option>
            ))}
          </select>
        </div>

        {/* Distance */}
        {needsDistance && (
          <div>
            <label style={labelStyle}>📏 ระยะทาง (กิโลเมตร)</label>
            <input
              type="text"
              value={distance === 0 ? "" : distance}
              onChange={(e) => setDistance(Number(e.target.value) || 0)}
              style={inputStyle}
              placeholder="เช่น 5"
            />
          </div>
        )}

        {/* Duration */}
        <div>
          <label style={labelStyle}>⏱️ เวลา (นาที)</label>
          <input
            type="text"
            value={duration === 0 ? "" : duration}
            onChange={(e) => setDuration(Number(e.target.value) || 0)}
            style={inputStyle}
            placeholder="เช่น 90"
            required
          />
        </div>

        {/* Buttons */}
        <div style={{
          display: "flex",
          gap: "1rem",
          justifyContent: "center"
        }}>
          <button
            type="button"
            onClick={onCancel}
            style={{
              ...buttonStyle,
              backgroundColor: "#6b7280",
              color: "#fff"
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#4b5563"}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#6b7280"}
          >
            ยกเลิก
          </button>
          
          <button
            type="submit"
            style={{
              ...buttonStyle,
              background: "linear-gradient(135deg, #c50000 0%, #dc2626 100%)",
              color: "#fff"
            }}
            onMouseOver={(e) => e.currentTarget.style.background = "linear-gradient(135deg, #dc2626 0%, #ef4444 100%)"}
            onMouseOut={(e) => e.currentTarget.style.background = "linear-gradient(135deg, #c50000 0%, #dc2626 100%)"}
          >
            บันทึกการแก้ไข
          </button>
        </div>
      </form>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block",
  marginBottom: "0.5rem",
  color: "#374151",
  fontWeight: "600",
  fontSize: "1rem"
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.75rem 1rem",
  borderRadius: "10px",
  border: "2px solid #fecaca",
  fontSize: "1rem",
  fontWeight: "500",
  backgroundColor: "#fff",
  color: "#374151",
  outline: "none",
  transition: "all 0.2s ease",
  boxShadow: "0 2px 4px rgba(197, 0, 0, 0.05)"
};

const selectStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.75rem 1rem",
  borderRadius: "10px",
  border: "2px solid #fecaca",
  fontSize: "1rem",
  fontWeight: "500",
  backgroundColor: "#fff",
  color: "#374151",
  outline: "none",
  transition: "all 0.2s ease",
  boxShadow: "0 2px 4px rgba(197, 0, 0, 0.05)",
  cursor: "pointer"
};

const buttonStyle: React.CSSProperties = {
  padding: "0.75rem 2rem",
  borderRadius: "10px",
  border: "none",
  fontSize: "1rem",
  fontWeight: "600",
  cursor: "pointer",
  transition: "all 0.3s ease",
  boxShadow: "0 4px 8px rgba(0,0,0,0.1)"
};
