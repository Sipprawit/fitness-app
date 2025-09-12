import React from 'react';
import { Card, Typography, Space, Button } from 'antd';

const { Title, Text } = Typography;

interface CurrentPackageDetailsProps {
  packageName?: string;
  packageType?: string;
  onCancelPackage: () => void;
}

export const CurrentPackageDetails: React.FC<CurrentPackageDetailsProps> = ({
  packageName,
  packageType,
  onCancelPackage
}) => {
  return (
    <Card 
      style={{ 
        backgroundColor: '#F0FDF4',
        border: '2px solid #16A34A',
        borderRadius: '12px'
      }}
    >
      <Title level={4} style={{ color: '#16A34A', marginBottom: 16 }}>
        📦 แพ็คเกจที่สมัครแล้ว
      </Title>

      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        {/* Package Name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span
            style={{
              width: 24,
              height: 24,
              backgroundColor: '#DCFCE7',
              borderRadius: '50%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            🐻
          </span>
          <Text strong style={{ color: '#374151' }}>
            ชื่อแพ็คเกจ:
          </Text>
          <Text style={{ color: '#16A34A', fontWeight: '600' }}>
            {packageName || 'ไม่ระบุ'}
          </Text>
        </div>

        {/* Package Type */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span
            style={{
              width: 24,
              height: 24,
              backgroundColor: '#DCFCE7',
              borderRadius: '50%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            🏋️
          </span>
          <Text strong style={{ color: '#374151' }}>
            ประเภทแพ็คเกจ:
          </Text>
          <Text style={{ color: '#16A34A', fontWeight: '600' }}>
            {packageType || 'ไม่ระบุ'}
          </Text>
        </div>

        {/* Duration */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span
            style={{
              width: 24,
              height: 24,
              backgroundColor: '#DCFCE7',
              borderRadius: '50%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            ⏰
          </span>
          <Text strong style={{ color: '#374151' }}>
            ระยะเวลา:
          </Text>
          <Text style={{ color: '#16A34A', fontWeight: '600' }}>
            {packageType === 'รายเดือน' ? '30 วัน' : packageType === 'รายปี' ? '365 วัน' : 'ไม่ระบุ'}
          </Text>
        </div>

        {/* Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span
            style={{
              width: 24,
              height: 24,
              backgroundColor: '#DCFCE7',
              borderRadius: '50%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            ✅
          </span>
          <Text strong style={{ color: '#374151' }}>
            สถานะ:
          </Text>
          <Text style={{ color: '#16A34A', fontWeight: '600' }}>
            ใช้งานอยู่
          </Text>
        </div>

        {/* Cancel Button */}
        <div style={{ marginTop: 16, textAlign: 'center' }}>
          <Button
            type="primary"
            danger
            size="large"
            style={{
              backgroundColor: '#ff4d4f',
              borderColor: '#ff4d4f',
              borderRadius: '8px',
              fontWeight: '600',
              height: '40px',
              padding: '0 24px'
            }}
            onClick={onCancelPackage}
          >
            ยกเลิกการสมัครแพ็คเกจ
          </Button>
        </div>
      </Space>
    </Card>
  );
};
