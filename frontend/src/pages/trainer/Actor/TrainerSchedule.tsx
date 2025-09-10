import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Space, Table, Button, Col, Row, Divider, message, Card } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import {
  GetTrainerSchedulesByTrainer,
  DeleteTrainerScheduleById,
} from "../../../services/https";

interface ScheduleInterface {
  ID: number;
  available_date: string;
  start_time: string;
  end_time: string;
  status: string;
  booking?: {
    booking_status: string;
    user?: {
      first_name?: string;
      last_name?: string;
    };
  }[];
}

function TrainerSchedule() {
  const { id } = useParams();
  const [schedules, setSchedules] = useState<ScheduleInterface[]>([]);
  const [messageApi, contextHolder] = message.useMessage();

  // 📌 คอลัมน์สำหรับตาราง
  const columns: ColumnsType<ScheduleInterface> = [
    {
      title: "ลำดับ",
      dataIndex: "ID",
      key: "ID",
    },
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
      render: (status: string) => status || "ยังไม่ระบุ",
    },
    {
      title: "ลูกค้าที่จอง",
      key: "bookings",
      render: (_: any, record: ScheduleInterface) =>
        record.booking && record.booking.length > 0
          ? record.booking
              .map((b) =>
                b.user
                  ? `${b.user.first_name ?? ""} ${b.user.last_name ?? ""}`
                  : "ไม่มีข้อมูลผู้ใช้"
              )
              .join(", ")
          : "ยังไม่มีการจอง",
    },
    {
      title: "การจัดการ",
      key: "action",
      render: (_: any, record: ScheduleInterface) => (
        <Space size="middle">
          <Button
            type="dashed"
            danger
            icon={<DeleteOutlined />}
            onClick={() => deleteScheduleById(record.ID)}
          >
            ลบ
          </Button>
        </Space>
      ),
    },
  ];

  // 📌 ดึงข้อมูลจาก API
  const getSchedules = async () => {
    if (!id) return;
    try {
      let res = await GetTrainerSchedulesByTrainer(Number(id));
      if (res.status === 200) {
        setSchedules(res.data);
        console.log("Schedules:", res.data);
      } else {
        setSchedules([]);
        messageApi.open({
          type: "error",
          content: res.data.error || "ไม่สามารถดึงข้อมูลได้",
        });
      }
    } catch (error: any) {
      messageApi.open({
        type: "error",
        content: error.message || "เกิดข้อผิดพลาดในการดึงข้อมูล",
      });
    }
  };

  // 📌 ลบข้อมูล
  const deleteScheduleById = async (scheduleId: number) => {
    try {
      let res = await DeleteTrainerScheduleById(scheduleId);
      if (res.status === 200) {
        messageApi.open({
          type: "success",
          content: "ลบตารางเวลาเรียบร้อยแล้ว",
        });
        await getSchedules();
      } else {
        messageApi.open({
          type: "error",
          content: res.data.error || "ไม่สามารถลบได้",
        });
      }
    } catch (error: any) {
      messageApi.open({
        type: "error",
        content: error.message || "เกิดข้อผิดพลาดในการลบ",
      });
    }
  };

  useEffect(() => {
    getSchedules();
  }, [id]); // ✅ reload เมื่อเปลี่ยน trainerId

  return (
    <div className="p-4 text-white">
      {contextHolder}
      <Card>
        <Row justify="space-between" align="middle">
          <Col>
            <h1 className="text-2xl font-bold">Trainer Schedule</h1>
          </Col>
          <Col>
            <Link to={`/trainer/${id}/schedule/addTrainerSchedule`}>
              <Button type="primary" icon={<PlusOutlined />}>
                เพิ่มตารางเทรน
              </Button>
            </Link>
          </Col>
        </Row>

        <Divider />

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

export default TrainerSchedule;
