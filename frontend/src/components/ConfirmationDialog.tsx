import React from 'react';
import { Modal } from 'antd';
import { CUSTOMER_THEME } from '../constants/theme';

interface ConfirmationDialogProps {
  visible: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  visible,
  title,
  message,
  confirmText = 'ยืนยัน',
  cancelText = 'ยกเลิก',
  type = 'warning',
  onConfirm,
  onCancel,
}) => {
  const getConfirmButtonStyle = () => {
    switch (type) {
      case 'danger':
        return {
          backgroundColor: CUSTOMER_THEME.primary,
          borderColor: CUSTOMER_THEME.primary,
          color: 'white',
        };
      case 'warning':
        return {
          backgroundColor: '#f59e0b',
          borderColor: '#f59e0b',
          color: 'white',
        };
      default:
        return {
          backgroundColor: CUSTOMER_THEME.primary,
          borderColor: CUSTOMER_THEME.primary,
          color: 'white',
        };
    }
  };

  return (
    <Modal
      title={title}
      open={visible}
      onOk={onConfirm}
      onCancel={onCancel}
      okText={confirmText}
      cancelText={cancelText}
      okButtonProps={{
        style: getConfirmButtonStyle(),
      }}
      cancelButtonProps={{
        style: {
          backgroundColor: 'transparent',
          borderColor: CUSTOMER_THEME.borderMedium,
          color: CUSTOMER_THEME.textPrimary,
        },
      }}
      style={{
        top: '50%',
        transform: 'translateY(-50%)',
      }}
    >
      <p style={{ 
        color: CUSTOMER_THEME.textPrimary,
        fontSize: '16px',
        lineHeight: '1.5',
        margin: 0
      }}>
        {message}
      </p>
    </Modal>
  );
};
