import { useEffect, useMemo, useState } from "react";
import { Card, Col, Divider, Row, Table, Statistic, Button, Popconfirm } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { GetTrainerSchedulesByTrainer, DeleteTrainerScheduleById } from "../../../services/https";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../../../components/Notification/NotificationProvider";

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
  const { showNotification } = useNotification();
  const navigate = useNavigate();

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
    {
      title: "การดำเนินการ",
      key: "actions",
      render: (_: any, record: ScheduleInterface) => (
        <Popconfirm
          title="ยืนยันการลบ"
          description="คุณแน่ใจหรือไม่ที่จะลบตารางเวลานี้?"
          onConfirm={() => handleDeleteSchedule(record.ID)}
          okText="ยืนยัน"
          cancelText="ยกเลิก"
        >
          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            size="small"
          >
            ลบ
          </Button>
        </Popconfirm>
      ),
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
        showNotification({
          type: "error",
          title: "เกิดข้อผิดพลาด",
          message: "ไม่พบรหัสเทรนเนอร์ที่กำลังล็อกอิน",
          duration: 3000
        });
        return;
      }

      const res = await GetTrainerSchedulesByTrainer(trainerId);
      if (res.status === 200) {
        setSchedules(res.data as ScheduleInterface[]);
      } else {
        setSchedules([]);
        showNotification({
          type: "error",
          title: "เกิดข้อผิดพลาด",
          message: res.data?.error || "ไม่สามารถดึงข้อมูลได้",
          duration: 3000
        });
      }
    } catch (err: any) {
      showNotification({
        type: "error",
        title: "เกิดข้อผิดพลาด",
        message: err?.message || "เกิดข้อผิดพลาดในการดึงข้อมูล",
        duration: 3000
      });
    }
  };

  const handleDeleteSchedule = async (scheduleId: number) => {
    try {
      const res = await DeleteTrainerScheduleById(scheduleId);
      if (res.status === 200) {
        showNotification({
          type: "success",
          title: "สำเร็จ",
          message: "ลบตารางเวลาสำเร็จ",
          duration: 3000
        });
        fetchAllSchedules(); // รีเฟรชข้อมูล
      } else {
        showNotification({
          type: "error",
          title: "เกิดข้อผิดพลาด",
          message: res.data?.error || "ไม่สามารถลบตารางเวลาได้",
          duration: 3000
        });
      }
    } catch (err: any) {
      showNotification({
        type: "error",
        title: "เกิดข้อผิดพลาด",
        message: err?.message || "เกิดข้อผิดพลาดในการลบตารางเวลา",
        duration: 3000
      });
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2 className="text-xl font-bold" style={{ margin: 0 }}>ตารางเวลาทั้งหมด</h2>
          <Button 
            icon={<PlusOutlined />}
            onClick={() => {
              const trainerId = localStorage.getItem("id");
              console.log("TrainerHome - trainerId from localStorage:", trainerId);
              if (trainerId) {
                const url = `/trainer/${trainerId}/schedule/addTrainerSchedule`;
                console.log("TrainerHome - Navigating to:", url);
                navigate(url);
              } else {
                messageApi.open({ type: "error", content: "ไม่พบรหัสเทรนเนอร์ที่กำลังล็อกอิน" });
              }
            }}
            style={{ backgroundColor: '#e50000', borderColor: '#e50000', color: 'white' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#cc0000';
              e.currentTarget.style.borderColor = '#cc0000';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#e50000';
              e.currentTarget.style.borderColor = '#e50000';
            }}
          >
            สร้างตารางเวลา
          </Button>
        </div>
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
