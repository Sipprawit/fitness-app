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
      <div style={emptyStateContainerStyle}>
        <div style={emptyStateIconStyle}>📊</div>
        <h2 style={emptyStateTitleStyle}>สรุปข้อมูลประจำวัน</h2>
        <p style={emptyStateTextStyle}>กรุณากรอกและบันทึกข้อมูลสุขภาพของคุณ</p>
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
    <div style={containerStyle}>
      {/* Header */}
      <div style={headerContainerStyle}>
        <div style={headerIconStyle}>📊</div>
        <h2 style={headerTitleStyle}>สรุปข้อมูลประจำวัน</h2>
        <p style={headerSubtitleStyle}>
          {new Date(selectedDate).toLocaleDateString('th-TH', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </p>
      </div>
      
      {/* Date Selector */}
      <div style={dateSelectorContainerStyle}>
        <div style={dateSelectorStyle}>
          <label style={dateLabelStyle}>
            📅 เลือกวันที่:
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            style={dateInputStyle}
          />
        </div>
        <div style={dateInfoStyle}>
          วันที่ที่มีข้อมูล: {sortedDates.length > 0 ? sortedDates.join(", ") : "ไม่มีข้อมูล"}
        </div>
      </div>

      {/* Health Data Card */}
      <div style={cardStyle}>
        <div style={cardHeaderStyle}>
          <div style={cardIconStyle}>💪</div>
          <h3 style={cardTitleStyle}>
            ข้อมูลสุขภาพล่าสุด
          </h3>
          <p style={cardSubtitleStyle}>
            วันที่: {new Date(health.date ?? new Date()).toLocaleDateString("th-TH")}
          </p>
        </div>
        
        <div style={healthDataGridStyle}>
          <div style={healthDataItemStyle}>
            <div style={healthDataIconStyle}>📏</div>
            <div style={healthDataValueStyle}>{health.height}</div>
            <div style={healthDataLabelStyle}>ส่วนสูง (ซม.)</div>
          </div>
          
          <div style={healthDataItemStyle}>
            <div style={healthDataIconStyle}>⚖️</div>
            <div style={healthDataValueStyle}>{health.weight}</div>
            <div style={healthDataLabelStyle}>น้ำหนัก (กก.)</div>
          </div>
          
          <div style={healthDataItemStyle}>
            <div style={healthDataIconStyle}>💪</div>
            <div style={healthDataValueStyle}>{health.fat}%</div>
            <div style={healthDataLabelStyle}>ไขมันในร่างกาย</div>
          </div>
          
          <div style={healthDataItemStyle}>
            <div style={healthDataIconStyle}>🩺</div>
            <div style={healthDataValueStyle}>{health.pressure}</div>
            <div style={healthDataLabelStyle}>ความดันโลหิต</div>
          </div>
          
          <div style={healthDataItemStyle}>
            <div style={healthDataIconStyle}>📊</div>
            <div style={healthDataValueStyle}>{health.bmi}</div>
            <div style={healthDataLabelStyle}>BMI</div>
          </div>
          
          <div style={healthDataItemStyle}>
            <div style={healthDataIconStyle}>✅</div>
            <div style={healthDataValueStyle}>{health.status}</div>
            <div style={healthDataLabelStyle}>สถานะ</div>
          </div>
        </div>
      </div>

      {/* Activities Card */}
      <div style={cardStyle}>
        <div style={cardHeaderStyle}>
          <div style={cardIconStyle}>🏃‍♂️</div>
          <h3 style={cardTitleStyle}>
            กิจกรรมประจำวัน
          </h3>
          <p style={cardSubtitleStyle}>
            วันที่: {new Date(selectedDate).toLocaleDateString("th-TH")}
          </p>
        </div>
        
        {filteredActivities.length === 0 ? (
          <div style={emptyActivitiesStyle}>
            <div style={emptyActivitiesIconStyle}>🏃‍♂️</div>
            <h4 style={emptyActivitiesTitleStyle}>ยังไม่มีกิจกรรม</h4>
            <p style={emptyActivitiesTextStyle}>ยังไม่มีข้อมูลกิจกรรมสำหรับวันที่นี้</p>
          </div>
        ) : (
          <div style={activitiesListStyle}>
            {filteredActivities.map((act, index) => (
              <div key={(act as any).ID || act.id || (act as any).CreatedAt || index} style={activityItemStyle}>
                <div style={activityIconStyle}>
                  {act.type === "วิ่ง" ? "🏃‍♂️" : 
                   act.type === "เดิน" ? "🚶‍♂️" : 
                   act.type === "ปั่นจักรยาน" ? "🚴‍♂️" : 
                   act.type === "ว่ายน้ำ" ? "🏊‍♂️" : 
                   act.type === "ยกน้ำหนัก" ? "🏋️‍♂️" : 
                   act.type === "โยคะ" ? "🧘‍♀️" : "💪"}
                </div>
                
                <div style={activityInfoStyle}>
                  <div style={activityTypeStyle}>{act.type}</div>
                  <div style={activityDetailsStyle}>
                    <span>📏 {act.distance} กม.</span>
                    <span>⏱️ {act.duration} ชม.</span>
                    <span>🔥 {act.calories} แคลอรี่</span>
                  </div>
                </div>
                
                <div style={activityTimeStyle}>
                  {(act as any).CreatedAt ? 
                    new Date((act as any).CreatedAt).toLocaleTimeString("th-TH", { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    }) : 
                    "ไม่ระบุ"
                  }
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
