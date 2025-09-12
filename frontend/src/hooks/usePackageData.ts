import { useState, useEffect } from 'react';
import { message } from 'antd';
import { GetServices, GetPackages } from '../services/https';
import type { Package, Service } from '../interface/Package';

export const usePackageData = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [packagesRes, servicesRes] = await Promise.all([
          GetPackages(),
          GetServices()
        ]);
        
        console.log('Packages response:', packagesRes);
        console.log('Services response:', servicesRes);
        
        if (packagesRes && packagesRes.status === 200) {
          setPackages(packagesRes.data.data);
        } else {
          console.error('Failed to load packages:', packagesRes);
          setError('ไม่สามารถโหลดข้อมูลแพ็คเกจได้');
        }
        
        if (servicesRes && servicesRes.status === 200) {
          setServices(servicesRes.data.data);
        } else {
          console.error('Failed to load services:', servicesRes);
          setError('ไม่สามารถโหลดข้อมูลบริการได้');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('เกิดข้อผิดพลาดในการดึงข้อมูล');
        message.error('เกิดข้อผิดพลาดในการดึงข้อมูล');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  return { packages, services, loading, error };
};

