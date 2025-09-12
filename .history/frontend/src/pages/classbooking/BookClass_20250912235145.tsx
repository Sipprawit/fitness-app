import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { IClassBooking } from '../../interface/IClassBooking';
import { getUserBookings, cancelClassBooking } from '../../services/apiService';
import { useNotification } from '../../components/Notification/NotificationProvider';
import '../admin/ClassActivity/ClassActivity.css';

const BookClass: React.FC = () => {
  const [bookings, setBookings] = useState<IClassBooking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const userId = localStorage.getItem('id');
        if (!userId) {
          setError('ไม่พบข้อมูลผู้ใช้');
          return;
        }
        
        const data = await getUserBookings(parseInt(userId));
        setBookings(data);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching bookings:', err);
        setError(err.response?.data?.error || 'ไม่สามารถโหลดข้อมูลได้');
      } finally {
        setLoading(false);
      }
    };
    
    fetchBookings();
  }, []);

  const handleBackToClass = () => {
    navigate('/class');
  };

  const handleCancelBooking = async (bookingId: number) => {
    try {
      await cancelClassBooking(bookingId);
      showNotification({
        type: 'success',
        title: 'สำเร็จ',
        message: 'ยกเลิกการจองสำเร็จ',
        duration: 3000
      });
      
      // อัปเดตข้อมูลการจองหลังจากยกเลิก
      const userId = localStorage.getItem('id');
      if (userId) {
        const updatedBookings = await getUserBookings(parseInt(userId));
        setBookings(updatedBookings);
      }
    } catch (err: any) {
      console.error('Error cancelling booking:', err);
      showNotification({
        type: 'error',
        title: 'เกิดข้อผิดพลาด',
        message: err.response?.data?.error || 'ไม่สามารถยกเลิกการจองได้',
        duration: 3000
      });
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return '#52c41a';
      case 'pending':
        return '#faad14';
      case 'cancelled':
        return '#ff4d4f';
      default:
        return '#666';
    }
  };

  const isBookingExpired = (booking: IClassBooking) => {
    if (!booking.class_activity?.date || !booking.class_activity?.endTime) {
      return false;
    }
    
    try {
      const classDate = new Date(booking.class_activity.date);
      const [hours, minutes] = booking.class_activity.endTime.split(':').map(Number);
      const classEndTime = new Date(classDate);
      classEndTime.setHours(hours, minutes, 0, 0);
      
      const now = new Date();
      return now > classEndTime;
    } catch {
      return false;
    }
  };

  if (loading) return <div className="main-content"><div className="content-section">กำลังโหลด...</div></div>;
  if (error) return <div className="main-content"><div className="content-section">เกิดข้อผิดพลาด: {error}</div></div>;

  return (
    <div className="main-content">
      <div className="content-section">
        <div className="header-with-button">
          <h2>ประวัติการจองคลาส</h2>
          <button 
            onClick={handleBackToClass}
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
            กลับไปหน้าคลาส
          </button>
        </div>

        {Array.isArray(bookings) && bookings.length > 0 ? (
          <div style={{ marginTop: '20px' }}>
            <table style={{ 
              width: '100%', 
              borderCollapse: 'collapse',
              backgroundColor: 'white',
              borderRadius: '8px',
              overflow: 'hidden',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              <thead>
                <tr style={{ backgroundColor: '#f5f5f5' }}>
                  <th style={{ 
                    padding: '16px', 
                    textAlign: 'left', 
                    borderBottom: '1px solid #e8e8e8',
                    fontWeight: '600',
                    fontSize: '14px',
                    color: '#333'
                  }}>ชื่อคลาส</th>
                  <th style={{ 
                    padding: '16px', 
                    textAlign: 'left', 
                    borderBottom: '1px solid #e8e8e8',
                    fontWeight: '600',
                    fontSize: '14px',
                    color: '#333'
                  }}>วันที่</th>
                  <th style={{ 
                    padding: '16px', 
                    textAlign: 'left', 
                    borderBottom: '1px solid #e8e8e8',
                    fontWeight: '600',
                    fontSize: '14px',
                    color: '#333'
                  }}>เวลา</th>
                  <th style={{ 
                    padding: '16px', 
                    textAlign: 'left', 
                    borderBottom: '1px solid #e8e8e8',
                    fontWeight: '600',
                    fontSize: '14px',
                    color: '#333'
                  }}>สถานะ</th>
                  <th style={{ 
                    padding: '16px', 
                    textAlign: 'center', 
                    borderBottom: '1px solid #e8e8e8',
                    fontWeight: '600',
                    fontSize: '14px',
                    color: '#333'
                  }}>การดำเนินการ</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking.ID} style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <td style={{ 
                      padding: '16px', 
                      borderBottom: '1px solid #f0f0f0',
                      fontSize: '14px',
                      color: '#333'
                    }}>
                      {booking.class_activity?.name || 'ไม่ระบุชื่อคลาส'}
                    </td>
                    <td style={{ 
                      padding: '16px', 
                      borderBottom: '1px solid #f0f0f0',
                      fontSize: '14px',
                      color: '#333'
                    }}>
                      {booking.class_activity?.date ? formatDate(booking.class_activity.date) : 'ไม่ระบุวันที่'}
                    </td>
                    <td style={{ 
                      padding: '16px', 
                      borderBottom: '1px solid #f0f0f0',
                      fontSize: '14px',
                      color: '#333'
                    }}>
                      {booking.class_activity?.startTime && booking.class_activity?.endTime 
                        ? `${booking.class_activity.startTime} - ${booking.class_activity.endTime}`
                        : 'ไม่ระบุเวลา'
                      }
                    </td>
                    <td style={{ 
                      padding: '16px', 
                      borderBottom: '1px solid #f0f0f0',
                      fontSize: '14px'
                    }}>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: '500',
                        backgroundColor: getStatusColor(booking.status) + '20',
                        color: getStatusColor(booking.status)
                      }}>
                        {booking.status}
                      </span>
                    </td>
                    <td style={{ 
                      padding: '16px', 
                      borderBottom: '1px solid #f0f0f0',
                      textAlign: 'center'
                    }}>
                      {booking.status.toLowerCase() !== 'cancelled' && !isBookingExpired(booking) && (
                        <button
                          onClick={() => handleCancelBooking(booking.ID!)}
                          style={{
                            padding: '6px 12px',
                            border: 'none',
                            borderRadius: '4px',
                            backgroundColor: '#e50000',
                            color: 'white',
                            fontSize: '12px',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.backgroundColor = '#e50000';
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.backgroundColor = '#ff4d4f';
                          }}
                        >
                          ยกเลิก
                        </button>
                      )}
                      {isBookingExpired(booking) && (
                        <span style={{
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          backgroundColor: '#f5f5f5',
                          color: '#999',
                          border: '1px solid #d9d9d9'
                        }}>
                          หมดเวลาแล้ว
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <p style={{ fontSize: '16px', color: '#666', marginBottom: '20px' }}>คุณยังไม่มีการจองคลาสใดๆ</p>
            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', alignItems: 'center', marginTop: '20px' }}>
              <button 
                onClick={handleBackToClass}
                style={{
                  padding: '12px 24px',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '500',
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  backgroundColor: '#c50000',
                  color: 'white',
                  minWidth: '120px'
                }}
              >
                จองคลาส
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookClass;
