import React, { useState, useEffect } from 'react';
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
import { useNavigate, useParams } from 'react-router-dom';
import { UpdatePersonalTrainingProgram, DeletePersonalTrainingProgram, GetPersonalTrainingProgramById } from '../../../../services/https';
import { ConfirmationDialog } from '../../../../components/ConfirmationDialog';
import { useNotification } from '../../../../components/Notification/NotificationProvider';

const { Title, Text } = Typography;

const PersonalEdit: React.FC = () => {
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const { id } = useParams<{ id: string }>();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [programData, setProgramData] = useState<any>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    visible: boolean;
  }>({ visible: false });

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
          showNotification({
            type: 'error',
            title: 'ไม่สามารถดึงข้อมูลได้',
            message: 'ไม่สามารถดึงข้อมูลโปรแกรมการฝึกได้',
            duration: 3000
          });
          navigate('/trainer/personal-training');
        }
      } catch (error) {
        console.error('Error fetching program data:', error);
        showNotification({
          type: 'error',
          title: 'เกิดข้อผิดพลาด',
          message: 'เกิดข้อผิดพลาดในการดึงข้อมูลโปรแกรมการฝึก',
          duration: 3000
        });
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
        showNotification({
          type: 'success',
          title: 'แก้ไขโปรแกรมการฝึกสำเร็จ',
          message: 'แก้ไขโปรแกรมการฝึกส่วนตัวเรียบร้อยแล้ว',
          duration: 2000
        });
        navigate('/trainer/personal-training');
      } else {
        showNotification({
          type: 'error',
          title: 'เกิดข้อผิดพลาด',
          message: 'เกิดข้อผิดพลาดในการแก้ไขโปรแกรมการฝึก',
          duration: 3000
        });
      }
    } catch (error) {
      showNotification({
        type: 'error',
        title: 'เกิดข้อผิดพลาด',
        message: 'เกิดข้อผิดพลาดในการแก้ไขโปรแกรมการฝึก',
        duration: 3000
      });
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    if (!id) return;
    setConfirmDialog({ visible: true });
  };

  const handleConfirmDelete = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      const response = await DeletePersonalTrainingProgram(parseInt(id));
      
      if (response.status === 200) {
        showNotification({
          type: 'success',
          title: 'ลบโปรแกรมการฝึกสำเร็จ',
          message: 'ลบโปรแกรมการฝึกส่วนตัวเรียบร้อยแล้ว',
          duration: 2000
        });
        navigate('/trainer/personal-training');
      } else {
        showNotification({
          type: 'error',
          title: 'ลบโปรแกรมการฝึกไม่สำเร็จ',
          message: 'ไม่สามารถลบโปรแกรมการฝึกได้',
          duration: 3000
        });
      }
    } catch (error) {
      showNotification({
        type: 'error',
        title: 'เกิดข้อผิดพลาด',
        message: 'เกิดข้อผิดพลาดในการลบโปรแกรมการฝึก',
        duration: 3000
      });
      console.error('Error:', error);
    } finally {
      setLoading(false);
      setConfirmDialog({ visible: false });
    }
  };

  const handleCancelDelete = () => {
    setConfirmDialog({ visible: false });
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

      <ConfirmationDialog
        visible={confirmDialog.visible}
        title="ยืนยันการลบ"
        message="คุณต้องการลบโปรแกรมการฝึกส่วนตัวนี้หรือไม่?"
        confirmText="ลบ"
        cancelText="ยกเลิก"
        type="danger"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
};

export default PersonalEdit;