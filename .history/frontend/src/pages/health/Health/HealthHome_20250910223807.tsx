import HealthForm from "../Health/HealthForm";
import ActivityForm from "../Health/ActivityForm";
import DailySummary from "../Health/DailySummary";
import HealthDisplay from "../Health/HealthDisplay";
import ActivityDisplay from "../Health/ActivityDisplay";
import HealthSummary from "../Health/HealthSummary";
import { useHealthActivity } from "../../../contexts/HealthContext";
import { useState } from "react";

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

export default function HealthHome() {
  const { health, activities: activitiesList } = useHealthActivity();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [activeTab, setActiveTab] = useState<'overview' | 'health' | 'activity'>('overview');

  const handleHealthUpdate = (updatedHealth: any) => {
    // TODO: Implement health update logic
    console.log('Health updated:', updatedHealth);
  };

  const handleActivityAdd = (newActivity: any) => {
    // TODO: Implement activity add logic
    console.log('Activity added:', newActivity);
  };

  const handleActivityDelete = (id: number) => {
    // TODO: Implement activity delete logic
    console.log('Activity deleted:', id);
  };

  return (
    <div style={pageStyle}>
      <h1 style={titleStyle}>Healthy</h1>

      {/* Tab Navigation */}
      <div style={tabContainerStyle}>
        <button
          style={{
            ...tabButtonStyle,
            backgroundColor: activeTab === 'overview' ? '#10b981' : 'rgba(255,255,255,0.2)',
            color: activeTab === 'overview' ? '#fff' : '#fff'
          }}
          onClick={() => setActiveTab('overview')}
        >
          📊 สรุปภาพรวม
        </button>
        <button
          style={{
            ...tabButtonStyle,
            backgroundColor: activeTab === 'health' ? '#10b981' : 'rgba(255,255,255,0.2)',
            color: activeTab === 'health' ? '#fff' : '#fff'
          }}
          onClick={() => setActiveTab('health')}
        >
          💪 ข้อมูลสุขภาพ
        </button>
        <button
          style={{
            ...tabButtonStyle,
            backgroundColor: activeTab === 'activity' ? '#10b981' : 'rgba(255,255,255,0.2)',
            color: activeTab === 'activity' ? '#fff' : '#fff'
          }}
          onClick={() => setActiveTab('activity')}
        >
          🏃‍♂️ กิจกรรม
        </button>
      </div>

      {/* Date Selector */}
      <div style={dateSelectorStyle}>
        <label style={dateLabelStyle}>เลือกวันที่:</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          style={dateInputStyle}
        />
      </div>

      {/* Content based on active tab */}
      {activeTab === 'overview' && (
        <div style={contentContainerStyle}>
          <HealthSummary
            health={health}
            activities={activitiesList}
            nutrition={null} // TODO: Add nutrition data
            selectedDate={selectedDate}
          />
        </div>
      )}

      {activeTab === 'health' && (
        <div style={contentContainerStyle}>
          <div style={formsContainerStyle}>
            <HealthForm />
            <HealthDisplay 
              health={health} 
              onHealthUpdate={handleHealthUpdate}
            />
          </div>
        </div>
      )}

      {activeTab === 'activity' && (
        <div style={contentContainerStyle}>
          <div style={formsContainerStyle}>
            <ActivityForm activitiesList={activities} />
            <ActivityDisplay
              activities={activitiesList}
              onActivityAdd={handleActivityAdd}
              onActivityDelete={handleActivityDelete}
            />
          </div>
        </div>
      )}

      {/* Legacy Daily Summary - Keep for now */}
      <div style={summaryContainerStyle}>
        <DailySummary health={health} activities={activitiesList} />
      </div>
    </div>
  );
}

const pageStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "flex-start",
  padding: "2rem",
  backgroundImage: "url('/gym.jpg')",
  backgroundSize: "cover",
  backgroundPosition: "center",
  minHeight: "100vh",
};

const titleStyle: React.CSSProperties = {
  fontSize: "5rem",
  color: "white",
  marginBottom: "2rem",
  textShadow: "2px 2px 6px rgba(0,0,0,0.5)",
};

const formsContainerStyle: React.CSSProperties = {
  display: "flex",
  gap: "2rem",
  flexWrap: "wrap",
  justifyContent: "center",
  marginBottom: "2rem",
};

const summaryContainerStyle: React.CSSProperties = {
  width: "100%",
  display: "flex",
  justifyContent: "center",
};
