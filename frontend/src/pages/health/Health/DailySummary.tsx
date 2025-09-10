import { useState } from "react";
import type { HealthData } from "../../../interface/HealthData";
import type { Activity } from "../../../interface/Activity";

interface DailySummaryProps {
  health: HealthData | null;
  activities: Activity[];
}

export default function DailySummary({ health, activities }: DailySummaryProps) {
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split("T")[0]);

  if (!health) {
    return (
      <div style={{ marginTop: "2rem", maxWidth: "980px", margin: "0 auto", padding: "2rem", background: "linear-gradient(135deg, #ffffff 0%, #f7f9fc 100%)", borderRadius: 16, border: "1px solid #eef2f7", textAlign: "center", boxShadow: "0 10px 24px rgba(0,0,0,0.08)" }}>
        <h2 style={{ color: "#111827", fontWeight: 800 }}>สรุปข้อมูลประจำวัน</h2>
        <p style={{ color: "#6b7280" }}>กรุณากรอกและบันทึกข้อมูลสุขภาพของคุณ</p>
      </div>
    );
  }

  const activitiesByDate = activities.reduce<Record<string, Activity[]>>((acc, act) => {
    // ใช้ CreatedAt หรือ date ตามที่มี
    const date = (act as any).CreatedAt ? 
      new Date((act as any).CreatedAt).toISOString().split("T")[0] : 
      (act.date ?? new Date().toISOString().split("T")[0]);
    if (!acc[date]) acc[date] = [];
    acc[date].push(act);
    return acc;
  }, {});

  const sortedDates = Object.keys(activitiesByDate).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  );

  // กรองข้อมูลตามวันที่ที่เลือก
  const filteredActivities = activitiesByDate[selectedDate] || [];

  return (
    <div style={{ marginTop: "2rem", maxWidth: "980px", margin: "0 auto", padding: "2rem", background: "linear-gradient(135deg, #ffffff 0%, #f7f9fc 100%)", borderRadius: 16, border: "1px solid #eef2f7", boxShadow: "0 10px 24px rgba(0,0,0,0.08)" }}>
      <h2 style={{ textAlign: "center", marginBottom: "2rem", color: "#111827", fontWeight: 800 }}>สรุปข้อมูลประจำวัน</h2>
      
      {/* Date Selector */}
      <div style={{ marginBottom: "2rem", textAlign: "center" }}>
        <label style={{ marginRight: "1rem", fontWeight: 700, color: "#374151" }}>
          เลือกวันที่:
        </label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          style={{
            padding: "0.6rem 0.8rem",
            borderRadius: 10,
            border: "1px solid #e5e7eb",
            fontSize: "1rem",
            backgroundColor: "#fff"
          }}
        />
        <div style={{ marginTop: "0.5rem", fontSize: "0.9rem", color: "#6b7280" }}>
          วันที่ที่มีข้อมูล: {sortedDates.length > 0 ? sortedDates.join(", ") : "ไม่มีข้อมูล"}
        </div>
      </div>

      <div style={{ backgroundColor: "#fff", padding: "1rem", borderRadius: 12, boxShadow: "0 6px 16px rgba(0,0,0,0.06)", marginBottom: "1.5rem", border: "1px solid #e5e7eb" }}>
        <h3 style={{ textAlign: "center", marginBottom: "1rem", color: "#333" }}>
          ข้อมูลสุขภาพล่าสุด (วันที่: {new Date(health.date ?? new Date()).toLocaleDateString("th-TH")})
        </h3>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "center", fontSize: "0.95rem", marginBottom: "1rem" }}>
          <thead>
            <tr>
              <th>ส่วนสูง</th>
              <th>น้ำหนัก</th>
              <th>% ไขมัน</th>
              <th>ความดัน</th>
              <th>BMI</th>
              <th>สถานะ</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{health.height}</td>
              <td>{health.weight}</td>
              <td>{health.fat}</td>
              <td>{health.pressure}</td>
              <td>{health.bmi}</td>
              <td>{health.status}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* แสดงกิจกรรมตามวันที่ที่เลือก */}
      <div style={{ backgroundColor: "#fff", padding: "1rem", borderRadius: 12, boxShadow: "0 6px 16px rgba(0,0,0,0.06)", marginBottom: "1.5rem", border: "1px solid #e5e7eb" }}>
        <h3 style={{ textAlign: "center", marginBottom: "1rem", color: "#333" }}>
          กิจกรรมวันที่: {new Date(selectedDate).toLocaleDateString("th-TH")}
        </h3>
        
        {filteredActivities.length === 0 ? (
          <p style={{ textAlign: "center", color: "#777" }}>ยังไม่มีข้อมูลกิจกรรมสำหรับวันที่นี้</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "center", fontSize: "0.95rem" }}>
            <thead>
              <tr>
                <th>กิจกรรม</th>
                <th>ระยะทาง (กม.)</th>
                <th>เวลา (ชม.)</th>
                <th>แคลอรี่ (kcal)</th>
                <th>เวลาบันทึก</th>
              </tr>
            </thead>
            <tbody>
              {filteredActivities.map(act => (
                <tr key={(act as any).ID || act.id || (act as any).CreatedAt}>
                  <td>{act.type}</td>
                  <td>{act.distance}</td>
                  <td>{act.duration}</td>
                  <td>{act.calories}</td>
                  <td>
                    {(act as any).CreatedAt ? 
                      new Date((act as any).CreatedAt).toLocaleTimeString("th-TH", { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      }) : 
                      "ไม่ระบุ"
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
