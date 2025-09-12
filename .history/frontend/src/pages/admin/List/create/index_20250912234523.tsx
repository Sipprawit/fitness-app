import {
  Space,
  Button,
  Col,
  Row,
  Divider,
  Form,
  Input,
  Card,
  DatePicker,
  InputNumber,
  Select,
} from "antd";
import { useState, useEffect } from "react";
import { PlusOutlined } from "@ant-design/icons";
import type { GenderInterface } from "../../../../interface/Gender";
import { GetGender, CreateUser } from "../../../../services/https";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../../../../components/Notification/NotificationProvider";


function CustomerCreate() {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const [gender, setGender] = useState<GenderInterface[]>([]);

  // ดึงข้อมูลเพศ
  const onGetGender = async () => {
    const res = await GetGender();
    if (res.status === 200) {
      setGender(res.data);
    } else {
      messageApi.open({ type: "error", content: "ไม่พบข้อมูลเพศ" });
      setTimeout(() => navigate("/admin/List"), 2000);
    }
  };

  // Submit form
  const onFinish = async (values: any) => {

    // แปลงค่า field ให้ตรง backend (ใช้ field names ที่ backend ต้องการ)
    const payload = {
      first_name: values.first_name,
      last_name: values.last_name,
      email: values.email,
      password: values.password,
      birthday: values.birthday?.format("YYYY-MM-DD") || "",
      age: values.age,
      gender_id: values.gender_id,
      actor: "admin", // กำหนดบทบาท
    };

    console.log("Payload being sent to API:", payload);
    const res = await CreateUser(payload);
    console.log("API Response:", res);

    if (res.status === 200 || res.status === 201) {
      messageApi.open({ type: "success", content: res.data.message });
      navigate("/admin/List");
    } else {
      messageApi.open({ type: "error", content: res.data.error || "เกิดข้อผิดพลาด" });
    }
  };

  useEffect(() => {
    onGetGender();
  }, []);

  return (
    <div>
      {contextHolder}
      <Card>
        <h2>เพิ่มข้อมูล ผู้ดูแลระบบ</h2>
        <Divider />

        <Form
          name="basic"
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Row gutter={[16, 0]}>
            <Col xs={24} sm={24} md={24} lg={24} xl={12}>
              <Form.Item
                label="ชื่อจริง"
                name="first_name"
                rules={[{ required: true, message: "กรุณากรอกชื่อ !" }]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={24} lg={24} xl={12}>
              <Form.Item
                label="นามสกุล"
                name="last_name"
                rules={[{ required: true, message: "กรุณากรอกนามสกุล !" }]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={24} lg={24} xl={12}>
              <Form.Item
                label="อีเมล"
                name="email"
                rules={[
                  { type: "email", message: "รูปแบบอีเมลไม่ถูกต้อง !" },
                  { required: true, message: "กรุณากรอกอีเมล !" },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={24} lg={24} xl={12}>
              <Form.Item
                label="รหัสผ่าน"
                name="password"
                rules={[{ required: true, message: "กรุณากรอกรหัสผ่าน !" }]}
              >
                <Input.Password />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={24} lg={24} xl={12}>
              <Form.Item
                label="วัน/เดือน/ปี เกิด"
                name="birthday"
                rules={[
                  { required: true, message: "กรุณาเลือกวัน/เดือน/ปี เกิด !" },
                ]}
              >
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={24} lg={24} xl={12}>
              <Form.Item
                label="อายุ"
                name="age"
                rules={[{ required: true, message: "กรุณากรอกอายุ !" }]}
              >
                <InputNumber min={0} max={99} style={{ width: "100%" }} />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={24} lg={24} xl={12}>
              <Form.Item
                label="เพศ"
                name="gender_id"
                rules={[{ required: true, message: "กรุณาเลือกเพศ !" }]}
              >
                <Select defaultValue="" style={{ width: "100%" }}>
                  {gender?.map((item) => (
                    <Select.Option key={item.ID} value={item.ID}>
                      {item.gender}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row justify="end">
            <Col style={{ marginTop: "40px" }}>
              <Form.Item>
                <Space>
                  <Button
                    htmlType="button"
                    style={{ marginRight: "10px" }}
                    onClick={() => navigate("/admin/List")}
                  >
                    ยกเลิก
                  </Button>

                  <Button type="primary" htmlType="submit" icon={<PlusOutlined />}  >
                    ยืนยัน
                  </Button>
                </Space>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
    </div>
  );
}

export default CustomerCreate;
