import React from 'react';
import { Button } from 'antd';

interface PackageStatusProps {
  hasPackage: boolean;
  packageName?: string;
  packageType?: string;
  onCancelPackage: () => void;
}

export const PackageStatus: React.FC<PackageStatusProps> = ({
  hasPackage,
  packageName,
  packageType,
  onCancelPackage
}) => {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'flex-end', 
      gap: 12 
    }}>
      <div style={{ 
        padding: '8px 16px', 
        borderRadius: '20px', 
        fontSize: '14px',
        fontWeight: '600',
        backgroundColor: hasPackage ? '#FFF1F0' : '#FFF7E6',
        color: hasPackage ? '#C50000' : '#D46B08',
        border: `2px solid ${hasPackage ? '#FFCCC7' : '#FFE7BA'}`,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        maxWidth: '300px',
        textAlign: 'center'
      }}>
        {hasPackage 
          ? `แพ็คเกจปัจจุบัน: ${packageName} (${packageType})`
          : 'ยังไม่ทำการสมัครแพ็คเกจสมาชิก'
        }
      </div>
      {hasPackage && (
        <Button
          type="primary"
          danger
          size="small"
          style={{
            backgroundColor: '#ff4d4f',
            borderColor: '#ff4d4f',
            borderRadius: '16px',
            fontWeight: '500',
            fontSize: '12px',
            height: '32px',
            padding: '0 16px'
          }}
          onClick={onCancelPackage}
        >
          ยกเลิกการสมัครแพ็คเกจ
        </Button>
      )}
    </div>
  );
};

