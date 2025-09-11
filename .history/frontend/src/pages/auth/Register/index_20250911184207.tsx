import { Button, Card, Form, Input, message, Flex, Row, Col, InputNumber, DatePicker, Select } from "antd";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GetGender, CreateUser } from "../../../services/https";
import type { UsersInterface } from "../../../interface/IUser";
import type { GenderInterface } from "../../../interface/Gender";
import logo from "../../../assets/gymmy1.png";
import { useNotification } from "../../../components/Notification/NotificationProvider";

function SignUpPages() {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const [gender, setGender] = useState<GenderInterface[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const onGetGender = async () => {
    let res = await GetGender();
    if (res.status == 200) setGender(res.data);
    else {
      messageApi.error("ไม่พบข้อมูลเพศ");
      setTimeout(() => navigate("/customer"), 2000);
    }
  };

  const onFinish = async (values: UsersInterface) => {
    if (submitting) return; // ป้องกันกดซ้ำ
    setSubmitting(true);
    const payload = {
      first_name: values.first_name,
      last_name: values.last_name,
      email: values.email,
      password: values.password,
      age: Number(values.age || 0),
      birthday: (values as any).birthday?.format
        ? (values as any).birthday.format("YYYY-MM-DD")
        : (values as any).birthday,
      gender_id: Number((values as any).gender_id),
    };

    try {
      let res = await CreateUser(payload as any);
      if (res?.status == 201) {
        messageApi.success(res.data.message || "สมัครสมาชิกสำเร็จ");
        setTimeout(() => navigate("/login"), 1200);
      } else {
        const errMsg = res?.data?.error || "สมัครสมาชิกไม่สำเร็จ";
        messageApi.error(errMsg);
      }
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    onGetGender();
  }, []);

  return (
    <>
      {contextHolder}
      <Flex justify="center" align="center" className="login">
        <Card className="card-login" style={{ width: 600 }}>
          <Row justify="center">
            <Col xs={24} lg={10}>
              <img alt="logo" src={logo} className="images-logo" />
            </Col>

            <Col xs={24}>
              <h2 className="header">Sign Up</h2>
              <Form name="basic" layout="vertical" onFinish={onFinish} autoComplete="off">
                <Row gutter={[16, 0]}>
                  <Col xs={24}>
                    <Form.Item label="ชื่อจริง" name="first_name" rules={[{ required: true, message: "กรุณากรอกชื่อ !" }]}>
                      <Input />
                    </Form.Item>
                  </Col>

                  <Col xs={24}>
                    <Form.Item label="นามสกุล" name="last_name" rules={[{ required: true, message: "กรุณากรอกนามสกุล !" }]}>
                      <Input />
                    </Form.Item>
                  </Col>

                  <Col xs={24}>
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

                  <Col xs={24} lg={12}>
                    <Form.Item label="รหัสผ่าน" name="password" rules={[{ required: true, message: "กรุณากรอกรหัสผ่าน !" }]}>
                      <Input.Password />
                    </Form.Item>
                  </Col>

                  <Col xs={24} lg={12}>
                    <Form.Item label="วัน/เดือน/ปี เกิด" name="birthday" rules={[{ required: true, message: "กรุณาเลือกวันเกิด !" }]}>
                      <DatePicker style={{ width: "100%" }} />
                    </Form.Item>
                  </Col>

                  <Col xs={24} lg={12}>
                    <Form.Item label="อายุ" name="age" rules={[{ required: true, message: "กรุณากรอกอายุ !" }]}>
                      <InputNumber min={0} max={99} style={{ width: "100%" }} />
                    </Form.Item>
                  </Col>

                  <Col xs={24} lg={12}>
                    <Form.Item label="เพศ" name="gender_id" rules={[{ required: true, message: "กรุณาเลือกเพศ !" }]}>
                      <Select style={{ width: "100%" }}>
                        {gender?.map((item) => (
                          <Select.Option key={item?.ID} value={item?.ID}>
                            {item?.gender}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>

                  <Col xs={24}>
                    <Form.Item >
                      <Button type="primary" htmlType="submit" loading={submitting} disabled={submitting} style={{ marginBottom: 20 }}>
                        Sign up
                      </Button>
                      <span style={{ marginTop: 20 }}> {/* เพิ่มระยะห่างตรงนี้ */}
                        Or <a onClick={() => navigate("/")}>signin now!</a>
                      </span>
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </Col>
          </Row>
        </Card>
      </Flex>
    </>
  );
}

export default SignUpPages;
