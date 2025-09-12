// src/pages/trainer/trainer/TrainerSchedule.tsx
import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { Spin, Button, DatePicker, Modal } from "antd";
import { useNotification } from "../../../components/Notification/NotificationProvider";
import dayjs from "dayjs";
import type { Dayjs } from "dayjs";
import "dayjs/locale/th";
import locale from "antd/es/date-picker/locale/th_TH";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import customParseFormat from "dayjs/plugin/customParseFormat";
import {
  GetTrainerById,
  GetTrainerSchedulesByDate,
  BookTrainerSchedule,
  CancelTrainBooking,
} from "../../../services/https";
import type { TrainerInterface } from "../../../interface/ITrainer";

// ---- dayjs setup ----
dayjs.locale("th");
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);
dayjs.tz.setDefault("Asia/Bangkok");

// ----------------------

type Schedule = {
  ID: number;
  status: "Available" | "Booked";
  available_date: string;
  start_time: string;
  end_time: string;
  time_slot?: string;
  user_id?: number;
  booking_id?: number;
};

type ScheduleWithComputed = Schedule & {
  isPast: boolean;
  start: Dayjs;
  end: Dayjs;
};

const BookTrainSchedule: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [trainer, setTrainer] = useState<TrainerInterface | null>(null);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<Schedule | null>(null);
  const { showNotification } = useNotification();

  const fetchTrainer = async () => {
    if (!id) return;
    try {
      const res = await GetTrainerById(Number(id));
      if (res?.data) setTrainer(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchTrainerData = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const dateStr = selectedDate.format("YYYY-MM-DD");
      const res = await GetTrainerSchedulesByDate(Number(id), dateStr);
      
      console.log("Schedules from backend:", res?.data);
      

      const data = res?.data ?? [];

      const mapped = (Array.isArray(data) ? data : []).map((s: any) => {
        const booking = s.booking && s.booking.length > 0 ? s.booking[0] : null;
        return {
          ...s,
          user_id: booking?.user_id,
          booking_id: booking?.ID,
        };
      });

      setSchedules(mapped);
    } catch (e) {
      console.error(e);
      setSchedules([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrainer();
  }, [id]);

  useEffect(() => {
    fetchTrainerData();
  }, [id, selectedDate]);

  const disabledDate = (current: dayjs.Dayjs) => {
    return (
      !!current &&
      (current.isBefore(dayjs().startOf("day")) ||
        current.isAfter(dayjs().add(7, "day").endOf("day")))
    );
  };

  const handleDateChange = (date: dayjs.Dayjs | null) => {
    if (date) setSelectedDate(date);
  };

  // -------- Helpers: parse & format ----------
  const parseToBKK = (value: string, fallbackDate?: string): Dayjs => {
    if (!value) return dayjs(NaN);

    const looksLikeOnlyTime = /^\d{2}:\d{2}(:\d{2})?$/.test(value);
    if (looksLikeOnlyTime) {
      const date = fallbackDate || selectedDate.format("YYYY-MM-DD");
      const hhmmss = value.length === 5 ? `${value}:00` : value;
      return dayjs.tz(`${date}T${hhmmss}`, "Asia/Bangkok");
    }

    const normalized = value.includes("T") ? value : value.replace(" ", "T");

    if (/[+-]\d{2}:?\d{2}$/.test(normalized)) {
      return dayjs(normalized).tz("Asia/Bangkok");
    }

    return dayjs.tz(normalized, "Asia/Bangkok");
  };

  const formatThaiTime = (d: Dayjs) =>
    d.isValid() ? `${d.format("HH:mm")} น.` : "-";

  const schedulesWithComputed: ScheduleWithComputed[] = useMemo(() => {
    return schedules
      .map((s) => {
        const start = parseToBKK(s.start_time, s.available_date);
        const end = parseToBKK(s.end_time, s.available_date);
        return {
          ...s,
          start,
          end,
          isPast: start.isBefore(dayjs()),
        };
      })
      .sort((a, b) => a.start.valueOf() - b.start.valueOf());
  }, [schedules, selectedDate]);

  const handleSlotClick = (slot: ScheduleWithComputed) => {
    if (slot.status === "Available" && !slot.isPast) {
      setSelectedSlot(slot);
      setModalVisible(true);
    }
  };

  const handleBooking = async () => {
    if (!selectedSlot) return;
    try {
      const userIdStr = localStorage.getItem("id");
      if (!userIdStr) {
        Modal.error({
          title: "เกิดข้อผิดพลาด",
          content: "ไม่พบรหัสผู้ใช้งาน",
        });
        return;
      }
      const userId = Number(userIdStr);

      console.log("handleBooking slot:", selectedSlot.ID, "user:", userId);

      // ✅ จะส่ง { schedule_id, user_id }
      const res = await BookTrainerSchedule(selectedSlot.ID, userId);

      if (res?.status === 201) {
        showNotification({
          type: 'success',
          title: 'จองสำเร็จ',
          message: 'จองเทรนเนอร์เรียบร้อยแล้ว',
          duration: 2000
        });

        // ✅ ดึง booking จาก backend
        const booking = res.data?.data; // <-- backend ส่ง {"message": "...", "data": {...}}

        setSchedules((prev) =>
          prev.map((s) =>
            s.ID === selectedSlot.ID
              ? {
                  ...s,
                  status: "Booked",
                  user_id: userId,
                  booking_id: booking?.ID, // ✅ ใช้ ID ของ booking จริง
                }
              : s
          )
        );
      } else {
        Modal.error({
          title: "จองไม่สำเร็จ",
          content: res?.data?.error || "เกิดข้อผิดพลาด",
        });
      }
    } catch (e) {
      Modal.error({
        title: "จองไม่สำเร็จ",
        content: "เกิดข้อผิดพลาดในการจอง",
      });
    } finally {
      setModalVisible(false);
    }
  };

  const handleCancelBooking = async (bookingId?: number) => {
    if (!bookingId) {
      Modal.error({ title: "ยกเลิกไม่สำเร็จ", content: "ไม่พบ booking_id" });
      return;
    }
    try {
      const res = await CancelTrainBooking(bookingId);
      if (res?.status === 200) {
        message.success("ยกเลิกสำเร็จ");

        setSchedules((prev) =>
          prev.map((s) =>
            s.booking_id === bookingId
              ? {
                  ...s,
                  status: "Available",
                  user_id: undefined,
                  booking_id: undefined,
                }
              : s
          )
        );
      } else {
        Modal.error({
          title: "ยกเลิกไม่สำเร็จ",
          content: res?.data?.error || "เกิดข้อผิดพลาด",
        });
      }
    } catch (e) {
      Modal.error({ title: "ยกเลิกไม่สำเร็จ", content: "เกิดข้อผิดพลาด" });
    }
  };

  if (loading)
    return (
      <Spin size="large" style={{ display: "block", margin: "50px auto" }} />
    );

  if (!trainer)
    return (
      <p style={{ textAlign: "center", color: "#fff" }}>ไม่พบข้อมูลเทรนเนอร์</p>
    );

  return (
    <div className="p-4 text-white">
      <div style={{ padding: "1rem", marginBottom: "1rem" }}>
        <h1 className="text-2xl font-bold">Trainer Booking</h1>
        <p>สมัครเทรนส่วนตัว</p>
      </div>

      <div
        style={{
          marginBottom: "1rem",
          background: "#f5f5f5",
          padding: "10px",
          textAlign: "center",
          color: "#000",
          fontWeight: "bold",
        }}
      >
        <p>
          {trainer.first_name} {trainer.last_name}
        </p>
      </div>

      <div style={{ margin: "24px 0" }}>
        <DatePicker
          locale={locale}
          value={selectedDate}
          onChange={handleDateChange}
          disabledDate={disabledDate}
          allowClear={false}
          style={{ width: 200 }}
          format="DD/MM/YYYY"
        />
      </div>

      {!schedulesWithComputed.length ? (
        <p style={{ textAlign: "center", marginTop: "2rem" }}>
          ไม่มีตารางเทรนส่วนตัวในวันนี้
        </p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th
                  style={{
                    padding: 12,
                    border: "1px solid #ddd",
                    backgroundColor: "#f2f2f2",
                    color: "#000",
                    textAlign: "center",
                  }}
                >
                  เวลา
                </th>
                <th
                  style={{
                    padding: 12,
                    border: "1px solid #ddd",
                    backgroundColor: "#f2f2f2",
                    color: "#000",
                    textAlign: "center",
                  }}
                >
                  สถานะ
                </th>
              </tr>
            </thead>
            <tbody>
              {schedulesWithComputed.map((slot) => {
                let cellContent: React.ReactNode = "ว่าง";
                let cellStyle: React.CSSProperties = {
                  padding: 12,
                  border: "1px solid #ddd",
                  textAlign: "center",
                  cursor: "pointer",
                  backgroundColor: "#fff",
                  color: "#000",
                };

                if (slot.status === "Booked") {
                  if (slot.user_id === Number(localStorage.getItem("id"))) {
                    const canCancel = !slot.isPast; // ตรวจสอบว่าไม่เลยเวลา
                    cellContent = (
                      <>
                        <span>จองแล้ว</span>
                        <br />
                        {canCancel ? (
                          <Button
                            type="link"
                            style={{ color: "red", padding: 0 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCancelBooking(slot.booking_id); // ✅ ใช้ booking_id
                            }}
                          >
                            ยกเลิก
                          </Button>
                        ) : (
                          <span style={{ color: "#999", fontSize: "12px" }}>
                            ไม่สามารถยกเลิกได้
                          </span>
                        )}
                      </>
                    );
                  } else {
                    cellContent = "ไม่ว่าง";
                    cellStyle.backgroundColor = "#ffcccc";
                    cellStyle.cursor = "not-allowed";
                  }
                } else if (slot.isPast) {
                  cellContent = (
                    <span style={{ color: "#999" }}>เลยเวลาแล้ว</span>
                  );
                  cellStyle.cursor = "not-allowed";
                  cellStyle.backgroundColor = "#fff";
                } else {
                  cellContent = "ว่าง";
                  cellStyle.backgroundColor = "#00FF40";
                }

                return (
                  <tr key={slot.ID}>
                    <td
                      style={{
                        padding: 12,
                        border: "1px solid #ddd",
                        backgroundColor: "#f9f9f9",
                        color: "#000",
                        textAlign: "center",
                      }}
                    >
                      {formatThaiTime(slot.start)} - {formatThaiTime(slot.end)}
                    </td>
                    <td style={cellStyle} onClick={() => handleSlotClick(slot)}>
                      {cellContent}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        title="Confirm"
        open={modalVisible}
        onOk={handleBooking}
        onCancel={() => setModalVisible(false)}
        okText="OK"
        cancelText="Cancel"
      >
        <p>ยืนยันการจอง?</p>
      </Modal>
    </div>
  );
};

export default BookTrainSchedule;
