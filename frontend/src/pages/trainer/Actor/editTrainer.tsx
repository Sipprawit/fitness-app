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
import ImgCrop from "antd-img-crop"; // ✅ เพิ่ม import ImgCrop
import { useState, useEffect } from "react";
import type { UploadFile } from "antd/es/upload/interface";
import { PlusOutlined } from "@ant-design/icons";
import {
  GetGender,
  GetTrainerById,
  UpdateTrainerById,
  UploadImage,
} from "../../../services/https"; // ✅ เพิ่ม import UploadImage
import type { TrainerInterface } from "../../../interface/ITrainer";
import type { GenderInterface } from "../../../interface/Gender";
import { useNavigate, useParams } from "react-router-dom";

function TrainerEdit() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: any }>();
  const [messageApi, contextHolder] = message.useMessage();
  const actor = localStorage.getItem("actor");
  const [gender, setGender] = useState<GenderInterface[]>([]);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const baseURL = "http://localhost:8000";

  // ฟังก์ชันสำหรับดึงข้อมูลเพศ
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
        if (actor === "admin") {
          navigate("/admin/List?view=trainers");
        } else {
          navigate("/trainer/profile");
        }
      }, 2000);
    }
  };

  // ✅ ฟังก์ชันสำหรับดึงข้อมูลเทรนเนอร์ตาม ID
  const getTrainerById = async (id: string) => {
    let res = await GetTrainerById(Number(id));
    if (res.status === 200) {
      const trainerData = res.data;
      form.setFieldsValue({
        first_name: trainerData.first_name,
        last_name: trainerData.last_name,
        email: trainerData.email,
        tel: trainerData.tel,
        skill: trainerData.skill,
        gender_id: trainerData.gender?.ID,
      });

      if (trainerData.profile_image) {
        const fileName = trainerData.profile_image.split("/").pop() ?? "file";
        setFileList([
          {
            uid: "-1",
            name: fileName,
            status: "done",
            url: `${baseURL}${trainerData.profile_image}`, // ✅ ต่อ baseURL
          },
        ]);
      } else {
        setFileList([]);
      }

      console.log(trainerData.profile_image);
    } else {
      messageApi.open({
        type: "error",
        content: "ไม่พบข้อมูลเทรนเนอร์",
      });
      setTimeout(() => {
        if (actor === "admin") {
          navigate("/admin/List?view=trainers");
        } else {
          navigate("/trainer/profile");
        }
      }, 2000);
    }
  };

  const onFinish = async (values: TrainerInterface) => {
    try {
      const payload: TrainerInterface = { ...values };

      // 1. ตรวจสอบว่ามีการอัปโหลดรูปภาพใหม่หรือไม่
      if (fileList.length > 0 && fileList[0].originFileObj) {
        // ✅ มีการเลือกรูปภาพใหม่: อัปโหลดและใช้ URL ใหม่
        const file = fileList[0].originFileObj as File;
        const uploadRes = await UploadImage(file);

        if (uploadRes.status !== 200) {
          messageApi.error("เกิดข้อผิดพลาดในการอัปโหลดรูปภาพใหม่");
          return;
        }
        payload.profile_image = uploadRes.data.url;
      } else if (fileList.length === 0) {
        // ✅ ผู้ใช้ลบรูปภาพเดิมออก: ตั้งค่า profile_image เป็นค่าว่าง
        payload.profile_image = "";
      }

      // 2. ส่ง payload ไปอัปเดตข้อมูล
      let res = await UpdateTrainerById(id, payload);

      if (res.status === 200) {
        messageApi.open({
          type: "success",
          content: "แก้ไขข้อมูลเทรนเนอร์สำเร็จ!",
        });
        setTimeout(() => {
          if (actor === "admin") {
            navigate("/admin/List?view=trainers");
          } else {
            navigate("/trainer/profile");
          }
        }, 2000);
      } else {
        messageApi.open({
          type: "error",
          content: res.data.error,
        });
      }
    } catch (error: any) {
      messageApi.error(error.response?.data?.error || "เกิดข้อผิดพลาด");
    }
  };

  // เรียกฟังก์ชันเมื่อคอมโพเนนต์โหลดครั้งแรก
  useEffect(() => {
    onGetGender();
    getTrainerById(id);
    return () => {};
  }, [id]);

  return (
    <div>
      {contextHolder}
      <Card>
        <h2>แก้ไขข้อมูลเทรนเนอร์</h2>
        <Divider />
        <Form
          form={form}
          name="trainer_edit_form"
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

            {/* ✅ เพิ่มส่วนสำหรับ Upload รูปภาพ */}
            <Col xs={24} sm={24} md={12}>
              <Form.Item
                label="รูปโปรไฟล์"
                name="profile_image"
                valuePropName="fileList"
                getValueFromEvent={(e) => {
                  if (Array.isArray(e)) {
                    return e;
                  }
                  return e?.fileList;
                }}
              >
                <ImgCrop>
                  <Upload
                    listType="picture-card"
                    beforeUpload={() => false}
                    fileList={fileList}
                    onChange={({ fileList }) => {
                      setFileList(fileList);
                    }}
                    maxCount={1}
                    showUploadList={{
                      showPreviewIcon: false,
                      showRemoveIcon: true,
                      showDownloadIcon: false,
                    }}
                    accept=".png,.jpg,.jpeg,.webp"
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
                  <Button 
                    htmlType="button" 
                    style={{ marginRight: "10px" }}
                    onClick={() => {
                      if (actor === "admin") {
                        navigate("/admin/List?view=trainers");
                      } else {
                        navigate("/trainer/profile");
                      }
                    }}
                  >
                    ยกเลิก
                  </Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    icon={<PlusOutlined />}
                  >
                    บันทึกการแก้ไข
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

export default TrainerEdit;
