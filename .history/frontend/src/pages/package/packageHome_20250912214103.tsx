import React, { useState, useEffect } from 'react';
import { Typography, Row, Col } from 'antd';
import { useNavigate } from 'react-router-dom';
import { usePackageData } from '../../hooks/usePackageData';
import { useUserPackageStatus } from '../../hooks/useUserPackageStatus';
import { usePackageSelection } from '../../hooks/usePackageSelection';
import { handlePackageSignup, handlePackageCancel, handlePackageChange } from '../../utils/packageUtils';
import { PackageStatus } from '../../components/package/PackageStatus';
import { PackageSelectors } from '../../components/package/PackageSelectors';
import { PackageDetails } from '../../components/package/PackageDetails';
import { useNotification } from '../../components/Notification/NotificationProvider';

const { Title, Text } = Typography;

export const PackageHome: React.FC = () => {
  const [showPackageTypeDropdown, setShowPackageTypeDropdown] = useState(false);
  const [showServiceDropdown, setShowServiceDropdown] = useState(false);

  const navigate = useNavigate();
  const { packages, services, loading, error } = usePackageData();
  const userPackageStatus = useUserPackageStatus();
  const { showNotification } = useNotification();

  console.log('PackageHome - data:', { packages, services, loading, error });
  const {
    selectedPackageType,
    selectedService,
    selectedPackage,
    setSelectedService,
    handlePackageTypeChange,
    getSelectedServiceName,
    getSelectedPackageTypeName
  } = usePackageSelection(packages, services);

  // Set page state on component mount
  useEffect(() => {
    localStorage.setItem("page", "package");
  }, []);
  
  // Get unique package types
  const packageTypes = [...new Set(packages.map(pkg => pkg.type))];
  
  // Event handlers
  const handleSignup = async () => {
    const result = await handlePackageSignup(selectedPackage);
    if (result.shouldRedirect) {
        navigate('/login');
    } else if (result.shouldReload) {
      setTimeout(() => window.location.reload(), 1000);
    }
  };

  const handleCancelPackage = async () => {
    const result = await handlePackageCancel();
    if (result.shouldRedirect) {
        navigate('/login');
    } else if (result.shouldReload) {
      setTimeout(() => window.location.reload(), 1000);
    }
  };

  const handleChangePackage = async () => {
    const result = await handlePackageChange(selectedPackage);
    if (result.shouldRedirect) {
        navigate('/login');
    } else if (result.shouldReload) {
      setTimeout(() => window.location.reload(), 1000);
    }
  };




  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        backgroundColor: '#f4f6f8ff'
      }}>
        <Text>กำลังโหลดข้อมูล...</Text>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        backgroundColor: '#f4f6f8ff'
      }}>
        <Text type="danger">{error}</Text>
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
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-start', 
          marginBottom: 48 
        }}>
          <div style={{ textAlign: 'left' }}>
            <Title level={2} style={{ color: '#010000ff', margin: 0 }}>
            แพ็คเกจสมาชิก
          </Title>
          </div>
          <PackageStatus
            hasPackage={userPackageStatus.hasPackage}
            packageName={userPackageStatus.packageName}
            packageType={userPackageStatus.packageType}
            onCancelPackage={handleCancelPackage}
          />
        </div>

        <Row gutter={[32, 16]}>
          <Col xs={24} lg={8} xl={6}>
            <PackageSelectors
              packageTypes={packageTypes}
              packages={packages}
              services={services}
              selectedPackageType={selectedPackageType}
              selectedService={selectedService}
              showPackageTypeDropdown={showPackageTypeDropdown}
              showServiceDropdown={showServiceDropdown}
              onPackageTypeChange={handlePackageTypeChange}
              onServiceChange={(service) => {
                console.log('onServiceChange called with:', service);
                setSelectedService(service);
              }}
              onPackageTypeDropdownChange={setShowPackageTypeDropdown}
              onServiceDropdownChange={setShowServiceDropdown}
              getSelectedPackageTypeName={getSelectedPackageTypeName}
              getSelectedServiceName={getSelectedServiceName}
            />
          </Col>

          <Col xs={24} lg={16} xl={14}>
            <PackageDetails
              selectedPackage={selectedPackage}
              hasPackage={userPackageStatus.hasPackage}
              onSignup={handleSignup}
              onChangePackage={handleChangePackage}
            />
          </Col>
        </Row>
      </main>
    </div>
  );
};

export default PackageHome;
