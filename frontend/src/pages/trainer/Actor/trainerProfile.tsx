import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { GetTrainers, DeleteTrainerById } from "../../../services/https";
import type { TrainerInterface } from "../../../interface/ITrainer";
import { Space, Table, Button, Col, Row, Divider, message, Card } from "antd";
import { PlusOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";

function ProfileTrainer() {
  const navigate = useNavigate();
  const [trainers, setTrainers] = useState<TrainerInterface[]>([]);
  const [messageApi, contextHolder] = message.useMessage();

  const columns: ColumnsType<TrainerInterface> = [
    {
      title: "ลำดับ",
      dataIndex: "ID",
      key: "id",
    },
    {
      title: "ชื่อ",
      dataIndex: "first_name",
      key: "first_name",
    },
    {
      title: "นามสกุล",
      dataIndex: "last_name",
      key: "last_name",
    },
    {
      title: "อีเมล",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "เบอร์โทรศัพท์",
      dataIndex: "tel",
      key: "tel",
    },
    {
      title: "เพศ",
      key: "gender",
      render: (record) => <>{record?.gender?.gender}</>,
    },
    {
      title: "ทักษะ",
      dataIndex: "skill",
      key: "skill",
    },
    {
      title: "การจัดการ",
      key: "action",
      render: (record) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => navigate(`/trainer/edit/${record.ID}`)}
          >
            แก้ไข
          </Button>
          <Button
            type="dashed"
            danger
            icon={<DeleteOutlined />}
            onClick={() => deleteTrainerById(record.ID)}
          >
            ลบ
          </Button>
        </Space>
      ),
    },
  ];

  const deleteTrainerById = async (id: number) => {
    let res = await DeleteTrainerById(id);

    if (res.status === 200) {
      messageApi.open({
        type: "success",
        content: "ลบข้อมูลเทรนเนอร์สำเร็จ",
      });
      await getTrainers();
    } else {
      messageApi.open({
        type: "error",
        content: res.data.error,
      });
    }
  };

  const getTrainers = async () => {
    let res = await GetTrainers();

    if (res.status === 200) {
      setTrainers(res.data);
    } else {
      setTrainers([]);
      messageApi.open({
        type: "error",
        content: res.data.error,
      });
    }
  };

  useEffect(() => {
    getTrainers();
  }, []);

  return (
    <>
      {contextHolder}
      <Card>
        <Row align="middle">
          <Col span={12}>
            <h2>จัดการข้อมูลเทรนเนอร์</h2>
          </Col>
          <Col span={12} style={{ textAlign: "end" }}>
            <Link to="/trainer/profile/addTrainer">
              <Button type="primary" icon={<PlusOutlined />}>
                เพิ่มข้อมูลเทรนเนอร์
              </Button>
            </Link>
          </Col>
        </Row>

        <Divider />

        <div style={{ marginTop: 20 }}>
          <Table
            rowKey="ID"
            columns={columns}
            dataSource={trainers}
            style={{ width: "100%", overflowX: "auto" }}
            onRow={(record) => {
              return {
                onClick: (event) => {
                  // ป้องกันการกดซ้ำกับปุ่ม action
                  const target = event.target as HTMLElement;
                  if (
                    target.closest("button") || // ถ้ากดปุ่ม (แก้ไข/ลบ)
                    target.closest(".ant-btn") // กันกรณีปุ่ม antd อื่นๆ
                  ) {
                    return;
                  }
                  //ไปยังหน้าจัดตารางของเทรนเนอร์
                  navigate(`/trainer/${record.ID}/schedule`);
                },
              };
            }}
          />
        </div>
      </Card>
    </>
  );
}

export default ProfileTrainer;
