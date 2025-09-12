import React, { useState, useEffect } from 'react';
import { Typography, Table, Card, Tag, Space, message, Spin } from 'antd';
import { CalendarOutlined, UserOutlined, ClockCircleOutlined, AimOutlined } from '@ant-design/icons';
import { GetPersonalTrainingProgramsByCustomerID } from '../../services/https/index';
import { CUSTOMER_THEME, PAGE_STYLES, CARD_STYLES } from '../../constants/theme';

const { Title, Text } = Typography;

interface PersonalTrainProgram {
  ID: number;
  user_id: number;
  user?: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
  };
  goal?: {
    id: number;
    goal: string;
    user_id: number;
    date: string;
    total_calories_per_day: number;
    note: string;
  };
  format: string;
  date: string;
  trainer_id: number;
  trainer_name?: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
  };
  time: string;
  created_at?: string;
  updated_at?: string;
}

export const TrainingPrograms: React.FC = () => {
  const [programs, setPrograms] = useState<PersonalTrainProgram[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrograms = async () => {
      const userId = localStorage.getItem('id');
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await GetPersonalTrainingProgramsByCustomerID(parseInt(userId));
        setPrograms(response.data || []);
      } catch (error) {
        console.error('Error fetching training programs:', error);
        message.error('ไม่สามารถโหลดข้อมูลโปรแกรมฝึกได้');
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return timeString;
  };

  const columns = [
    {
      title: 'โปรแกรมฝึก',
      dataIndex: 'format',
      key: 'format',
      render: (format: string) => (
        <Space>
          <AimOutlined style={{ color: CUSTOMER_THEME.primary }} />
          <Text strong style={{ color: CUSTOMER_THEME.textPrimary }}>{format}</Text>
        </Space>
      ),
    },
    {
      title: 'เทรนเนอร์',
      dataIndex: ['trainer_name'],
      key: 'trainer',
      render: (trainer: any) => (
        <Space>
          <UserOutlined style={{ color: CUSTOMER_THEME.primary }} />
          <Text style={{ color: CUSTOMER_THEME.textPrimary }}>
            {trainer ? `${trainer.first_name} ${trainer.last_name}` : 'ไม่ระบุ'}
          </Text>
        </Space>
      ),
    },
    {
      title: 'วันที่',
      dataIndex: 'date',
      key: 'date',
      render: (date: string) => (
        <Space>
          <CalendarOutlined style={{ color: CUSTOMER_THEME.primary }} />
          <Text style={{ color: CUSTOMER_THEME.textPrimary }}>{formatDate(date)}</Text>
        </Space>
      ),
    },
    {
      title: 'เวลา',
      dataIndex: 'time',
      key: 'time',
      render: (time: string) => (
        <Space>
          <ClockCircleOutlined style={{ color: CUSTOMER_THEME.primary }} />
          <Text style={{ color: CUSTOMER_THEME.textPrimary }}>{formatTime(time)}</Text>
        </Space>
      ),
    },
    {
      title: 'เป้าหมาย',
      dataIndex: ['goal'],
      key: 'goal',
      render: (goal: any) => (
        <Tag 
          color={goal ? CUSTOMER_THEME.primary : CUSTOMER_THEME.textLight}
          style={{ 
            backgroundColor: goal ? CUSTOMER_THEME.primary : CUSTOMER_THEME.borderLight,
            color: goal ? 'white' : CUSTOMER_THEME.textSecondary,
            border: 'none'
          }}
        >
          {goal ? goal.goal : 'ไม่ระบุ'}
        </Tag>
      ),
    },
  ];

  if (loading) {
    return (
      <div style={{ 
        ...PAGE_STYLES.container,
        justifyContent: 'center',
        color: CUSTOMER_THEME.primary,
        fontSize: '1.2rem',
      }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={PAGE_STYLES.container}>
      <div style={PAGE_STYLES.header}>
        <h1 style={PAGE_STYLES.title}>โปรแกรมฝึกส่วนตัว</h1>
        <p style={PAGE_STYLES.subtitle}>
          ตารางโปรแกรมฝึกที่เทรนเนอร์ได้สร้างให้คุณ
        </p>
      </div>

      <Card style={CARD_STYLES.default}>
          {programs.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '48px 24px',
              color: CUSTOMER_THEME.textLight
            }}>
              <AimOutlined style={{ fontSize: '48px', marginBottom: '16px', color: CUSTOMER_THEME.primary }} />
              <Title level={4} style={{ color: CUSTOMER_THEME.textSecondary }}>
                ยังไม่มีโปรแกรมฝึก
              </Title>
              <Text style={{ color: CUSTOMER_THEME.textLight }}>
                เทรนเนอร์ยังไม่ได้สร้างโปรแกรมฝึกให้คุณ
              </Text>
            </div>
          ) : (
            <Table
              columns={columns}
              dataSource={programs}
              rowKey="ID"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} จาก ${total} รายการ`,
              }}
              style={{
                backgroundColor: CUSTOMER_THEME.cardBackgroundSolid,
              }}
            />
          )}
        </Card>
    </div>
  );
};

export default TrainingPrograms;
