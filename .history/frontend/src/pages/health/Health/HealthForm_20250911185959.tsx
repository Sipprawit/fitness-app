import { useState, useEffect } from "react";
import type { HealthData } from "../../../interface/HealthData";
import { useHealthActivity } from "../../../contexts/HealthContext";
import { useNotification } from "../../../components/Notification/NotificationProvider";

interface Props {
  activitiesList?: any[];
  onSubmit?: (data: HealthData) => void;
  initialData?: {
    weight: number;
    height: number;
    fat: number;
  };
  isEditing?: boolean;
  onCancelEdit?: () => void;
}

function HealthForm({ activitiesList, onSubmit, initialData, isEditing, onCancelEdit }: Props) {
  const { setHealth } = useHealthActivity();
  const { showNotification } = useNotification();
  const [weight, setWeight] = useState<string>("");
  const [height, setHeight] = useState<string>("");
  const [fat, setFat] = useState<string>("");
  const [pressure, setPressure] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  // เซ็ตค่าเริ่มต้นจาก initialData
  useEffect(() => {
    if (initialData) {
      setWeight(initialData.weight.toString());
      setHeight(initialData.height.toString());
      setFat(initialData.fat.toString());
    }
  }, [initialData]);

  const token = localStorage.getItem("token");

  const handleSubmit = async () => {
    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height);
    const fatNum = parseFloat(fat) || 0;

    if (!weight || !height) {
      showNotification({
        type: 'warning',
        title: 'ข้อมูลไม่ครบถ้วน',
        message: 'กรุณากรอกน้ำหนักและส่วนสูงให้ครบถ้วน',
        duration: 2000
      });
      return;
    }

    setSubmitting(true);

    const bmi = weightNum / Math.pow(heightNum / 100, 2);
    let status = "ไม่ทราบ";
    if (bmi < 18.5) status = "ผอมเกินไป";
    else if (bmi < 24.9) status = "สมส่วน";
    else if (bmi < 29.9) status = "น้ำหนักเกิน";
    else status = "อ้วน";

    const dataToSave = {
      weight: weightNum,
      height: heightNum,
      fat: fatNum,
      pressure,
      bmi: parseFloat(bmi.toFixed(2)),
      status,
      date: new Date().toISOString().split("T")[0],
    };

    // ถ้ามี onSubmit prop (แก้ไข) ให้เรียกใช้แทนการส่ง API เอง
    if (onSubmit && isEditing) {
      try {
        onSubmit(dataToSave as HealthData);
        showNotification({
          type: 'success',
          title: 'อัปเดตข้อมูลสุขภาพสำเร็จ!',
          message: `น้ำหนัก: ${weightNum} กก. ส่วนสูง: ${heightNum} ซม. BMI: ${dataToSave.bmi}`,
          duration: 2000
        });
        setSubmitting(false);
        return;
      } catch (err) {
        console.error(err);
        showNotification({
          type: 'error',
          title: 'เกิดข้อผิดพลาด',
          message: 'ไม่สามารถอัปเดตข้อมูลสุขภาพได้ กรุณาลองใหม่อีกครั้ง',
          duration: 3000
        });
        setSubmitting(false);
        return;
      }
    }

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
        showNotification({
          type: 'error',
          title: 'เกิดข้อผิดพลาด',
          message: `ไม่สามารถบันทึกข้อมูลสุขภาพได้: ${err.error}`,
          duration: 5000
        });
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
      showNotification({
        type: 'success',
        title: 'บันทึกข้อมูลสุขภาพสำเร็จ!',
        message: `น้ำหนัก: ${weightNum} กก. ส่วนสูง: ${heightNum} ซม. BMI: ${dataToSave.bmi} สถานะ: ${status}`,
        duration: 5000
      });
      
      // Reset form
      setWeight("");
      setHeight("");
      setFat("");
      setPressure("");
      
      // ไม่ต้อง refresh เพราะข้อมูลถูกต้องแล้ว
      // await refreshHealthData();
    } catch (err) {
      console.error(err);
      showNotification({
        type: 'error',
        title: 'เกิดข้อผิดพลาด',
        message: 'ไม่สามารถบันทึกข้อมูลสุขภาพได้ กรุณาลองใหม่อีกครั้ง',
        duration: 5000
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={containerStyle}>
      <div style={headerContainerStyle}>
        <div style={iconStyle}>💪</div>
        <h3 style={headerStyle}>ข้อมูลสุขภาพ</h3>
        <p style={subtitleStyle}>บันทึกข้อมูลสุขภาพของคุณ</p>
      </div>

      <div style={formContainerStyle}>
        <div style={inputGroupStyle}>
          <label style={labelStyle}>📏 ส่วนสูง (ซม.)</label>
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            style={inputStyle}
            placeholder="เช่น 170"
          />
        </div>

        <div style={inputGroupStyle}>
          <label style={labelStyle}>⚖️ น้ำหนัก (กก.)</label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            style={inputStyle}
            placeholder="เช่น 65"
          />
        </div>

        <div style={inputGroupStyle}>
          <label style={labelStyle}>💪 % ไขมันในร่างกาย</label>
          <input
            type="number"
            value={fat}
            onChange={(e) => setFat(e.target.value)}
            style={inputStyle}
            placeholder="เช่น 15"
          />
        </div>

        <div style={inputGroupStyle}>
          <label style={labelStyle}>🩺 ความดันโลหิต</label>
          <input
            value={pressure}
            onChange={(e) => setPressure(e.target.value)}
            style={inputStyle}
            placeholder="เช่น 120/80"
          />
        </div>

        <div style={{
          display: "flex",
          gap: "1rem",
          marginTop: "1rem"
        }}>
          <button 
            onClick={handleSubmit} 
            disabled={submitting} 
            style={{
              ...buttonStyle,
              opacity: submitting ? 0.7 : 1,
              cursor: submitting ? 'not-allowed' : 'pointer',
              flex: 1
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
                {isEditing ? "อัปเดตข้อมูล" : "บันทึกข้อมูล"}
              </span>
            )}
          </button>
          
          {isEditing && onCancelEdit && (
            <button 
              onClick={onCancelEdit}
              style={{
                ...buttonStyle,
                backgroundColor: "#6b7280",
                background: "linear-gradient(135deg, #6b7280 0%, #4b5563 100%)",
                flex: 1
              }}
              onMouseOver={(e) => e.currentTarget.style.background = "linear-gradient(135deg, #4b5563 0%, #374151 100%)"}
              onMouseOut={(e) => e.currentTarget.style.background = "linear-gradient(135deg, #6b7280 0%, #4b5563 100%)"}
            >
              <span style={buttonContentStyle}>
                <span>❌</span>
                ยกเลิก
              </span>
            </button>
          )}
        </div>
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

export default HealthForm;
