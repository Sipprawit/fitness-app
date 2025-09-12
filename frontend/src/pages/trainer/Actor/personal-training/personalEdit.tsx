import React, { useState, useEffect } from 'react';
import {
  Typography,
  Row,
  Col,
  Form,
  Input,
  Button,
  Space,
  Card,
  message,
  Modal
} from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { UpdatePersonalTrainingProgram, DeletePersonalTrainingProgram, GetPersonalTrainingProgramById } from '../../../../services/https';

const { Title, Text } = Typography;

const PersonalEdit: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [programData, setProgramData] = useState<any>(null);

  useEffect(() => {
    const fetchProgramData = async () => {
      if (!id) return;
      
      try {
        const response = await GetPersonalTrainingProgramById(parseInt(id));
        if (response.status === 200 && response.data) {
          const program = response.data;
          console.log('Program data from API:', program);
          setProgramData(program);
          form.setFieldsValue({
            format: program.format,
            time: program.time,
          });
        } else {
          message.error('ไม่สามารถดึงข้อมูลโปรแกรมการฝึกได้');
          navigate('/trainer/personal-training');
        }
      } catch (error) {
        console.error('Error fetching program data:', error);
        message.error('เกิดข้อผิดพลาดในการดึงข้อมูลโปรแกรมการฝึก');
        navigate('/trainer/personal-training');
      }
    };

    fetchProgramData();
  }, [id, form, navigate]);

  const onFinish = async (values: any) => {
    if (!id) return;
    
    setLoading(true);
    try {
      const updateData = {
        format: values.format,
        time: values.time,
      };

      const response = await UpdatePersonalTrainingProgram(parseInt(id), updateData);
      
      if (response.status === 200) {
        message.success('แก้ไขโปรแกรมการฝึกสำเร็จ');
        navigate('/trainer/personal-training');
      } else {
        message.error('เกิดข้อผิดพลาดในการแก้ไขโปรแกรมการฝึก');
      }
    } catch (error) {
      message.error('เกิดข้อผิดพลาดในการแก้ไขโปรแกรมการฝึก');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    if (!id) return;

    Modal.confirm({
      title: 'ยืนยันการลบ',
      content: 'คุณต้องการลบโปรแกรมการฝึกส่วนตัวนี้หรือไม่?',
      okText: 'ลบ',
      okType: 'danger',
      cancelText: 'ยกเลิก',
      onOk: async () => {
        setLoading(true);
        try {
          const response = await DeletePersonalTrainingProgram(parseInt(id));
          
          if (response.status === 200) {
            message.success('ลบโปรแกรมการฝึกสำเร็จ');
            navigate('/trainer/personal-training');
          } else {
            message.error('เกิดข้อผิดพลาดในการลบโปรแกรมการฝึก');
          }
        } catch (error) {
          message.error('เกิดข้อผิดพลาดในการลบโปรแกรมการฝึก');
          console.error('Error:', error);
        } finally {
          setLoading(false);
        }
      },
    });
  };

  const onCancel = () => {
    navigate('/trainer/personal-training');
  };

  if (!programData) {
    return (
      <div style={{ padding: '20px', backgroundColor: '#f4f6f8ff', minHeight: '100vh' }}>
        <Title level={2} style={{ color: '#010000ff' }}>
          แก้ไขโปรแกรมการฝึกส่วนตัว
        </Title>
        <Text>กำลังโหลดข้อมูล...</Text>
      </div>
    );
  }

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
            แก้ไขโปรแกรมการฝึกส่วนตัว
          </Title>
          <Text type="secondary" style={{ fontSize: 16 }}>
            แก้ไขข้อมูลโปรแกรมการฝึกส่วนตัว
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
              {/* รูปแบบการฝึก */}
              <Col xs={24} sm={12}>
                <Form.Item
                  label="รูปแบบการฝึก"
                  name="format"
                  rules={[{ required: true, message: 'กรุณาใส่รูปแบบการฝึก' }]}
                >
                  <Input
                    placeholder="ใส่รูปแบบการฝึก"
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Col>

              {/* เวลา */}
              <Col xs={24} sm={12}>
                <Form.Item
                  label="เวลา"
                  name="time"
                  rules={[{ required: true, message: 'กรุณาใส่เวลา' }]}
                >
                  <Input
                    placeholder="ใส่เวลา"
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Col>
            </Row>

            {/* Action Buttons */}
            <Row justify="space-between" style={{ marginTop: 32 }}>
              <Space>
                <Button
                  type="primary"
                  danger
                  size="large"
                  onClick={handleDelete}
                  loading={loading}
                  style={{
                    backgroundColor: '#ff4d4f',
                    color: 'white',
                    border: 'none'
                  }}
                >
                  ลบโปรแกรม
                </Button>
              </Space>
              
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
                  loading={loading}
                  style={{
                    backgroundColor: '#C50000',
                    color: 'white',
                    border: 'none'
                  }}
                >
                  บันทึกการแก้ไข
                </Button>
              </Space>
            </Row>
          </Form>
        </Card>
      </main>
    </div>
  );
};

export default PersonalEdit;