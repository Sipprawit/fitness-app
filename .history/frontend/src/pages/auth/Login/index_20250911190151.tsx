// src/pages/Auth/SignInPages.tsx
import { Button, Card, Form, Input, message, Flex, Row, Col } from "antd";
import { useNavigate } from "react-router-dom";
import { SignIn } from "../../../services/https";
import type { SignInInterface } from "../../../interface/SignIn";
import logo from "../../../assets/gymmy1.png";

function SignInPages() {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  const onFinish = async (values: SignInInterface) => {
    // ส่งข้อมูล email และ password ไปยัง Backend API
    let res = await SignIn(values);

    if (res.status === 200) {
      // ตรวจสอบว่า Backend ส่งข้อมูล actor กลับมาด้วยหรือไม่
      const actor = res.data.actor; // สมมติว่า Backend ส่ง field 'actor' กลับมาใน response
      
      if (!actor) {
        messageApi.error("ไม่พบบทบาทผู้ใช้งาน, กรุณาติดต่อผู้ดูแลระบบ");
        return;
      }
      
      messageApi.success("เข้าสู่ระบบสำเร็จ");
      localStorage.setItem("isLogin", "true");
      localStorage.setItem("page", "dashboard");
      localStorage.setItem("token_type", res.data.token_type);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("id", res.data.id);
      localStorage.setItem("actor", actor); // บันทึกประเภทผู้ใช้งานที่ได้จาก Backend

      // กำหนดเส้นทาง (route) ตามบทบาทที่ได้รับจาก Backend
      let redirectPath = "/";
      if (actor === 'trainer') {
        redirectPath = "/trainer";
      } else if (actor === 'admin') {
        redirectPath = "/admin/schedule";
      }

      setTimeout(() => {
        navigate(redirectPath);
      }, 2000);
    } else {
      messageApi.error(res.data.error);
    }
  };

  return (
    <>
      {contextHolder}
      <Flex justify="center" align="center" className="login">
        <Card className="card-login" style={{ width: 500 }}>
          <Row justify="center" align="middle" style={{ height: "400px" }}>
            <Col>
              <img
                alt="logo"
                src={logo}
                className="images-logo"
                style={{ width: "80%", display: "block", margin: "0 auto" }}
              />
            </Col>

            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
              <Form
                name="basic"
                onFinish={onFinish}
                autoComplete="off"
                layout="vertical"
              >
                <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                    { required: true, message: "กรุณากรอกอีเมล!" },
                  ]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  label="Password"
                  name="password"
                  rules={[
                    { required: true, message: "กรุณากรอกรหัสผ่าน!" },
                  ]}
                >
                  <Input.Password />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="login-form-button"
                    style={{ marginBottom: 20 }}
                  >
                    เข้าสู่ระบบ
                  </Button>
                  หรือ <a onClick={() => navigate("/signup")}>สมัครสมาชิกเลย!</a>
                </Form.Item>
              </Form>
            </Col>
          </Row>
        </Card>
      </Flex>
    </>
  );
}

export default SignInPages;
