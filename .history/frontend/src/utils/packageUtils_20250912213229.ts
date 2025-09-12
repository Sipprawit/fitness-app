import { CreatePackageMember, DeleteUserPackage, UpdateUserPackage } from '../services/https';

// เนื่องจากไฟล์นี้เป็น utility function ที่ไม่ได้เป็น React component
// เราจะส่ง notification function เป็น parameter แทน
export interface NotificationFunction {
  showNotification: (notification: {
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
    duration?: number;
  }) => void;
}

export const getUserInfo = () => {
  const token = localStorage.getItem('token');
  const isLogin = localStorage.getItem('isLogin');
  const userId = localStorage.getItem('id');
  const userData = localStorage.getItem('user');
  
  if (!token || isLogin !== 'true' || !userId) {
    return null;
  }

  let user_id;
  if (userData) {
    const user = JSON.parse(userData);
    user_id = user.id;
  } else {
    user_id = parseInt(userId);
  }

  return { user_id, token, isLogin };
};

export const handlePackageSignup = async (selectedPackage: any, showNotification?: NotificationFunction['showNotification']) => {
  const userInfo = getUserInfo();
  if (!userInfo) {
    showNotification?.({
      type: 'error',
      title: 'กรุณาเข้าสู่ระบบก่อน',
      message: 'กรุณาเข้าสู่ระบบก่อนดำเนินการ',
      duration: 3000
    });
    return { success: false, shouldRedirect: true };
  }

  if (!selectedPackage) {
    showNotification?.({
      type: 'warning',
      title: 'กรุณาเลือกแพ็คเกจ',
      message: 'กรุณาเลือกประเภทแพ็คเกจและบริการเสริมก่อนสมัคร',
      duration: 3000
    });
    return { success: false };
  }

  const packageId = selectedPackage?.id || selectedPackage?.ID;
  if (!packageId) {
    showNotification?.({
      type: 'error',
      title: 'ไม่พบข้อมูลแพ็คเกจ',
      message: 'ไม่พบข้อมูลแพ็คเกจที่เลือก กรุณาเลือกแพ็คเกจใหม่',
      duration: 3000
    });
    return { success: false };
  }

  try {
    const response = await CreatePackageMember({
      user_id: userInfo.user_id,
      package_id: packageId
    });

    if (response.status === 200) {
      const errorMessage = response.data?.error || response.data?.message || '';
      if (errorMessage.includes('user_id') || errorMessage.includes('package_id') || 
          errorMessage.includes('duplicate') || errorMessage.includes('unique')) {
        showNotification?.({
          type: 'error',
          title: 'เกิดข้อผิดพลาด',
          message: 'ไม่สามารถสมัครแพ็คเกจได้',
          duration: 3000
        });
        return { success: false };
      } else {
        showNotification?.({
          type: 'success',
          title: 'สมัครแพ็คเกจสำเร็จ!',
          message: 'สมัครแพ็คเกจเรียบร้อยแล้ว',
          duration: 2000
        });
        return { success: true, shouldReload: true };
      }
    } else {
      const errorMessage = response.data?.error || response.data?.message || 'เกิดข้อผิดพลาด';
      if (errorMessage.includes('user_id') || errorMessage.includes('package_id') || 
          errorMessage.includes('duplicate') || errorMessage.includes('unique')) {
        showNotification?.({
          type: 'error',
          title: 'เกิดข้อผิดพลาด',
          message: 'ไม่สามารถสมัครแพ็คเกจได้',
          duration: 3000
        });
      } else {
        showNotification?.({
          type: 'error',
          title: 'ไม่สามารถสมัครแพ็คเกจได้',
          message: 'เกิดข้อผิดพลาดในการสมัครแพ็คเกจ',
          duration: 3000
        });
      }
      return { success: false };
    }
  } catch (error) {
    showNotification?.({
      type: 'error',
      title: 'ไม่สามารถสมัครแพ็คเกจได้',
      message: 'เกิดข้อผิดพลาดในการสมัครแพ็คเกจ',
      duration: 3000
    });
    return { success: false };
  }
};

export const handlePackageCancel = async (showNotification?: NotificationFunction['showNotification']) => {
  const userInfo = getUserInfo();
  if (!userInfo) {
    showNotification?.({
      type: 'error',
      title: 'กรุณาเข้าสู่ระบบก่อน',
      message: 'กรุณาเข้าสู่ระบบก่อนดำเนินการ',
      duration: 3000
    });
    return { success: false, shouldRedirect: true };
  }

  try {
    const response = await DeleteUserPackage(userInfo.user_id);
    if (response.status === 200) {
      showNotification?.({
        type: 'success',
        title: 'ยกเลิกการสมัครแพ็คเกจสำเร็จ!',
        message: 'ยกเลิกการสมัครแพ็คเกจเรียบร้อยแล้ว',
        duration: 2000
      });
      return { success: true, shouldReload: true };
    } else {
      showNotification?.({
        type: 'error',
        title: 'ไม่สามารถยกเลิกการสมัครได้',
        message: 'เกิดข้อผิดพลาดในการยกเลิกการสมัครแพ็คเกจ',
        duration: 3000
      });
      return { success: false };
    }
  } catch (error) {
    showNotification?.({
      type: 'error',
      title: 'ไม่สามารถยกเลิกการสมัครได้',
      message: 'เกิดข้อผิดพลาดในการยกเลิกการสมัครแพ็คเกจ',
      duration: 3000
    });
    return { success: false };
  }
};

export const handlePackageChange = async (selectedPackage: any) => {
  const userInfo = getUserInfo();
  if (!userInfo) {
    message.error('กรุณาเข้าสู่ระบบก่อน');
    return { success: false, shouldRedirect: true };
  }

  if (!selectedPackage) {
    message.warning('กรุณาเลือกประเภทแพ็คเกจและบริการเสริมก่อนเปลี่ยนแพ็คเกจ');
    return { success: false };
  }

  const packageId = selectedPackage?.id || selectedPackage?.ID;
  if (!packageId) {
    message.error('ไม่พบข้อมูลแพ็คเกจที่เลือก กรุณาเลือกแพ็คเกจใหม่');
    return { success: false };
  }

  try {
    const response = await UpdateUserPackage(userInfo.user_id, packageId);
    if (response.status === 200) {
      const errorMessage = response.data?.error || response.data?.message || '';
      if (errorMessage.includes('user_id') || errorMessage.includes('package_id') || 
          errorMessage.includes('duplicate') || errorMessage.includes('unique')) {
        message.error('เกิดข้อผิดพลาด');
        return { success: false };
      } else {
        message.success('เปลี่ยนแพ็คเกจสำเร็จ!');
        return { success: true, shouldReload: true };
      }
    } else {
      message.error('เกิดข้อผิดพลาดในการเปลี่ยนแพ็คเกจ');
      return { success: false };
    }
  } catch (error) {
    message.error('เกิดข้อผิดพลาดในการเปลี่ยนแพ็คเกจ');
    return { success: false };
  }
};

