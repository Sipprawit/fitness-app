import type { Activity } from "../../../interface/Activity";

interface Props {
  activities: Activity[];
  onActivityDelete?: (id: number) => void;
  onActivityEdit?: (id: number, activity: Activity) => void;
}

function ActivityDisplay({ activities, onActivityDelete, onActivityEdit }: Props) {

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

  const totalCalories = activities.reduce((sum, activity) => sum + (activity.calories || 0), 0);
  const totalDuration = activities.reduce((sum, activity) => sum + (activity.duration || 0), 0);
  const totalDistance = activities.reduce((sum, activity) => sum + (activity.distance || 0), 0);

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
            📏
          </div>
          <div style={{
            fontSize: "1.5rem",
            fontWeight: "700",
            color: "#10b981",
            marginBottom: "0.25rem"
          }}>
            {totalDistance.toFixed(1)}
          </div>
          <div style={{
            color: "#64748b",
            fontSize: "0.8rem",
            fontWeight: "500"
          }}>
            กม. รวม
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
                  border: `2px solid ${getActivityColor(activity.type || "")}20`
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
                      {getActivityIcon(activity.type || "")}
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
                        {activity.distance && activity.distance > 0 && (
                          <span>📏 {activity.distance} กม.</span>
                        )}
                        <span>🔥 {(activity.calories || 0).toFixed(0)} แคลอรี่</span>
                      </div>
                    </div>
                  </div>
                  
                  {onActivityDelete && (
                    <button
                      onClick={() => {
                        console.log("Delete button clicked for activity:", activity);
                        console.log("Activity ID:", activity.id);
                        if (activity.id) {
                          onActivityDelete(activity.id);
                        } else {
                          console.error("Activity ID is missing:", activity);
                        }
                      }}
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

                {(activity as any).note && (
                  <div style={{
                    color: "#64748b",
                    fontSize: "0.9rem",
                    lineHeight: "1.4",
                    backgroundColor: "rgba(0,0,0,0.05)",
                    padding: "0.75rem",
                    borderRadius: "8px"
                  }}>
                    📝 {(activity as any).note}
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
