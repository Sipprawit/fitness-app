import React from 'react';
import { Card, Typography, Space, Button } from 'antd';

import type { Package } from '../../interface/Package';


const { Title, Text } = Typography;

interface PackageDetailsProps {
  selectedPackage: Package | null;
  hasPackage: boolean;
  onSignup: () => void;
  onChangePackage: () => void;
}

export const PackageDetails: React.FC<PackageDetailsProps> = ({
  selectedPackage,
  hasPackage,
  onSignup,
  onChangePackage
}) => {
  console.log('PackageDetails - selectedPackage:', selectedPackage);
  if (!selectedPackage) {
    return (
      <Card style={{ textAlign: 'center' }}>
        <Text type="secondary" style={{ fontSize: 16, display: 'block', marginBottom: 4 }}>
          กรุณาเลือกประเภทแพ็คเกจและบริการเสริมก่อนสมัคร
        </Text>
        <Text type="secondary" style={{ fontSize: 12 }}>
          เพื่อดูรายละเอียดและราคา
        </Text>
      </Card>
    );
  }

  return (
    <Card>
      <Title level={4} style={{ color: '#111827' }}>
        รายละเอียดประเภทแพ็คเกจที่เลือก:
      </Title>

      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        {/* Package Name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span
            style={{
              width: 24,
              height: 24,
              backgroundColor: '#FEF3C7',
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
          <Text style={{ color: '#374151' }}>
            {selectedPackage.p_name}
          </Text>
        </div>

        {/* Package Type */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span
            style={{
              width: 24,
              height: 24,
              backgroundColor: '#FEF3C7',
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
          <Text style={{ color: '#374151' }}>{selectedPackage.type}</Text>
        </div>

        {/* Price */}
        <div
          style={{
            backgroundColor: '#F9FAFB',
            padding: 16,
            borderRadius: 8,
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: '#F0FDF4',
              padding: 12,
              borderRadius: 8,
              color: '#16A34A',
            }}
          >
            <Text strong>ราคารวม:</Text>
            <Text strong style={{ fontSize: '1.25rem' }}>
              ฿{selectedPackage.price.toLocaleString()}
            </Text>
          </div>
        </div>

        {/* Duration */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span
            style={{
              width: 24,
              height: 24,
              backgroundColor: '#E9D5FF',
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
          <Text style={{ color: '#374151' }}>
            {selectedPackage.type === 'รายเดือน' ? '30 วัน' : '365 วัน'}
          </Text>
        </div>

        {/* Benefits */}
        <div>
          <Space align="center" style={{ marginBottom: 8 }}>
            <span
              style={{
                width: 24,
                height: 24,
                backgroundColor: '#BFDBFE',
                borderRadius: '50%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              ✅
            </span>
            <Text strong style={{ color: '#374151' }}>
              สิทธิพิเศษ:
            </Text>
          </Space>
          <Space direction="vertical" size="small" style={{ marginLeft: 32, width: '100%' }}>
            <Text style={{ color: '#374151' }}>{selectedPackage.detail}</Text>
            {selectedPackage.detail_service && (
              <Text style={{ color: '#374151' }}>
                {selectedPackage.detail_service.detail}
              </Text>
            )}
          </Space>
        </div>

        {/* Action Buttons */}
        <Space size="middle" style={{ marginTop: 24, width: '100%' }}>
          <Button
            type="primary"
            block
            style={{ backgroundColor: '#C50000', color: 'white' }}
            onClick={onSignup}
          >
            [ สมัครแพ็คเกจนี้ ]
          </Button>
          {hasPackage && (
            <Button
              type="primary"
              block
              style={{ backgroundColor: '#C50000', color: 'white' }}
              onClick={onChangePackage}
            >
              [ เปลี่ยนแพ็คเกจ ]
            </Button>
          )}
        </Space>
      </Space>
    </Card>
  );
};

