import React from 'react';

interface PackageStatusProps {
  hasPackage: boolean;
  packageName?: string;
  packageType?: string;
}

export const PackageStatus: React.FC<PackageStatusProps> = ({
  hasPackage,
  packageName,
  packageType
}) => {
  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'flex-end'
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
    </div>
  );
};

