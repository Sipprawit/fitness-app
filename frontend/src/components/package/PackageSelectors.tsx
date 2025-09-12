import React from 'react';
import { Button, Dropdown, Menu, Space, Typography } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import type { Service } from '../../interface/Package';

const { Text } = Typography;

interface PackageSelectorsProps {
  packageTypes: string[];
  packages: any[];
  services: Service[];
  selectedPackageType: string;
  selectedService: Service | null;
  showPackageTypeDropdown: boolean;
  showServiceDropdown: boolean;
  onPackageTypeChange: (type: string) => void;
  onServiceChange: (service: Service | null) => void;
  onPackageTypeDropdownChange: (visible: boolean) => void;
  onServiceDropdownChange: (visible: boolean) => void;
  getSelectedPackageTypeName: () => string;
  getSelectedServiceName: () => string;
}

export const PackageSelectors: React.FC<PackageSelectorsProps> = ({
  packageTypes,
  packages,
  services,
  selectedPackageType,
  selectedService,
  showPackageTypeDropdown,
  showServiceDropdown,
  onPackageTypeChange,
  onServiceChange,
  onPackageTypeDropdownChange,
  onServiceDropdownChange,
  getSelectedPackageTypeName,
  getSelectedServiceName
}) => {
  console.log('PackageSelectors - services:', services);
  console.log('PackageSelectors - selectedService:', selectedService);
  services.forEach((service, index) => {
    console.log(`Service ${index}:`, { id: service.id, service: service.service });
  });
  
  const packageTypeMenu = (
    <Menu
      selectedKeys={selectedPackageType ? [selectedPackageType] : []}
      onClick={({ key }) => {
        onPackageTypeChange(key);
        onPackageTypeDropdownChange(false);
      }}
      items={packageTypes.map((type) => ({
        key: type,
        label: (
          <Space direction="vertical" size={0}>
            <Text strong style={{ color: '#292a31ff' }}>{type}</Text>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {packages.filter(pkg => pkg.type === type).length} แพ็คเกจ
            </Text>
          </Space>
        ),
        icon: selectedPackageType === type ? <span style={{ color: 'green' }}>✓</span> : null,
      }))}
    />
  );

  const serviceMenu = (
    <Menu
      selectedKeys={selectedService ? [`service-${selectedService.id}`] : []}
      onClick={({ key }) => {
        console.log('Service menu clicked:', key);
        const keyValue = key.replace('service-', '');
        const serviceId = parseInt(keyValue);
        console.log('Parsed serviceId:', serviceId);
        const selectedService = services.find(service => service.id === serviceId);
        console.log('Found service:', selectedService);
        if (selectedService) {
          onServiceChange(selectedService);
        }
        onServiceDropdownChange(false);
      }}
      items={services.map((service, index) => {
        const item = {
          key: `service-${service.id || index}`,
          label: (
            <Space direction="vertical" size={0}>
              <Text strong style={{ color: '#111827' }}>{service.service}</Text>
              <Text type="secondary" style={{ fontSize: 12 }}>{service.detail}</Text>
            </Space>
          ),
          icon: selectedService?.id === service.id ? <span style={{ color: 'green' }}>✓</span> : null,
        };
        console.log('Service item:', item);
        return item;
      })}
    />
  );

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      {/* Package Type Selector */}
      <Dropdown
        overlay={packageTypeMenu}
        visible={showPackageTypeDropdown}
        onVisibleChange={onPackageTypeDropdownChange}
        trigger={['click']}
        placement="bottomLeft"
        disabled={packageTypes.length === 0}
      >
        <Button 
          type="primary" 
          block 
          style={{ 
            backgroundColor: packageTypes.length === 0 ? '#ccc' : '#C50000',
            color: 'white' 
          }}
        >
          <Space>
            {packageTypes.length === 0 
              ? 'ไม่มีประเภทแพ็คเกจ' 
              : selectedPackageType ? getSelectedPackageTypeName() : 'เลือกประเภทแพ็คเกจ'
            }
            <DownOutlined />
          </Space>
        </Button>
      </Dropdown>

      {/* Service Selector */}
      <Dropdown
        overlay={serviceMenu}
        visible={showServiceDropdown}
        onVisibleChange={onServiceDropdownChange}
        trigger={['click']}
        placement="bottomLeft"
        disabled={!selectedPackageType}
      >
        <Button 
          type="primary" 
          block 
          style={{ 
            backgroundColor: !selectedPackageType ? '#ccc' : '#C50000',
            color: 'white' 
          }}
        >
          <Space>
            {!selectedPackageType
              ? 'กรุณาเลือกประเภทแพ็คเกจก่อน'
              : selectedService ? getSelectedServiceName() : 'เลือกบริการเสริม'
            }
            <DownOutlined />
          </Space>
        </Button>
      </Dropdown>
    </Space>
  );
};

