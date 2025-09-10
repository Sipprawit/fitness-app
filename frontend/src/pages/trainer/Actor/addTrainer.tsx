import {
  Space,
  Button,
  Col,
  Row,
  Divider,
  Form,
  Input,
  Card,
  message,
  Select,
  Upload,
} from "antd";
import ImgCrop from "antd-img-crop";
import { useState, useEffect } from "react";
import type { UploadFile } from "antd/es/upload/interface";
import { PlusOutlined } from "@ant-design/icons";
import { GetGender, CreateTrainer, UploadImage } from "../../../services/https"; // แก้ไข import function
import type { TrainerInterface } from "../../../interface/ITrainer"; // สร้าง interface ใหม่สำหรับ Trainer
import type { GenderInterface } from "../../../interface/Gender";
import { useNavigate, Link } from "react-router-dom";

function TrainerCreate() {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const [gender, setGender] = useState<GenderInterface[]>([]);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const onGetGender = async () => {
    let res = await GetGender();
    if (res.status === 200) {
      setGender(res.data);
    } else {
      messageApi.open({
        type: "error",
        content: "ไม่พบข้อมูลเพศ",
      });
      setTimeout(() => {
        navigate("/trainer");
      }, 2000);
    }
  };

  const onFinish = async (values: TrainerInterface) => {
    console.log("Submit data", values);
    try {
      // ดึงไฟล์รูปภาพจาก values ที่ได้จาก Form
      // ตอนนี้ values.profile_image จะเป็น array ของ UploadFile
      const fileListFromForm = values.profile_image as UploadFile[];
      if (!fileListFromForm || fileListFromForm.length === 0) {
        messageApi.error("กรุณาเลือกไฟล์รูปโปรไฟล์!");
        return;
      }

      const file = fileListFromForm[0].originFileObj as File;
      if (!file) {
        messageApi.error("เกิดข้อผิดพลาดในการอ่านไฟล์");
        return;
      }

      // อัปโหลดรูปภาพก่อน และรับ URL กลับมา
      const uploadRes = await UploadImage(file);

      if (uploadRes.status !== 200) {
        messageApi.error("เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ");
        return;
      }

      // นำ URL ที่ได้มาไปใช้ในการสร้าง Trainer
      const payload = { ...values, profile_image: uploadRes.data.url };

      let res = await CreateTrainer(payload);

      if (res.status === 201) {
        messageApi.success("เพิ่มข้อมูลเทรนเนอร์สำเร็จ");
        form.resetFields();
        setFileList([]); // Reset fileList state ด้วย
        navigate("/trainer/profile");
      } else {
        messageApi.error("ไม่สามารถสร้างข้อมูลเทรนเนอร์ได้");
      }
    } catch (error: any) {
      messageApi.error(error.response?.data?.error || "เกิดข้อผิดพลาด");
    }
  };

  useEffect(() => {
    onGetGender();
    return () => {};
  }, []);

  return (
    <div>
      {contextHolder}
      <Card>
        <h2>เพิ่มข้อมูลเทรนเนอร์</h2>
        <Divider />
        <Form
          form={form}
          name="trainer_create_form"
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Row gutter={[16, 0]}>
            <Col xs={24} sm={24} md={12}>
              <Form.Item
                label="ชื่อจริง"
                name="first_name"
                rules={[{ required: true, message: "กรุณากรอกชื่อจริง !" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12}>
              <Form.Item
                label="นามสกุล"
                name="last_name"
                rules={[{ required: true, message: "กรุณากรอกนามสกุล !" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12}>
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
            <Col xs={24} sm={24} md={12}>
              <Form.Item
                label="เบอร์โทรศัพท์"
                name="tel"
                rules={[
                  { required: true, message: "กรุณากรอกเบอร์โทรศัพท์ !" },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12}>
              <Form.Item
                label="ทักษะ/ความเชี่ยวชาญ"
                name="skill"
                rules={[{ required: true, message: "กรุณากรอกทักษะ !" }]}
              >
                <Input.TextArea rows={4} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12}>
              <Form.Item
                label="เพศ"
                name="gender_id"
                rules={[{ required: true, message: "กรุณาเลือกเพศ !" }]}
              >
                <Select placeholder="เลือกเพศ">
                  {gender?.map((item) => (
                    <Select.Option key={item.ID} value={item.ID}>
                      {item.gender}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            {/* ปุ่ม Upload รูป */}
            <Col xs={24} sm={24} md={12}>
              <Form.Item
                label="รูปโปรไฟล์"
                name="profile_image" // ✅ กำหนด name ให้กับ Form.Item
                rules={[
                  { required: true, message: "กรุณาเลือกไฟล์รูปโปรไฟล์!" },
                ]}
                valuePropName="fileList"
              >
                <ImgCrop>
                  <Upload
                    listType="picture-card"
                    beforeUpload={() => false} // ไม่อัปโหลดอัตโนมัติ
                    fileList={fileList}
                    onChange={({ fileList }) => {
                      setFileList(fileList);
                      form.setFieldsValue({ profile_image: fileList });
                      console.log("Upload onChange fileList:", fileList);
                    }}
                    maxCount={1}
                    showUploadList={{
                      showPreviewIcon: false, // ✅ ซ่อนปุ่มดูรูปภาพ
                      showRemoveIcon: true, // ยังคงให้มีปุ่มลบ
                      showDownloadIcon: false, // และสามารถซ่อนปุ่มดาวน์โหลดได้
                    }}
                  >
                    {fileList.length >= 1 ? null : (
                      <div>
                        <PlusOutlined />
                        <div>Upload</div>
                      </div>
                    )}
                  </Upload>
                </ImgCrop>
              </Form.Item>
            </Col>
          </Row>

          <Row justify="end">
            <Col style={{ marginTop: "40px" }}>
              <Form.Item>
                <Space>
                  <Link to="/trainer/profile">
                    <Button htmlType="button" style={{ marginRight: "10px" }}>
                      ยกเลิก
                    </Button>
                  </Link>

                  <Button
                    type="primary"
                    htmlType="submit"
                    icon={<PlusOutlined />}
                  >
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

export default TrainerCreate;
