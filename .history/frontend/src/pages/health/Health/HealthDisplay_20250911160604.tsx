import { useState } from "react";
import type { HealthData } from "../../../interface/HealthData";
import HealthForm from "./HealthForm";

interface Props {
  health: HealthData | null;
  onHealthUpdate?: (data: HealthData) => void;
  activitiesList?: any[];
}

function HealthDisplay({ health, onHealthUpdate, activitiesList }: Props) {
  const [isEditing, setIsEditing] = useState(false);

  const handleHealthSubmit = (data: HealthData) => {
    if (onHealthUpdate) {
      onHealthUpdate(data);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const calculateBMI = () => {
    if (!health || health.weight === 0 || health.height === 0) return 0;
    const heightInMeters = health.height / 100;
    return (health.weight / (heightInMeters * heightInMeters)).toFixed(1);
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { category: "น้ำหนักน้อย", color: "#3b82f6" };
    if (bmi < 23) return { category: "ปกติ", color: "#10b981" };
    if (bmi < 25) return { category: "น้ำหนักเกิน", color: "#f59e0b" };
    if (bmi < 30) return { category: "อ้วนระดับ 1", color: "#f97316" };
    return { category: "อ้วนระดับ 2", color: "#ef4444" };
  };

  const bmi = parseFloat(calculateBMI());
  const bmiInfo = getBMICategory(bmi);

  if (!health) {
    return (
      <div style={{
        background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
        padding: "2rem",
        borderRadius: "20px",
        textAlign: "center",
        border: "2px dashed #cbd5e1",
        boxShadow: "0 10px 25px rgba(0,0,0,0.1)"
      }}>
        <div style={{
          fontSize: "3rem",
          marginBottom: "1rem",
          color: "#64748b"
        }}>
          📊
        </div>
        <h3 style={{
          color: "#475569",
          margin: "0 0 0.5rem 0",
          fontSize: "1.25rem",
          fontWeight: "600"
        }}>
          ยังไม่มีข้อมูลสุขภาพ
        </h3>
        <p style={{
          color: "#64748b",
          margin: 0,
          fontSize: "0.9rem"
        }}>
          กรุณาเพิ่มข้อมูลสุขภาพของคุณ
        </p>
      </div>
    );
  }

  // ถ้ากำลังแก้ไข ให้แสดง HealthForm
  if (isEditing && health) {
    return (
      <div style={{
        background: "linear-gradient(135deg, #ffffff 0%, #fef2f2 100%)",
        padding: "2rem",
        borderRadius: "20px",
        border: "2px solid #fecaca",
        boxShadow: "0 20px 40px rgba(197, 0, 0, 0.15)",
        minWidth: "400px"
      }}>
        {/* Header */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem"
        }}>
          <h3 style={{
            color: "#c50000",
            margin: 0,
            fontSize: "1.5rem",
            fontWeight: "700",
            textShadow: "0 2px 4px rgba(197, 0, 0, 0.1)"
          }}>
            ✏️ แก้ไขข้อมูลสุขภาพ
          </h3>
          <button
            onClick={handleCancel}
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "10px",
              border: "none",
              backgroundColor: "#6b7280",
              color: "#fff",
              fontWeight: "600",
              cursor: "pointer",
              fontSize: "0.9rem",
              transition: "all 0.2s ease"
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#4b5563"}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#6b7280"}
          >
            ยกเลิก
          </button>
        </div>

        {/* HealthForm with pre-filled data */}
        <HealthForm 
          activitiesList={activitiesList || []}
          onSubmit={handleHealthSubmit}
          initialData={{
            weight: health.weight,
            height: health.height,
            fat: health.fat
          }}
        />
      </div>
    );
  }

  return (
    <div style={{
      background: "linear-gradient(135deg, #ffffff 0%, #fef2f2 100%)",
      padding: "2rem",
      borderRadius: "20px",
      border: "2px solid #fecaca",
      boxShadow: "0 20px 40px rgba(197, 0, 0, 0.15)",
      minWidth: "400px"
    }}>
      {/* Header */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "2rem"
      }}>
        <h3 style={{
          color: "#c50000",
          margin: 0,
          fontSize: "1.5rem",
          fontWeight: "700",
          textShadow: "0 2px 4px rgba(197, 0, 0, 0.1)"
        }}>
          ข้อมูลสุขภาพ
        </h3>
        <button
          onClick={() => setIsEditing(true)}
          style={{
            padding: "0.5rem 1rem",
            borderRadius: "10px",
            border: "none",
            backgroundColor: "#c50000",
            color: "#fff",
            fontWeight: "600",
            cursor: "pointer",
            fontSize: "0.9rem",
            transition: "all 0.2s ease"
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#dc2626"}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#c50000"}
        >
          แก้ไข
        </button>
      </div>

      {/* Health Data Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
        gap: "1.5rem",
        marginBottom: "2rem"
      }}>
        {/* Weight */}
        <div style={{
          backgroundColor: "rgba(255,255,255,0.8)",
          padding: "1.5rem",
          borderRadius: "15px",
          textAlign: "center",
          boxShadow: "0 8px 20px rgba(0,0,0,0.08)"
        }}>
          <div style={{
            fontSize: "2rem",
            marginBottom: "0.5rem"
          }}>
            ⚖️
          </div>
          <div style={{
            fontSize: "1.5rem",
            fontWeight: "700",
            color: "#c50000",
            marginBottom: "0.25rem"
          }}>
            {health.weight}
          </div>
          <div style={{
            color: "#64748b",
            fontSize: "0.9rem",
            fontWeight: "500"
          }}>
            น้ำหนัก (กก.)
          </div>
        </div>

        {/* Height */}
        <div style={{
          backgroundColor: "rgba(255,255,255,0.8)",
          padding: "1.5rem",
          borderRadius: "15px",
          textAlign: "center",
          boxShadow: "0 8px 20px rgba(0,0,0,0.08)"
        }}>
          <div style={{
            fontSize: "2rem",
            marginBottom: "0.5rem"
          }}>
            📏
          </div>
          <div style={{
            fontSize: "1.5rem",
            fontWeight: "700",
            color: "#c50000",
            marginBottom: "0.25rem"
          }}>
            {health.height}
          </div>
          <div style={{
            color: "#64748b",
            fontSize: "0.9rem",
            fontWeight: "500"
          }}>
            ส่วนสูง (ซม.)
          </div>
        </div>

        {/* BMI */}
        <div style={{
          backgroundColor: "rgba(255,255,255,0.8)",
          padding: "1.5rem",
          borderRadius: "15px",
          textAlign: "center",
          boxShadow: "0 8px 20px rgba(0,0,0,0.08)"
        }}>
          <div style={{
            fontSize: "2rem",
            marginBottom: "0.5rem"
          }}>
            📊
          </div>
          <div style={{
            fontSize: "1.5rem",
            fontWeight: "700",
            color: bmiInfo.color,
            marginBottom: "0.25rem"
          }}>
            {bmi}
          </div>
          <div style={{
            color: "#64748b",
            fontSize: "0.8rem",
            fontWeight: "500",
            marginBottom: "0.25rem"
          }}>
            BMI
          </div>
          <div style={{
            color: bmiInfo.color,
            fontSize: "0.75rem",
            fontWeight: "600"
          }}>
            {bmiInfo.category}
          </div>
        </div>

        {/* Body Fat */}
        <div style={{
          backgroundColor: "rgba(255,255,255,0.8)",
          padding: "1.5rem",
          borderRadius: "15px",
          textAlign: "center",
          boxShadow: "0 8px 20px rgba(0,0,0,0.08)"
        }}>
          <div style={{
            fontSize: "2rem",
            marginBottom: "0.5rem"
          }}>
            💪
          </div>
          {isEditing ? (
            <input
              type="number"
              value={editData.fat}
              onChange={(e) => setEditData({...editData, fat: parseFloat(e.target.value) || 0})}
              style={{
                width: "100%",
                padding: "0.5rem",
                borderRadius: "8px",
                border: "2px solid #0ea5e9",
                fontSize: "1rem",
                textAlign: "center",
                outline: "none"
              }}
            />
          ) : (
            <div style={{
              fontSize: "1.5rem",
              fontWeight: "700",
              color: "#c50000",
              marginBottom: "0.25rem"
            }}>
              {health.fat}%
            </div>
          )}
          <div style={{
            color: "#64748b",
            fontSize: "0.9rem",
            fontWeight: "500"
          }}>
            ไขมันในร่างกาย
          </div>
        </div>
      </div>



      {/* Date */}
      <div style={{
        textAlign: "center",
        color: "#64748b",
        fontSize: "0.85rem",
        marginBottom: "1.5rem"
      }}>
        อัปเดตล่าสุด: {health.date}
      </div>

      {/* Save/Cancel Buttons */}
      {isEditing && (
        <div style={{
          display: "flex",
          gap: "1rem",
          justifyContent: "center"
        }}>
          <button
            onClick={handleSave}
            style={{
              padding: "0.75rem 2rem",
              borderRadius: "10px",
              border: "none",
              backgroundColor: "#10b981",
              color: "#fff",
              fontWeight: "600",
              cursor: "pointer",
              fontSize: "1rem",
              transition: "all 0.2s ease"
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#059669"}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#10b981"}
          >
            บันทึก
          </button>
          <button
            onClick={handleCancel}
            style={{
              padding: "0.75rem 2rem",
              borderRadius: "10px",
              border: "none",
              backgroundColor: "#6b7280",
              color: "#fff",
              fontWeight: "600",
              cursor: "pointer",
              fontSize: "1rem",
              transition: "all 0.2s ease"
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#4b5563"}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#6b7280"}
          >
            ยกเลิก
          </button>
        </div>
      )}
    </div>
  );
}

export default HealthDisplay;
