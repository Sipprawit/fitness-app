import { useState, useEffect } from 'react';
// import { message } from 'antd'; // เปลี่ยนไปใช้ Notification component แทน
import { GetServices, GetPackages } from '../services/https';
import type { Package, Service } from '../interface/package';


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
        console.log('Packages status:', packagesRes?.status);
        if (packagesRes?.status === 200) {
          console.log('Packages data:', packagesRes.data.data);
          setPackages(packagesRes.data.data);
        } else {
          console.error('Failed to load packages:', packagesRes);
          setError('ไม่สามารถโหลดข้อมูลแพ็คเกจได้');
        }
        
        console.log('Services response:', servicesRes);
        console.log('Services status:', servicesRes?.status);
        if (servicesRes?.status === 200) {
          console.log('Services data:', servicesRes.data.data);
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

