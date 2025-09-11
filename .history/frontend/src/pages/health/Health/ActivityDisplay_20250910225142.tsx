import { useState } from "react";
import type { Activity } from "../../../interface/Activity";

interface Props {
  activities: Activity[];
  onActivityAdd?: (activity: Omit<Activity, 'id' | 'user_id' | 'health_id' | 'calories' | 'date'>) => void;
  onActivityDelete?: (id: number) => void;
}

function ActivityDisplay({ activities, onActivityAdd, onActivityDelete }: Props) {
  const [isAddingActivity, setIsAddingActivity] = useState(false);
  const [newActivity, setNewActivity] = useState({
    type: "",
    duration: 0,
    note: ""
  });

  const handleAddActivity = () => {
    if (newActivity.type && newActivity.duration > 0 && onActivityAdd) {
      onActivityAdd(newActivity);
      setNewActivity({ type: "", duration: 0, note: "" });
      setIsAddingActivity(false);
    }
  };

  const handleCancelAdd = () => {
    setNewActivity({ type: "", duration: 0, note: "" });
    setIsAddingActivity(false);
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "วิ่ง": return "🏃‍♂️";
      case "เดิน": return "🚶‍♂️";
      case "ปั่นจักรยาน": return "🚴‍♂️";
      case "ว่ายน้ำ": return "🏊‍♂️";
      case "ยกน้ำหนัก": return "🏋️‍♂️";
      case "โยคะ": return "🧘‍♀️";
      default: return "💪";
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case "วิ่ง": return "#ef4444";
      case "เดิน": return "#10b981";
      case "ปั่นจักรยาน": return "#3b82f6";
      case "ว่ายน้ำ": return "#06b6d4";
      case "ยกน้ำหนัก": return "#8b5cf6";
      case "โยคะ": return "#f59e0b";
      default: return "#6b7280";
    }
  };

  const totalCalories = activities.reduce((sum, activity) => sum + activity.calories, 0);
  const totalDuration = activities.reduce((sum, activity) => sum + activity.duration, 0);

  return (
    <div style={{
      background: "linear-gradient(135deg, #ffffff 0%, #fef2f2 100%)",
      padding: "2rem",
      borderRadius: "20px",
      border: "2px solid #fecaca",
      boxShadow: "0 20px 40px rgba(197, 0, 0, 0.15)",
      minWidth: "500px"
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
          กิจกรรมประจำวัน
        </h3>
        <button
          onClick={() => setIsAddingActivity(!isAddingActivity)}
          style={{
            padding: "0.5rem 1rem",
            borderRadius: "10px",
            border: "none",
            backgroundColor: isAddingActivity ? "#6b7280" : "#c50000",
            color: "#fff",
            fontWeight: "600",
            cursor: "pointer",
            fontSize: "0.9rem",
            transition: "all 0.2s ease"
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = isAddingActivity ? "#4b5563" : "#dc2626"}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = isAddingActivity ? "#6b7280" : "#c50000"}
        >
          {isAddingActivity ? "ยกเลิก" : "เพิ่มกิจกรรม"}
        </button>
      </div>

      {/* Summary Cards */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
        gap: "1rem",
        marginBottom: "2rem"
      }}>
        <div style={{
          backgroundColor: "rgba(255,255,255,0.9)",
          padding: "1.5rem",
          borderRadius: "15px",
          textAlign: "center",
          boxShadow: "0 8px 20px rgba(0,0,0,0.08)"
        }}>
          <div style={{
            fontSize: "2rem",
            marginBottom: "0.5rem"
          }}>
            🔥
          </div>
          <div style={{
            fontSize: "1.5rem",
            fontWeight: "700",
            color: "#ef4444",
            marginBottom: "0.25rem"
          }}>
            {totalCalories.toFixed(0)}
          </div>
          <div style={{
            color: "#64748b",
            fontSize: "0.8rem",
            fontWeight: "500"
          }}>
            แคลอรี่เผาผลาญ
          </div>
        </div>

        <div style={{
          backgroundColor: "rgba(255,255,255,0.9)",
          padding: "1.5rem",
          borderRadius: "15px",
          textAlign: "center",
          boxShadow: "0 8px 20px rgba(0,0,0,0.08)"
        }}>
          <div style={{
            fontSize: "2rem",
            marginBottom: "0.5rem"
          }}>
            ⏱️
          </div>
          <div style={{
            fontSize: "1.5rem",
            fontWeight: "700",
            color: "#3b82f6",
            marginBottom: "0.25rem"
          }}>
            {totalDuration}
          </div>
          <div style={{
            color: "#64748b",
            fontSize: "0.8rem",
            fontWeight: "500"
          }}>
            นาทีรวม
          </div>
        </div>

        <div style={{
          backgroundColor: "rgba(255,255,255,0.9)",
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
            color: "#10b981",
            marginBottom: "0.25rem"
          }}>
            {activities.length}
          </div>
          <div style={{
            color: "#64748b",
            fontSize: "0.8rem",
            fontWeight: "500"
          }}>
            กิจกรรม
          </div>
        </div>
      </div>

      {/* Add Activity Form */}
      {isAddingActivity && (
        <div style={{
          backgroundColor: "rgba(255,255,255,0.9)",
          padding: "1.5rem",
          borderRadius: "15px",
          marginBottom: "2rem",
          boxShadow: "0 8px 20px rgba(0,0,0,0.08)"
        }}>
          <h4 style={{
            color: "#92400e",
            margin: "0 0 1rem 0",
            fontSize: "1.1rem",
            fontWeight: "600"
          }}>
            เพิ่มกิจกรรมใหม่
          </h4>
          
          <div style={{
            display: "grid",
            gap: "1rem",
            marginBottom: "1.5rem"
          }}>
            <div>
              <label style={{
                display: "block",
                color: "#64748b",
                fontSize: "0.9rem",
                fontWeight: "500",
                marginBottom: "0.5rem"
              }}>
                ประเภทกิจกรรม
              </label>
              <select
                value={newActivity.type}
                onChange={(e) => setNewActivity({...newActivity, type: e.target.value})}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  borderRadius: "8px",
                  border: "2px solid #f59e0b",
                  fontSize: "1rem",
                  outline: "none",
                  backgroundColor: "#fff"
                }}
              >
                <option value="">เลือกประเภทกิจกรรม</option>
                <option value="วิ่ง">วิ่ง</option>
                <option value="เดิน">เดิน</option>
                <option value="ปั่นจักรยาน">ปั่นจักรยาน</option>
                <option value="ว่ายน้ำ">ว่ายน้ำ</option>
                <option value="ยกน้ำหนัก">ยกน้ำหนัก</option>
                <option value="โยคะ">โยคะ</option>
              </select>
            </div>

            <div>
              <label style={{
                display: "block",
                color: "#64748b",
                fontSize: "0.9rem",
                fontWeight: "500",
                marginBottom: "0.5rem"
              }}>
                ระยะเวลา (นาที)
              </label>
              <input
                type="number"
                value={newActivity.duration}
                onChange={(e) => setNewActivity({...newActivity, duration: parseFloat(e.target.value) || 0})}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  borderRadius: "8px",
                  border: "2px solid #f59e0b",
                  fontSize: "1rem",
                  outline: "none"
                }}
                placeholder="เช่น 30"
                min="1"
              />
            </div>

            <div>
              <label style={{
                display: "block",
                color: "#64748b",
                fontSize: "0.9rem",
                fontWeight: "500",
                marginBottom: "0.5rem"
              }}>
                หมายเหตุ (ไม่บังคับ)
              </label>
              <textarea
                value={newActivity.note}
                onChange={(e) => setNewActivity({...newActivity, note: e.target.value})}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  borderRadius: "8px",
                  border: "2px solid #f59e0b",
                  fontSize: "0.9rem",
                  outline: "none",
                  resize: "vertical",
                  minHeight: "60px"
                }}
                placeholder="เพิ่มหมายเหตุเกี่ยวกับกิจกรรม..."
              />
            </div>
          </div>

          <div style={{
            display: "flex",
            gap: "1rem",
            justifyContent: "flex-end"
          }}>
            <button
              onClick={handleCancelAdd}
              style={{
                padding: "0.75rem 1.5rem",
                borderRadius: "8px",
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
            <button
              onClick={handleAddActivity}
              style={{
                padding: "0.75rem 1.5rem",
                borderRadius: "8px",
                border: "none",
                backgroundColor: "#10b981",
                color: "#fff",
                fontWeight: "600",
                cursor: "pointer",
                fontSize: "0.9rem",
                transition: "all 0.2s ease"
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#059669"}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#10b981"}
            >
              เพิ่มกิจกรรม
            </button>
          </div>
        </div>
      )}

      {/* Activities List */}
      <div style={{
        maxHeight: "400px",
        overflowY: "auto"
      }}>
        {activities.length === 0 ? (
          <div style={{
            textAlign: "center",
            padding: "2rem",
            color: "#64748b"
          }}>
            <div style={{
              fontSize: "3rem",
              marginBottom: "1rem"
            }}>
              🏃‍♂️
            </div>
            <h4 style={{
              margin: "0 0 0.5rem 0",
              color: "#64748b",
              fontSize: "1.1rem"
            }}>
              ยังไม่มีกิจกรรม
            </h4>
            <p style={{
              margin: 0,
              fontSize: "0.9rem"
            }}>
              เพิ่มกิจกรรมแรกของคุณเพื่อเริ่มต้นการติดตาม
            </p>
          </div>
        ) : (
          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem"
          }}>
            {activities.map((activity, index) => (
              <div
                key={activity.id || index}
                style={{
                  backgroundColor: "rgba(255,255,255,0.9)",
                  padding: "1.5rem",
                  borderRadius: "15px",
                  boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
                  border: `2px solid ${getActivityColor(activity.type)}20`
                }}
              >
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: "1rem"
                }}>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem"
                  }}>
                    <div style={{
                      fontSize: "2rem"
                    }}>
                      {getActivityIcon(activity.type)}
                    </div>
                    <div>
                      <h4 style={{
                        margin: "0 0 0.25rem 0",
                        color: "#1f2937",
                        fontSize: "1.1rem",
                        fontWeight: "600"
                      }}>
                        {activity.type}
                      </h4>
                      <div style={{
                        display: "flex",
                        gap: "1rem",
                        fontSize: "0.9rem",
                        color: "#64748b"
                      }}>
                        <span>⏱️ {activity.duration} นาที</span>
                        <span>🔥 {activity.calories.toFixed(0)} แคลอรี่</span>
                      </div>
                    </div>
                  </div>
                  
                  {onActivityDelete && (
                    <button
                      onClick={() => onActivityDelete(activity.id)}
                      style={{
                        padding: "0.5rem",
                        borderRadius: "8px",
                        border: "none",
                        backgroundColor: "#ef4444",
                        color: "#fff",
                        cursor: "pointer",
                        fontSize: "0.8rem",
                        transition: "all 0.2s ease"
                      }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#dc2626"}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#ef4444"}
                    >
                      ลบ
                    </button>
                  )}
                </div>

                {activity.note && (
                  <div style={{
                    color: "#64748b",
                    fontSize: "0.9rem",
                    lineHeight: "1.4",
                    backgroundColor: "rgba(0,0,0,0.05)",
                    padding: "0.75rem",
                    borderRadius: "8px"
                  }}>
                    📝 {activity.note}
                  </div>
                )}

                <div style={{
                  marginTop: "0.75rem",
                  fontSize: "0.8rem",
                  color: "#9ca3af",
                  textAlign: "right"
                }}>
                  {new Date(activity.date).toLocaleString('th-TH')}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ActivityDisplay;
