import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Col, Row, Divider, Form, Input, Card, Select, Image } from "antd";
import { EditOutlined } from "@ant-design/icons";
import type { TrainerInterface } from "../../../interface/ITrainer";
import type { GenderInterface } from "../../../interface/Gender";
import { GetGender, GetTrainerById } from "../../../services/https";
import { useNotification } from "../../../components/Notification/NotificationProvider";

function ProfileTrainer() {
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const [gender, setGender] = useState<GenderInterface[]>([]);
  const [form] = Form.useForm();
  const [trainer, setTrainer] = useState<TrainerInterface | null>(null);
  const baseURL = "http://localhost:8000";

  const onGetGender = async () => {
    let res = await GetGender();
    if (res.status === 200) {
      setGender(res.data);
    }
  };

  const loadMe = async () => {
    const idStr = localStorage.getItem("id");
    const id = idStr ? Number(idStr) : NaN;
    if (!id || Number.isNaN(id)) {
      messageApi.error("ไม่พบรหัสผู้ใช้ที่กำลังล็อกอิน");
      return;
    }
    const res = await GetTrainerById(id);
    if (res.status === 200) {
      const data = res.data as TrainerInterface & { gender?: GenderInterface };
      setTrainer(data);
      form.setFieldsValue({
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        tel: data.tel,
        skill: data.skill,
        gender_id: (data as any)?.gender?.ID,
      });
    } else {
      messageApi.error(res.data?.error || "ไม่สามารถดึงข้อมูลเทรนเนอร์ได้");
    }
  };

  useEffect(() => {
    onGetGender();
    loadMe();
  }, []);

  const profileImageUrl = trainer?.profile_image
    ? `${baseURL}${typeof trainer.profile_image === "string" ? trainer.profile_image : ""}`
    : undefined;

  return (
    <>
      {contextHolder}
      <Card>
        <Row align="middle" justify="space-between">
          <Col>
            <h2>โปรไฟล์เทรนเนอร์</h2>
          </Col>
          {trainer?.ID && (
            <Col>
              <Button 
                type="primary" 
                icon={<EditOutlined />} 
                onClick={() => navigate(`/trainer/edit/${trainer.ID}`)}
                style={{ backgroundColor: '#e50000', borderColor: '#e50000' }}
              >
                แก้ไขโปรไฟล์
              </Button>
            </Col>
          )}
        </Row>

        <Divider />

        <Row gutter={[16, 0]}>
          <Col xs={24} sm={24} md={8} lg={6}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 12 }}>
              <Image
                src={profileImageUrl}
                alt="profile"
                width={260}
                style={{ borderRadius: 12, objectFit: "cover" }}
                fallback="https://via.placeholder.com/260x260?text=No+Image"
                preview={!!profileImageUrl}
              />
            </div>
          </Col>

          <Col xs={24} sm={24} md={16} lg={18}>
            <Form form={form} layout="vertical" disabled>
              <Row gutter={[16, 0]}>
                <Col xs={24} md={12}>
                  <Form.Item label="ชื่อจริง" name="first_name">
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item label="นามสกุล" name="last_name">
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item label="อีเมล" name="email">
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item label="เบอร์โทรศัพท์" name="tel">
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item label="ทักษะ/ความเชี่ยวชาญ" name="skill">
                    <Input.TextArea rows={4} />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item label="เพศ" name="gender_id">
                    <Select placeholder="เลือกเพศ">
                      {gender?.map((g) => (
                        <Select.Option key={g.ID} value={g.ID}>
                          {g.gender}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>
      </Card>
    </>
  );
}

export default ProfileTrainer;
