import React, { useEffect, useState } from 'react';
import {
  Typography,
  Row,
  Col,
  Form,
  Input,
  Button,
  Space,
  Card
} from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { GetTrainerById, GetNutritionByUserID, CreatePersonalTrainingProgram } from '../../../../services/https';
import { useNotification } from '../../../../components/Notification/NotificationProvider';

const { Title, Text } = Typography;

const PersonalAdd: React.FC = () => {
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const location = useLocation();
  const [form] = Form.useForm();
  const [customerName, setCustomerName] = useState<string>('');
  const [trainerName, setTrainerName] = useState<string>('');
  const [customerGoal, setCustomerGoal] = useState<string>('');
  const [scheduleDate, setScheduleDate] = useState<string>('');
  const [scheduleStartTime, setScheduleStartTime] = useState<string>('');
  const [scheduleEndTime, setScheduleEndTime] = useState<string>('');

  // ดึงข้อมูลจาก location state และข้อมูลเทรนเนอร์ที่ล็อกอินอยู่
  useEffect(() => {
    console.log('Location state:', location.state);
    
    // ดึงข้อมูลลูกค้าจาก location state
    if (location.state && location.state.customerName) {
      console.log('Customer name from state:', location.state.customerName);
      setCustomerName(location.state.customerName);
    } else {
      console.log('No customer name in location state');
    }

    // ดึงข้อมูล schedule จาก location state
    if (location.state && location.state.scheduleDate) {
      console.log('Schedule date from state:', location.state.scheduleDate);
      setScheduleDate(location.state.scheduleDate);
    }
    if (location.state && location.state.scheduleStartTime) {
      console.log('Schedule start time from state:', location.state.scheduleStartTime);
      setScheduleStartTime(location.state.scheduleStartTime);
    }
    if (location.state && location.state.scheduleEndTime) {
      console.log('Schedule end time from state:', location.state.scheduleEndTime);
      setScheduleEndTime(location.state.scheduleEndTime);
    }

    // ดึงข้อมูลเทรนเนอร์ที่ล็อกอินอยู่จาก API
    const fetchTrainerData = async () => {
      try {
        const trainerId = localStorage.getItem('id');
        console.log('Trainer ID from localStorage:', trainerId);
        
        if (!trainerId) {
          console.log('No trainer ID in localStorage');
          setTrainerName('ไม่พบข้อมูลเทรนเนอร์');
          return;
        }

        const response = await GetTrainerById(Number(trainerId));
        console.log('Trainer API Response:', response);
        
        if (response.status === 200 && response.data) {
          const trainer = response.data;
          console.log('Trainer data from API:', trainer);
          
          // ตรวจสอบว่ามีฟิลด์ first_name/last_name
          let fullName = '';
          if (trainer.first_name && trainer.last_name) {
            fullName = `${trainer.first_name} ${trainer.last_name}`;
          } else if (trainer.first_name) {
            fullName = trainer.first_name;
          } else {
            fullName = 'ไม่พบข้อมูลเทรนเนอร์';
          }
          
          console.log('Trainer full name:', fullName);
          setTrainerName(fullName);
        } else {
          console.error('Failed to fetch trainer data:', response.data);
          setTrainerName('ไม่พบข้อมูลเทรนเนอร์');
        }
      } catch (error) {
        console.error('Error fetching trainer data:', error);
        setTrainerName('ไม่พบข้อมูลเทรนเนอร์');
      }
    };

    fetchTrainerData();

    // ดึงข้อมูล Goal จาก Nutrition
    const fetchCustomerGoal = async () => {
      try {
        console.log('Location state:', location.state);
        console.log('Customer ID from state:', location.state?.customerId);
        console.log('Customer ID type:', typeof location.state?.customerId);
        
        if (location.state && location.state.customerId) {
          console.log('Fetching goal for customer ID:', location.state.customerId);
          
          const response = await GetNutritionByUserID(location.state.customerId);
          console.log('Nutrition API Response:', response);
          
          if (response.status === 200 && response.data && response.data.data) {
            const nutrition = response.data.data;
            console.log('Nutrition data:', nutrition);
            
            if (nutrition.goal) {
              setCustomerGoal(nutrition.goal);
              console.log('Customer goal:', nutrition.goal);
            } else {
              setCustomerGoal('ไม่พบข้อมูลเป้าหมาย');
            }
          } else {
            console.log('No nutrition data found for customer');
            setCustomerGoal('ไม่พบข้อมูลเป้าหมาย');
          }
        } else {
          console.log('No customer ID in location state');
          setCustomerGoal('ไม่พบข้อมูลเป้าหมาย');
        }
      } catch (error) {
        console.error('Error fetching customer goal:', error);
        setCustomerGoal('ไม่พบข้อมูลเป้าหมาย');
      }
    };

    fetchCustomerGoal();
  }, [location.state]);

  // อัปเดต form values เมื่อ state เปลี่ยน
  useEffect(() => {
    if (customerName) {
      form.setFieldsValue({ name: customerName });
    }
    if (trainerName) {
      form.setFieldsValue({ trainer: trainerName });
    }
    if (customerGoal) {
      form.setFieldsValue({ goal: customerGoal });
    }
    if (scheduleDate) {
      form.setFieldsValue({ date: scheduleDate });
    }
    if (scheduleStartTime && scheduleEndTime) {
      form.setFieldsValue({ 
        time: `${new Date(scheduleStartTime).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })} - ${new Date(scheduleEndTime).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}`
      });
    }
  }, [customerName, trainerName, customerGoal, scheduleDate, scheduleStartTime, scheduleEndTime, form]);

  const onFinish = async (values: any) => {
    console.log('ข้อมูลที่ส่ง:', values);
    
    try {
      // ตรวจสอบข้อมูลที่จำเป็น
      const customerId = location.state?.customerId;
      const trainerId = parseInt(localStorage.getItem('id') || '0');
      
      console.log('Customer ID from state:', customerId);
      console.log('Trainer ID from localStorage:', trainerId);
      
      if (!customerId || customerId === 0) {
        showNotification({
          type: 'error',
          title: 'ไม่พบข้อมูลลูกค้า',
          message: 'กรุณาเลือกลูกค้าก่อน',
          duration: 3000
        });
        return;
      }
      
      if (!trainerId || trainerId === 0) {
        showNotification({
          type: 'error',
          title: 'ไม่พบข้อมูลเทรนเนอร์',
          message: 'กรุณาล็อกอินใหม่',
          duration: 3000
        });
        return;
      }
      
      // เตรียมข้อมูลสำหรับส่งไปยัง API
      const programData = {
        user_id: customerId,
        trainer_id: trainerId,
        format: values.trainingType,
        date: scheduleDate,
        time: values.time,
        goal_id: 1, // Default goal ID
      };

      console.log('Program data to send:', programData);

      const response = await CreatePersonalTrainingProgram(programData);
      console.log('Create program response:', response);

      if (response.status === 201 || response.status === 200) {
        showNotification({
          type: 'success',
          title: 'เพิ่มโปรแกรมการฝึกส่วนตัวสำเร็จ',
          message: 'เพิ่มโปรแกรมการฝึกส่วนตัวเรียบร้อยแล้ว',
          duration: 2000
        });
        navigate('/trainer/personal-training');
      } else {
        showNotification({
          type: 'error',
          title: 'เกิดข้อผิดพลาด',
          message: 'เกิดข้อผิดพลาดในการเพิ่มโปรแกรมการฝึกส่วนตัว',
          duration: 3000
        });
        console.error('Error response:', response.data);
      }
    } catch (error) {
      showNotification({
        type: 'error',
        title: 'เกิดข้อผิดพลาด',
        message: 'เกิดข้อผิดพลาดในการเพิ่มโปรแกรมการฝึกส่วนตัว',
        duration: 3000
      });
      console.error('Error:', error);
    }
  };

  const onCancel = () => {
    navigate('/trainer/personal-training');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        margin: 0,
        backgroundColor: '#f4f6f8ff',
        overflowX: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
      }}
    >
      <main
        style={{
          flex: 1,
          width: '100%',
          padding: '16px',
          overflowY: 'auto',
          boxSizing: 'border-box',
          maxWidth: '100%',
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <Title level={2} style={{ color: '#010000ff', margin: 0 }}>
            เพิ่มโปรแกรมการฝึกส่วนตัว
          </Title>
          <Text type="secondary" style={{ fontSize: 16 }}>
            เพิ่มข้อมูลโปรแกรมการฝึกส่วนตัวใหม่
          </Text>
        </div>

        {/* Form */}
        <Card>
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            style={{ maxWidth: 800 }}
          >
            <Row gutter={[24, 16]}>
              {/* ชื่อ */}
              <Col xs={24} sm={12}>
                <Form.Item
                  label="ชื่อ"
                  name="name"
                  rules={[{ required: true, message: 'กรุณาใส่ชื่อ' }]}
                  initialValue={customerName}
                >
                  <Input
                    placeholder="ใส่ชื่อ"
                    style={{ width: '100%' }}
                    value={customerName}
                    disabled={true}
                  />
                </Form.Item>
              </Col>

              {/* เทรนเนอร์ */}
              <Col xs={24} sm={12}>
                <Form.Item
                  label="เทรนเนอร์"
                  name="trainer"
                  rules={[{ required: true, message: 'กรุณาเลือกเทรนเนอร์' }]}
                  initialValue={trainerName}
                >
                  <Input
                    placeholder="เทรนเนอร์ที่ล็อกอินอยู่"
                    style={{ width: '100%' }}
                    disabled={true}
                    value={trainerName}
                  />
                </Form.Item>
              </Col>

              {/* วันที่ */}
              <Col xs={24} sm={12}>
                <Form.Item
                  label="วันที่"
                  name="date"
                  rules={[{ required: true, message: 'กรุณาเลือกวันที่' }]}
                  initialValue={scheduleDate}
                >
                  <Input
                    placeholder="วันที่จากตารางเวลา"
                    style={{ width: '100%' }}
                    value={scheduleDate ? new Date(scheduleDate).toLocaleDateString('th-TH') : ''}
                    disabled={true}
                  />
                </Form.Item>
              </Col>

              {/* เวลา */}
              <Col xs={24} sm={12}>
                <Form.Item
                  label="เวลา"
                  name="time"
                  rules={[{ required: true, message: 'กรุณาเลือกเวลา' }]}
                  initialValue={scheduleStartTime && scheduleEndTime ? `${new Date(scheduleStartTime).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })} - ${new Date(scheduleEndTime).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}` : ''}
                >
                  <Input
                    placeholder="เวลาจากตารางเวลา"
                    style={{ width: '100%' }}
                    value={scheduleStartTime && scheduleEndTime ? `${new Date(scheduleStartTime).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })} - ${new Date(scheduleEndTime).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}` : ''}
                    disabled={true}
                  />
                </Form.Item>
              </Col>

              {/* รูปแบบการฝึก */}
              <Col xs={24} sm={12}>
                <Form.Item
                  label="รูปแบบการฝึก"
                  name="trainingType"
                  rules={[{ required: true, message: 'กรุณาใส่รูปแบบการฝึก' }]}
                >
                  <Input
                    placeholder="ใส่รูปแบบการฝึก"
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Col>

              {/* เป้าหมาย */}
              <Col xs={24} sm={12}>
                <Form.Item
                  label="เป้าหมาย"
                  name="goal"
                  rules={[{ required: true, message: 'กรุณาใส่เป้าหมาย' }]}
                  initialValue={customerGoal}
                >
                  <Input
                    placeholder="เป้าหมายจากข้อมูลโภชนาการ"
                    style={{ width: '100%' }}
                    value={customerGoal}
                    disabled={true}
                  />
                </Form.Item>
              </Col>
            </Row>

            {/* Action Buttons */}
            <Row justify="end" style={{ marginTop: 32 }}>
              <Space>
                <Button
                  size="large"
                  onClick={onCancel}
                  style={{
                    backgroundColor: '#f5f5f5',
                    color: '#666',
                    border: '1px solid #d9d9d9'
                  }}
                >
                  ยกเลิก
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  style={{
                    backgroundColor: '#C50000',
                    color: 'white',
                    border: 'none'
                  }}
                >
                  เพิ่ม
                </Button>
              </Space>
            </Row>
          </Form>
        </Card>
      </main>
    </div>
  );
};

export default PersonalAdd;
