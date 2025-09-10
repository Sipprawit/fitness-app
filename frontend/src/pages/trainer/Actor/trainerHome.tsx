import { useEffect, useMemo, useState } from "react";
import { Card, Col, Divider, Row, Table, message, Statistic } from "antd";
import type { ColumnsType } from "antd/es/table";
import { GetTrainerSchedulesByTrainer } from "../../../services/https";

interface ScheduleInterface {
  ID: number;
  available_date: string;
  start_time: string;
  end_time: string;
  status?: string;
  booking?: {
    booking_status: string;
    user?: {
      first_name?: string;
      last_name?: string;
    };
  }[];
}

function HomeTrainer() {
  const [schedules, setSchedules] = useState<ScheduleInterface[]>([]);
  const [messageApi, contextHolder] = message.useMessage();

  const columns: ColumnsType<ScheduleInterface> = [
    {
      title: "วันที่",
      dataIndex: "available_date",
      key: "available_date",
      render: (date: string) =>
        new Date(date).toLocaleDateString("th-TH", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }),
    },
    {
      title: "เวลาเริ่ม",
      dataIndex: "start_time",
      key: "start_time",
      render: (time: string) =>
        new Date(time).toLocaleTimeString("th-TH", {
          hour: "2-digit",
          minute: "2-digit",
        }),
    },
    {
      title: "เวลาสิ้นสุด",
      dataIndex: "end_time",
      key: "end_time",
      render: (time: string) =>
        new Date(time).toLocaleTimeString("th-TH", {
          hour: "2-digit",
          minute: "2-digit",
        }),
    },
    {
      title: "สถานะ",
      dataIndex: "status",
      key: "status",
      render: (status?: string) => status || "ยังไม่ระบุ",
    },
    {
      title: "ลูกค้าที่จอง",
      key: "bookings",
      render: (_: any, record: ScheduleInterface) =>
        record.booking && record.booking.length > 0
          ? record.booking
              .map((b) =>
                b.user ? `${b.user.first_name ?? ""} ${b.user.last_name ?? ""}` : "ไม่มีข้อมูลผู้ใช้"
              )
              .join(", ")
          : "ยังไม่มีการจอง",
    },
  ];

  const totalSchedules = schedules.length;
  const totalBookings = useMemo(
    () =>
      schedules.reduce((sum, s) => {
        return sum + (s.booking?.length ?? 0);
      }, 0),
    [schedules]
  );

  const fetchAllSchedules = async () => {
    try {
      const trainerIdStr = localStorage.getItem("id");
      const trainerId = trainerIdStr ? Number(trainerIdStr) : NaN;
      if (!trainerId || Number.isNaN(trainerId)) {
        setSchedules([]);
        messageApi.open({ type: "error", content: "ไม่พบรหัสเทรนเนอร์ที่กำลังล็อกอิน" });
        return;
      }

      const res = await GetTrainerSchedulesByTrainer(trainerId);
      if (res.status === 200) {
        setSchedules(res.data as ScheduleInterface[]);
      } else {
        setSchedules([]);
        messageApi.open({ type: "error", content: res.data?.error || "ไม่สามารถดึงข้อมูลได้" });
      }
    } catch (err: any) {
      messageApi.open({ type: "error", content: err?.message || "เกิดข้อผิดพลาดในการดึงข้อมูล" });
    }
  };

  useEffect(() => {
    fetchAllSchedules();
  }, []);

  return (
    <div className="p-4 text-white">
      {contextHolder}
      <h1 className="text-2xl font-bold">Trainer Dashboard</h1>
      <p>ภาพรวมตารางเทรนและการจอง</p>

      <Divider />

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card>
            <Statistic title="ตารางเวลาทั้งหมด" value={totalSchedules} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card>
            <Statistic title="จำนวนการสมัครจองทั้งหมด" value={totalBookings} />
          </Card>
        </Col>
      </Row>

      <Divider />

      <Card>
        <h2 className="text-xl font-bold" style={{ marginBottom: 16 }}>ตารางเวลาทั้งหมด</h2>
        <Table
          rowKey="ID"
          columns={columns}
          dataSource={schedules}
          style={{ width: "100%", overflowX: "auto" }}
        />
      </Card>
    </div>
  );
}

export default HomeTrainer;
