import {
  Space,
  Button,
  Col,
  Row,
  Divider,
  Form,
  Card,
  Input,
  DatePicker,
  TimePicker,
} from "antd";
import { useState, useEffect } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { CreateTrainerSchedule, GetTrainerById } from "../../../services/https";
import type { TrainerInterface } from "../../../interface/ITrainer";
import { useNotification } from "../../../components/Notification/NotificationProvider";
import dayjs, { Dayjs } from "dayjs";

function AddTrainerSchedule() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { showNotification } = useNotification();
  const [form] = Form.useForm();
  const [trainer, setTrainer] = useState<TrainerInterface | null>(null);

  // ฟังก์ชันสำหรับดึงข้อมูลเทรนเนอร์และกำหนดค่าในฟอร์ม
  const onGetTrainerById = async (trainerId: number) => {
    console.log("AddTrainerSchedule - Getting trainer data for ID:", trainerId);
    let res = await GetTrainerById(trainerId);
    console.log("AddTrainerSchedule - GetTrainerById response:", res);
    if (res.status === 200) {
      setTrainer(res.data);
      form.setFieldsValue({
        trainer_id: res.data.first_name,
      });
      console.log("AddTrainerSchedule - Trainer data set successfully");
    } else {
      console.log("AddTrainerSchedule - Failed to get trainer data");
      showNotification({
        type: "error",
        title: "เกิดข้อผิดพลาด",
        message: "ไม่พบข้อมูลเทรนเนอร์",
        duration: 3000
      });
      setTimeout(() => {
        navigate("/trainer");
      }, 2000);
    }
  };

  // ฟังก์ชันสำหรับจัดการการส่งฟอร์ม
  const onFinish = async (values: any) => {
    console.log("AddTrainerSchedule - Form values:", values);
    console.log("AddTrainerSchedule - Trainer data:", trainer);
    
    if (!values.available_date || !values.start_time || !values.end_time) {
      showNotification({
        type: "error",
        title: "เกิดข้อผิดพลาด",
        message: "กรุณากรอกข้อมูลให้ครบถ้วน!",
        duration: 3000
      });
      return;
    }

    const startDateTime = values.available_date.hour(
      values.start_time.hour()
    ).minute(values.start_time.minute());
    const endDateTime = values.available_date.hour(values.end_time.hour()).minute(
      values.end_time.minute()
    );

    const formattedData = {
      ...values,
      available_date: startDateTime.format(),
      start_time: startDateTime.format(),
      end_time: endDateTime.format(),
      TrainerID: trainer?.ID as number,
    };

    console.log("AddTrainerSchedule - Formatted data:", formattedData);
    let res = await CreateTrainerSchedule(formattedData);
    console.log("AddTrainerSchedule - API Response:", res);

    if (res.status === 201) {
      showNotification({
        type: "success",
        title: "สำเร็จ",
        message: res.data.message,
        duration: 3000
      });
      form.resetFields();
      setTimeout(() => {
        navigate("/trainer");
      }, 1000);
    } else {
      showNotification({
        type: "error",
        title: "เกิดข้อผิดพลาด",
        message: res.data.error,
        duration: 3000
      });
    }
  };

  // ฟังก์ชันสำหรับ disabled วันที่ในอดีต
  const disabledDate = (current: Dayjs) => {
    return current && current < dayjs().startOf("day");
  };

  // ดึงข้อมูลเมื่อ component ถูก render ครั้งแรก
  useEffect(() => {
    console.log("AddTrainerSchedule - Component mounted");
    console.log("AddTrainerSchedule - ID from URL:", id);
    const trainerId = Number(id);
    console.log("AddTrainerSchedule - Parsed trainerId:", trainerId);
    if (!isNaN(trainerId) && trainerId > 0) {
      console.log("AddTrainerSchedule - Calling onGetTrainerById");
      onGetTrainerById(trainerId);
    } else {
      console.log("AddTrainerSchedule - Invalid trainerId, redirecting to trainer");
      messageApi.open({
        type: "error",
        content: "ไม่พบ TrainerID ใน URL! กำลังกลับสู่หน้าหลัก...",
      });
      setTimeout(() => {
        navigate("/trainer");
      }, 2000);
    }
  }, [id]);

  console.log("AddTrainerSchedule - Rendering component");
  
  return (
    <div>
      {contextHolder}
      <Card>
        <h2>เพิ่มตารางเวลาเทรนเนอร์</h2>
        <Divider />
        <Form
          form={form}
          name="trainer_schedule_create_form"
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Row gutter={[16, 0]}>
            <Col xs={24} sm={24} md={12}>
              <Form.Item label="เทรนเนอร์" name="trainer_id">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12}>
              <Form.Item
                label="วันที่ว่าง"
                name="available_date"
                rules={[
                  {
                    required: true,
                    message: "กรุณาเลือกวันที่ว่าง !",
                  },
                ]}
              >
                <DatePicker
                  format="YYYY-MM-DD"
                  style={{ width: "100%" }}
                  disabledDate={disabledDate}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12}>
              <Form.Item
                label="เวลาเริ่ม"
                name="start_time"
                rules={[
                  {
                    required: true,
                    message: "กรุณาเลือกเวลาเริ่ม !",
                  },
                ]}
              >
                <TimePicker format="HH:mm" style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12}>
              <Form.Item
                label="เวลาสิ้นสุด"
                name="end_time"
                rules={[
                  {
                    required: true,
                    message: "กรุณาเลือกเวลาสิ้นสุด !",
                  },
                ]}
              >
                <TimePicker format="HH:mm" style={{ width: "100%" }} />
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
                    onClick={() => navigate("/trainer")}
                  >
                    ยกเลิก
                  </Button>
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

export default AddTrainerSchedule;
