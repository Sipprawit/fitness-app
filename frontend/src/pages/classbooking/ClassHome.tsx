import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ClassActivity } from '../../types';
import { getAllClasses } from '../../services/apiService';
import '../admin/ClassActivity/ClassActivity.css';

const ClassHome: React.FC = () => {
  const [classes, setClasses] = useState<ClassActivity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setLoading(true);
        const data = await getAllClasses();
        if (Array.isArray(data)) {
          // กรองคลาสที่มีวันที่ผ่านไปแล้วออก
          const today = new Date().toISOString().split('T')[0]; // ได้ YYYY-MM-DD
          const upcomingClasses = data.filter(cls => cls.date >= today);
          setClasses(upcomingClasses);
        } else {
          setClasses([]);
        }
        setError(null);
      } catch (err) {
        setError('ไม่สามารถโหลดข้อมูลได้');
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  const handleClassClick = (id: number) => {
    navigate(`/class/detail/${id}`);
  };

  if (loading) return <div className="main-content"><div className="content-section">กำลังโหลด...</div></div>;
  if (error) return <div className="main-content"><div className="content-section">เกิดข้อผิดพลาด: {error}</div></div>;

  return (
    <div className="main-content">
      <div className="content-section">
        <div className="header-with-button">
          <h2>Class Booking</h2>
          <button 
            onClick={() => navigate('/class/booking-history')}
            style={{ 
              marginLeft: 'auto',
              padding: '12px 24px',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '500',
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              backgroundColor: '#E0E0E0',
              color: '#333',
              minWidth: '120px'
            }}
          >
            ดูประวัติการจอง
          </button>
        </div>

        {Array.isArray(classes) && classes.length > 0 ? (
          <div className="card-grid">
            {classes.map((cls) => (
              <div key={cls.id} className="card" onClick={() => handleClassClick(cls.id)} style={{ cursor: 'pointer' }}>
                <img src={cls.imageUrl} alt={cls.name} className="card-image" />
                <div className="card-footer">
                  <span className="card-name">{cls.name}</span>
                  <span className="card-sub">{cls.date} | {cls.startTime} - {cls.endTime} | {cls.currentParticipants}/{cls.capacity}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>ยังไม่มีคลาสหรือกิจกรรมในขณะนี้</p>
        )}
      </div>
    </div>
  );
};

export default ClassHome;