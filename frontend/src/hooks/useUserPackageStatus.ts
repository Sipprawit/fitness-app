import { useState, useEffect } from 'react';
import { GetUserPackageStatus } from '../services/https';

interface UserPackageStatus {
  hasPackage: boolean;
  packageName?: string;
  packageType?: string;
}

export const useUserPackageStatus = () => {
  const [userPackageStatus, setUserPackageStatus] = useState<UserPackageStatus>({ hasPackage: false });

  useEffect(() => {
    const checkUserPackageStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        const isLogin = localStorage.getItem('isLogin');
        const userId = localStorage.getItem('id');
        const userData = localStorage.getItem('user');
        
        if (!token || isLogin !== 'true' || !userId) {
          return;
        }

        let user_id;
        if (userData) {
          const user = JSON.parse(userData);
          user_id = user.id;
        } else {
          user_id = parseInt(userId);
        }

        const response = await GetUserPackageStatus(user_id);
        
        if (response.status === 200 && response.data.data && response.data.data.length > 0) {
          const packageMember = response.data.data[0];
          const packageInfo = packageMember.Package || packageMember.package;
          
          if (packageInfo) {
            setUserPackageStatus({
              hasPackage: true,
              packageName: packageInfo.p_name || packageInfo.PackageName,
              packageType: packageInfo.type || packageInfo.Type,
            });
          }
        } else {
          setUserPackageStatus({ hasPackage: false });
        }
      } catch (error) {
        console.error('Error checking user package status:', error);
        setUserPackageStatus({ hasPackage: false });
      }
    };

    checkUserPackageStatus();
  }, []);

  return userPackageStatus;
};

