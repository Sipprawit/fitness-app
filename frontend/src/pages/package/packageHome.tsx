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

import { CurrentPackageDetails } from '../../components/package/CurrentPackageDetails';
import { useNotification } from '../../components/Notification/NotificationProvider';
import { CUSTOMER_THEME, PAGE_STYLES } from '../../constants/theme';


const { Text } = Typography;

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

    const result = await handlePackageSignup(selectedPackage, showNotification);
    if (result.shouldRedirect) {
        navigate('/login');
    } else if (result.shouldReload) {
      setTimeout(() => window.location.reload(), 1000);
    }
  };

  const handleCancelPackage = async () => {

    const result = await handlePackageCancel(showNotification);

    if (result.shouldRedirect) {
        navigate('/login');
    } else if (result.shouldReload) {
      setTimeout(() => window.location.reload(), 1000);
    }
  };

  const handleChangePackage = async () => {

    const result = await handlePackageChange(selectedPackage, showNotification);

    if (result.shouldRedirect) {
        navigate('/login');
    } else if (result.shouldReload) {
      setTimeout(() => window.location.reload(), 1000);
    }
  };




  if (loading) {
    return (
      <div style={{ 
        ...PAGE_STYLES.container,
        justifyContent: 'center',
        color: CUSTOMER_THEME.primary,
        fontSize: '1.2rem',
      }}>
        <Text>กำลังโหลดข้อมูล...</Text>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        ...PAGE_STYLES.container,
        justifyContent: 'center',
        color: CUSTOMER_THEME.primary,
        fontSize: '1.2rem',
      }}>
        <Text style={{ color: CUSTOMER_THEME.primary }}>{error}</Text>
      </div>
    );
  }

  return (
    <div style={PAGE_STYLES.container}>
      <div style={PAGE_STYLES.header}>
        <h1 style={PAGE_STYLES.title}>แพ็คเกจสมาชิก</h1>
        <p style={PAGE_STYLES.subtitle}>
          เลือกแพ็คเกจที่เหมาะกับความต้องการของคุณ
        </p>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <PackageStatus
          hasPackage={userPackageStatus.hasPackage}
          packageName={userPackageStatus.packageName}
          packageType={userPackageStatus.packageType}
          onCancelPackage={handleCancelPackage}
        />
      </div>

      <Row gutter={[32, 16]} style={{ width: '100%', maxWidth: '1200px' }}>
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
          {userPackageStatus.hasPackage ? (
            <CurrentPackageDetails
              packageName={userPackageStatus.packageName}
              packageType={userPackageStatus.packageType}
              onCancelPackage={handleCancelPackage}
            />
          ) : (
            <PackageDetails
              selectedPackage={selectedPackage}
              hasPackage={userPackageStatus.hasPackage}
              onSignup={handleSignup}
              onChangePackage={handleChangePackage}
            />
          )}
        </Col>
      </Row>
    </div>
  );
};

export default PackageHome;
