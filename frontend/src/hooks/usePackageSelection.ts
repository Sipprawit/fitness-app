import { useState, useEffect } from 'react';
import type { Package, Service } from '../interface/Package';


export const usePackageSelection = (packages: Package[], services: Service[]) => {
  const [selectedPackageType, setSelectedPackageType] = useState<string>('');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);

  console.log('usePackageSelection - packages received:', packages);
  console.log('usePackageSelection - services received:', services);
  console.log('usePackageSelection - current state:', {
    selectedPackageType,
    selectedService,
    selectedPackage
  });

  // Search package data when package type and service are selected
  useEffect(() => {
    if (selectedPackageType && selectedService) {
      // ใช้ selectedService.id โดยตรง
      const serviceIndex = selectedService.id;
      
      console.log('Searching packages with:', {
        selectedPackageType,
        selectedService: selectedService.service,
        selectedServiceId: selectedService.id,
        serviceIndex: serviceIndex
      });
      
      console.log('Available services:', services.map(s => ({ id: s.id, service: s.service })));
      
      const matchingPackages = packages.filter(pkg => {
        const typeMatch = pkg.type === selectedPackageType;
        const serviceMatch = pkg.service_id === serviceIndex;
        
        console.log(`Package ${pkg.p_name}:`, {
          type: pkg.type,
          service_id: pkg.service_id,
          typeMatch,
          serviceMatch,
          finalMatch: typeMatch && serviceMatch
        });
        
        return typeMatch && serviceMatch;
      });
      
      console.log('Matching packages found:', matchingPackages);
      
      if (matchingPackages.length > 0) {
        setSelectedPackage(matchingPackages[0]);
      } else {
        setSelectedPackage(null);
      }
    } else {
      setSelectedPackage(null);
    }
  }, [selectedPackageType, selectedService, packages]);

  const handlePackageTypeChange = (type: string) => {
    setSelectedPackageType(type);
    setSelectedService(null);
    setSelectedPackage(null);
  };

  const getSelectedServiceName = () => {
    return selectedService ? selectedService.service : '';
  };

  const getSelectedPackageTypeName = () => {
    return selectedPackageType || '';
  };

  return {
    selectedPackageType,
    selectedService,
    selectedPackage,
    setSelectedService,
    handlePackageTypeChange,
    getSelectedServiceName,
    getSelectedPackageTypeName
  };
};

