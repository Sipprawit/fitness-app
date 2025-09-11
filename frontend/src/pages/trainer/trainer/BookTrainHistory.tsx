import React, { useEffect, useState } from "react";
import { Spin, message } from "antd";
import { useNavigate } from "react-router-dom";
import { GetBookingsByUserId, CancelTrainBooking } from "../../../services/https";
import type { TrainBookingInterface } from "../../../interface/ITrainBooking";
import dayjs from "dayjs";
import "dayjs/locale/th";
import "./BookTrainHistory.css";

dayjs.locale("th");

const BookTrainHistory: React.FC = () => {
  const [bookings, setBookings] = useState<TrainBookingInterface[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBookingHistory();
  }, []);

  const fetchBookingHistory = async () => {
    try {
      const userId = localStorage.getItem("id");
      if (!userId) {
        message.error("ไม่พบรหัสผู้ใช้งาน");
        navigate("/login");
        return;
      }

      const res = await GetBookingsByUserId(Number(userId));
      if (res?.data) {
        setBookings(res.data);
      }
    } catch (error) {
      console.error("Error fetching booking history:", error);
      message.error("เกิดข้อผิดพลาดในการดึงข้อมูลประวัติการจอง");
    } finally {
      setLoading(false);
    }
  };


  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "ยืนยันแล้ว";
      case "booked":
        return "จองแล้ว";
      case "pending":
        return "รอยืนยัน";
      case "cancelled":
        return "ยกเลิกแล้ว";
      default:
        return status;
    }
  };

  const isBookingExpired = (booking: TrainBookingInterface) => {
    if (!booking.schedule?.available_date || !booking.schedule?.end_time) {
      return false;
    }
    
    try {
      const trainDate = dayjs(booking.schedule.available_date);
      const [hours, minutes] = booking.schedule.end_time.split(':').map(Number);
      const trainEndTime = trainDate.hour(hours).minute(minutes).second(0);
      
      const now = dayjs();
      return now.isAfter(trainEndTime);
    } catch {
      return false;
    }
  };

  const handleCancelBooking = async (bookingId: number) => {
    try {
      const response = await CancelTrainBooking(bookingId);
      
      if (response.status === 200) {
        message.success("ยกเลิกการจองสำเร็จ");
        // Refresh the booking list
        fetchBookingHistory();
      } else {
        message.error(response.data?.error || "ไม่สามารถยกเลิกการจองได้");
      }
    } catch (error) {
      console.error("Error cancelling booking:", error);
      message.error("เกิดข้อผิดพลาดในการยกเลิกการจอง");
    }
  };

  if (loading) {
    return (
      <Spin size="large" style={{ display: "block", margin: "50px auto" }} />
    );
  }

  return (
    <div className="booking-history-container">
      <div className="booking-history-header">
        <div className="header-row">
          <div className="header-content">
            <h1 className="booking-history-title">
              ประวัติการจองเทรนเนอร์
            </h1>
            <p className="booking-history-subtitle">
              ดูประวัติการจองเทรนเนอร์ส่วนตัวของคุณ
            </p>
          </div>
          <div className="header-actions">
            <button 
              className="back-button"
              onClick={() => navigate('/trainerbooking')}
            >
              ย้อนกลับ
            </button>
          </div>
        </div>
      </div>

      <div className="booking-table-container">
        {bookings.length === 0 ? (
          <div className="empty-state">
            <h3>ยังไม่มีประวัติการจองเทรนเนอร์</h3>
            <button 
              className="start-booking-button"
              onClick={() => navigate('/trainerbooking')}
            >
              เริ่มจองเทรนเนอร์
            </button>
          </div>
        ) : (
          <table className="booking-table">
            <thead>
              <tr>
                <th>ชื่อเทรนเนอร์</th>
                <th>วันที่จอง</th>
                <th>วันที่เทรน</th>
                <th>เวลา</th>
                <th>สถานะ</th>
                <th>การดำเนินการ</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => {
                const startTime = booking.schedule?.start_time 
                  ? dayjs(booking.schedule.start_time).format("HH:mm")
                  : "-";
                const endTime = booking.schedule?.end_time 
                  ? dayjs(booking.schedule.end_time).format("HH:mm")
                  : "-";
                const bookingDate = dayjs(booking.booking_date).format("DD/MM/YYYY");
                const trainDate = booking.schedule?.available_date 
                  ? dayjs(booking.schedule.available_date).format("DD/MM/YYYY")
                  : "-";

                return (
                  <tr key={booking.ID}>
                    <td>
                      {booking.schedule?.Trainer 
                        ? `${booking.schedule.Trainer.first_name} ${booking.schedule.Trainer.last_name}`
                        : booking.schedule?.TrainerID 
                          ? `เทรนเนอร์ ID: ${booking.schedule.TrainerID}`
                          : "ไม่พบข้อมูลเทรนเนอร์"
                      }
                    </td>
                    <td>{bookingDate}</td>
                    <td>{trainDate}</td>
                    <td>{startTime} - {endTime}</td>
                    <td>
                      <span className={`status-tag status-${booking.booking_status.toLowerCase()}`}>
                        {getStatusText(booking.booking_status)}
                      </span>
                    </td>
                    <td>
                      {(booking.booking_status.toLowerCase() === 'confirmed' || 
                        booking.booking_status.toLowerCase() === 'booked') && 
                        !isBookingExpired(booking) && (
                        <button 
                          className="cancel-button"
                          onClick={() => booking.ID && handleCancelBooking(booking.ID)}
                        >
                          ยกเลิก
                        </button>
                      )}
                      {isBookingExpired(booking) && (
                        <span className="expired-tag">
                          หมดเวลาแล้ว
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default BookTrainHistory;
