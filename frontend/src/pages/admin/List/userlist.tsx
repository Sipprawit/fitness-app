import { useState, useEffect } from "react";
import { Space, Table, Button, Col, Row, Divider, message } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { GetUsers, DeleteUsersById } from "../../../services/https";
import type { UsersInterface } from "../../../interface/IUser";
import { Link, useNavigate } from "react-router-dom";
import dayjs from "dayjs";

function Customers() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<UsersInterface[]>([]);
  const [messageApi, contextHolder] = message.useMessage();
  const myId = localStorage.getItem("id");

  const getUsers = async () => {
    try {
      const res = await GetUsers();
      if (res.status === 200) {
        setUsers(res.data);
      } else {
        setUsers([]);
        messageApi.open({ type: "error", content: "ไม่สามารถดึงข้อมูลผู้ใช้ได้" });
      }
    } catch (error) {
      setUsers([]);
      messageApi.open({ type: "error", content: "เกิดข้อผิดพลาดในการเชื่อมต่อ" });
    }
  };

  const deleteUserById = async (id: number | undefined) => {
    if (!id) return;
    try {
      const res = await DeleteUsersById(id.toString());
      if (res.status === 200) {
        messageApi.open({ type: "success", content: res.data.message });
        await getUsers();
      } else {
        messageApi.open({ type: "error", content: res.data.error });
      }
    } catch {
      messageApi.open({ type: "error", content: "เกิดข้อผิดพลาดในการลบข้อมูล" });
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  const columns: ColumnsType<UsersInterface> = [
    {
      title: "",
      render: (_, record) =>
        myId === record?.ID?.toString() ? null : (
          <Button
            type="dashed"
            danger
            icon={<DeleteOutlined />}
            onClick={() => deleteUserById(record.ID)}
          />
        ),
    },
    {
      title: "ลำดับ",
      render: (_, __, index) => index + 1, // ใช้ index ของ array แทน ID
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
      title: "วัน/เดือน/ปี เกิด",
      key: "birthday",
      render: (record) => (record.birthDay ? dayjs(record.birthDay).format("DD/MM/YYYY") : "-"),
    },
    {
      title: "อายุ",
      dataIndex: "age",
      key: "age",
    },
    {
      title: "เพศ",
      key: "gender",
      render: (record) => record?.gender?.gender || "-",
    },
    {
      title: "",
      render: (record) => (
        <Button
          type="primary"
          onClick={() => navigate(`/customer/edit/${record.ID}`)}
        >
          แก้ไขข้อมูล
        </Button>
      ),
    },
  ];

  return (
    <>
      {contextHolder}
      <Row>
        <Col span={12}>
          <h2>Profile</h2>
        </Col>
        <Col span={12} style={{ textAlign: "end", alignSelf: "center" }}>
          <Space>
            <Link to="/customer/create">
              <Button type="primary" icon={<PlusOutlined />}>
                สร้างข้อมูล
              </Button>
            </Link>
          </Space>
        </Col>
      </Row>

      <Divider />

      <div style={{ marginTop: 20 }}>
        <Table
          rowKey="ID"
          columns={columns}
          dataSource={users}
          style={{ width: "100%", overflow: "scroll" }}
        />
      </div>
    </>
  );
}

export default Customers;
