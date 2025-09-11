import HealthForm from "../Health/HealthForm";
import ActivityForm from "../Health/ActivityForm";
import ActivityEditForm from "../Health/ActivityEditForm";
import DailySummary from "../Health/DailySummary";
import HealthDisplay from "../Health/HealthDisplay";
import ActivityDisplay from "../Health/ActivityDisplay";
import HealthSummary from "../Health/HealthSummary";
import WeeklySummary from "../Health/WeeklySummary";
import { useHealthActivity } from "../../../contexts/HealthContext";
import { useNotification } from "../../../components/Notification/NotificationProvider";
import { useState } from "react";
import type { Activity } from "../../../interface/Activity";
import type { HealthData } from "../../../interface/HealthData";

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
  const { health, activities: activitiesList, allHealthData, allActivities, nutrition, updateActivity, deleteActivity, setHealth, refreshHealthData } = useHealthActivity();
  const { showNotification } = useNotification();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [activeTab, setActiveTab] = useState<'overview' | 'health' | 'activity' | 'weekly'>('overview');
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [isEditingHealth, setIsEditingHealth] = useState(false);
  const [editingHealthData, setEditingHealthData] = useState<HealthData | null>(null);

  const handleHealthEdit = (healthData: HealthData) => {
    setEditingHealthData(healthData);
    setIsEditingHealth(true);
  };

  const handleHealthSubmit = (updatedHealth: HealthData) => {
    handleHealthUpdate(updatedHealth);
    setIsEditingHealth(false);
    setEditingHealthData(null);
  };

  const handleHealthCancel = () => {
    setIsEditingHealth(false);
    setEditingHealthData(null);
  };

  const handleHealthUpdate = async (updatedHealth: HealthData) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        showNotification({
          type: 'error',
          title: 'กรุณาเข้าสู่ระบบใหม่',
          message: 'ไม่พบข้อมูลการเข้าสู่ระบบ',
          duration: 3000
        });
        return;
      }

      const response = await fetch("http://localhost:8000/api/health", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedHealth),
      });

      if (!response.ok) {
        const error = await response.json();
        showNotification({
          type: 'error',
          title: 'บันทึกข้อมูลสุขภาพไม่สำเร็จ',
          message: error.error || 'ไม่สามารถบันทึกข้อมูลสุขภาพได้',
          duration: 3000
        });
        return;
      }

      const result = await response.json();
      console.log('Health updated successfully:', result);
      
      // อัปเดต context
      const savedHealth = {
        ...result.data,
        id: result.data.ID || result.data.id,
        user_id: result.data.user_id,
      };
      setHealth(savedHealth);
      
      showNotification({
        type: 'success',
        title: 'อัปเดตข้อมูลสุขภาพสำเร็จ!',
        message: `น้ำหนัก: ${updatedHealth.weight} กก. ส่วนสูง: ${updatedHealth.height} ซม. BMI: ${updatedHealth.bmi}`,
        duration: 2000
      });
    } catch (error) {
      console.error('Error updating health:', error);
      showNotification({
        type: 'error',
        title: 'เกิดข้อผิดพลาด',
        message: 'ไม่สามารถอัปเดตข้อมูลสุขภาพได้ กรุณาลองใหม่อีกครั้ง',
        duration: 3000
      });
    }
  };

  const handleActivityEdit = (id: number, activity: Activity) => {
    setEditingActivity(activity);
  };

  const handleActivitySave = async (id: number, updatedActivity: Partial<Activity>) => {
    try {
      await updateActivity(id, updatedActivity);
      setEditingActivity(null);
      console.log('Activity updated successfully:', id);
    } catch (error) {
      console.error('Error updating activity:', error);
    }
  };

  const handleActivityCancel = () => {
    setEditingActivity(null);
  };

  const handleActivityDelete = async (id: number) => {
    try {
      await deleteActivity(id);
      console.log('Activity deleted successfully:', id);
    } catch (error) {
      console.error('Error deleting activity:', error);
    }
  };

  return (
    <div style={pageStyle}>
      <h1 style={titleStyle}>Healthy</h1>

      {/* Tab Navigation */}
      <div style={tabContainerStyle}>
        <button
          style={{
            ...tabButtonStyle,
            backgroundColor: activeTab === 'health' ? '#c50000' : 'rgba(255,255,255,0.2)',
            color: activeTab === 'health' ? '#fff' : '#fff'
          }}
          onClick={() => setActiveTab('health')}
        >
          💪 ข้อมูลสุขภาพ
        </button>
        <button
          style={{
            ...tabButtonStyle,
            backgroundColor: activeTab === 'activity' ? '#c50000' : 'rgba(255,255,255,0.2)',
            color: activeTab === 'activity' ? '#fff' : '#fff'
          }}
          onClick={() => setActiveTab('activity')}
        >
          🏃‍♂️ กิจกรรม
        </button>
        <button
          style={{
            ...tabButtonStyle,
            backgroundColor: activeTab === 'overview' ? '#c50000' : 'rgba(255,255,255,0.2)',
            color: activeTab === 'overview' ? '#fff' : '#fff'
          }}
          onClick={() => setActiveTab('overview')}
        >
          📊 สรุปภาพรวม
        </button>
        <button
          style={{
            ...tabButtonStyle,
            backgroundColor: activeTab === 'weekly' ? '#c50000' : 'rgba(255,255,255,0.2)',
            color: activeTab === 'weekly' ? '#fff' : '#fff'
          }}
          onClick={() => setActiveTab('weekly')}
        >
          📅 สรุปรายสัปดาห์
        </button>
      </div>

      {/* Date Selector - Only show for overview tab */}
      {activeTab === 'overview' && (
        <div style={dateSelectorStyle}>
          <label style={dateLabelStyle}>เลือกวันที่:</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            style={dateInputStyle}
          />
        </div>
      )}

      {/* Content based on active tab */}
      {activeTab === 'health' && (
        <div style={contentContainerStyle}>
          <div style={formsContainerStyle}>
            <HealthForm 
              activitiesList={activities} 
              onSubmit={handleHealthSubmit}
              initialData={editingHealthData ? {
                weight: editingHealthData.weight || 0,
                height: editingHealthData.height || 0,
                fat: editingHealthData.fat || 0
              } : undefined}
              isEditing={isEditingHealth}
              onCancelEdit={handleHealthCancel}
            />
            <HealthDisplay 
              health={health} 
              onEditClick={handleHealthEdit}
            />
          </div>
        </div>
      )}

      {activeTab === 'activity' && (
        <div style={contentContainerStyle}>
          <div style={formsContainerStyle}>
            {editingActivity ? (
              <ActivityEditForm
                activity={editingActivity}
                onSave={handleActivitySave}
                onCancel={handleActivityCancel}
              />
            ) : (
              <ActivityForm activitiesList={activities} />
            )}
            <ActivityDisplay
              activities={activitiesList}
              onActivityEdit={handleActivityEdit}
              onActivityDelete={handleActivityDelete}
            />
          </div>
        </div>
      )}

      {/* Summary Section - Show for overview, weekly, and activity tabs */}
      <div style={summaryContainerStyle}>
        {activeTab === 'overview' ? (
          <HealthSummary
            health={health}
            activities={activitiesList}
            nutrition={nutrition}
            selectedDate={selectedDate}
            allHealthData={allHealthData}
            allActivities={allActivities}
          />
        ) : activeTab === 'weekly' ? (
          <WeeklySummary
            health={health}
            activities={activitiesList}
            nutrition={nutrition}
            allHealthData={allHealthData}
            allActivities={allActivities}
          />
        ) : activeTab === 'activity' ? (
          <DailySummary 
            health={health} 
            activities={allActivities}
            selectedDate={selectedDate}
          />
        ) : null}
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

const tabContainerStyle: React.CSSProperties = {
  display: "flex",
  gap: "1rem",
  marginBottom: "2rem",
  backgroundColor: "rgba(0,0,0,0.3)",
  padding: "0.5rem",
  borderRadius: "15px",
  backdropFilter: "blur(10px)",
};

const tabButtonStyle: React.CSSProperties = {
  padding: "0.75rem 1.5rem",
  borderRadius: "10px",
  border: "none",
  fontSize: "1rem",
  fontWeight: "600",
  cursor: "pointer",
  transition: "all 0.3s ease",
  backdropFilter: "blur(10px)",
  boxShadow: "0 4px 8px rgba(197, 0, 0, 0.2)",
};

const dateSelectorStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "1rem",
  marginBottom: "2rem",
  backgroundColor: "rgba(255,255,255,0.9)",
  padding: "1rem 1.5rem",
  borderRadius: "15px",
  boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
};

const dateLabelStyle: React.CSSProperties = {
  color: "#374151",
  fontWeight: "600",
  fontSize: "1rem",
};

const dateInputStyle: React.CSSProperties = {
  padding: "0.5rem 1rem",
  borderRadius: "8px",
  border: "2px solid #fecaca",
  fontSize: "1rem",
  fontWeight: "500",
  backgroundColor: "#fff",
  color: "#374151",
  outline: "none",
  transition: "all 0.2s ease",
  boxShadow: "0 2px 4px rgba(197, 0, 0, 0.05)",
};

const contentContainerStyle: React.CSSProperties = {
  width: "100%",
  display: "flex",
  justifyContent: "center",
  marginBottom: "2rem",
};
