import { message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { CreatePackageMember, DeleteUserPackage, UpdateUserPackage } from '../services/https';

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

export const handlePackageSignup = async (selectedPackage: any) => {
  const userInfo = getUserInfo();
  if (!userInfo) {
    message.error('กรุณาเข้าสู่ระบบก่อน');
    return { success: false, shouldRedirect: true };
  }

  if (!selectedPackage) {
    message.warning('กรุณาเลือกประเภทแพ็คเกจและบริการเสริมก่อนสมัคร');
    return { success: false };
  }

  const packageId = selectedPackage?.id || selectedPackage?.ID;
  if (!packageId) {
    message.error('ไม่พบข้อมูลแพ็คเกจที่เลือก กรุณาเลือกแพ็คเกจใหม่');
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
        message.error('เกิดข้อผิดพลาด');
        return { success: false };
      } else {
        message.success('สมัครแพ็คเกจสำเร็จ!');
        return { success: true, shouldReload: true };
      }
    } else {
      const errorMessage = response.data?.error || response.data?.message || 'เกิดข้อผิดพลาด';
      if (errorMessage.includes('user_id') || errorMessage.includes('package_id') || 
          errorMessage.includes('duplicate') || errorMessage.includes('unique')) {
        message.error('เกิดข้อผิดพลาด');
      } else {
        message.error('เกิดข้อผิดพลาดในการสมัครแพ็คเกจ');
      }
      return { success: false };
    }
  } catch (error) {
    message.error('เกิดข้อผิดพลาดในการสมัครแพ็คเกจ');
    return { success: false };
  }
};

export const handlePackageCancel = async () => {
  const userInfo = getUserInfo();
  if (!userInfo) {
    message.error('กรุณาเข้าสู่ระบบก่อน');
    return { success: false, shouldRedirect: true };
  }

  try {
    const response = await DeleteUserPackage(userInfo.user_id);
    if (response.status === 200) {
      message.success('ยกเลิกการสมัครแพ็คเกจสำเร็จ!');
      return { success: true, shouldReload: true };
    } else {
      message.error('เกิดข้อผิดพลาดในการยกเลิกการสมัครแพ็คเกจ');
      return { success: false };
    }
  } catch (error) {
    message.error('เกิดข้อผิดพลาดในการยกเลิกการสมัครแพ็คเกจ');
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

