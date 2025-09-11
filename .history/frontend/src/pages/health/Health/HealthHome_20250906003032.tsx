import HealthForm from "../Health/HealthForm";
import ActivityForm from "../Health/ActivityForm";
import DailySummary from "../Health/DailySummary";
import { useHealthActivity } from "../../../contexts/HealthContext";

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

  return (
    <div style={pageStyle}>
      <h1 style={titleStyle}>Healthy</h1>

      <div style={formsContainerStyle}>
        <HealthForm />
        <ActivityForm activitiesList={activities} />
      </div>

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
