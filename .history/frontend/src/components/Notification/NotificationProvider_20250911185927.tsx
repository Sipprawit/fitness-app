import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
}

interface NotificationContextType {
  showNotification: (notification: Omit<Notification, 'id'>) => void;
  hideNotification: (id: string) => void;
  notifications: Notification[];
}

const NotificationContext = createContext<NotificationContextType>({
  showNotification: () => {},
  hideNotification: () => {},
  notifications: [],
});

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const showNotification = useCallback((notification: Omit<Notification, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newNotification: Notification = {
      ...notification,
      id,
      duration: notification.duration || 5000,
    };

    setNotifications(prev => [...prev, newNotification]);

    // Auto hide after duration
    setTimeout(() => {
      hideNotification(id);
    }, newNotification.duration);
  }, []);

  const hideNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  return (
    <NotificationContext.Provider value={{ showNotification, hideNotification, notifications }}>
      {children}
      <NotificationContainer notifications={notifications} onHide={hideNotification} />
    </NotificationContext.Provider>
  );
};

// Notification Container Component
interface NotificationContainerProps {
  notifications: Notification[];
  onHide: (id: string) => void;
}

const NotificationContainer: React.FC<NotificationContainerProps> = ({ notifications, onHide }) => {
  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      zIndex: 10000,
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      maxWidth: '400px',
    }}>
      {notifications.map(notification => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onHide={onHide}
        />
      ))}
    </div>
  );
};

// Individual Notification Item
interface NotificationItemProps {
  notification: Notification;
  onHide: (id: string) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onHide }) => {
  const getNotificationStyle = () => {
    const baseStyle: React.CSSProperties = {
      padding: '12px 16px',
      borderRadius: '8px',
      boxShadow: '0 4px 16px rgba(197, 0, 0, 0.15)',
      background: '#ffffff',
      border: '2px solid #fecaca',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      position: 'relative',
      overflow: 'hidden',
      animation: 'slideInRight 0.2s ease-out',
      minWidth: '280px',
      maxWidth: '350px',
      color: '#374151',
    };

    switch (notification.type) {
      case 'success':
        return {
          ...baseStyle,
          border: '2px solid #10b981',
          backgroundColor: '#f0fdf4',
          color: '#065f46',
        };
      case 'error':
        return {
          ...baseStyle,
          border: '2px solid #ef4444',
          backgroundColor: '#fef2f2',
          color: '#dc2626',
        };
      case 'warning':
        return {
          ...baseStyle,
          border: '2px solid #f59e0b',
          backgroundColor: '#fffbeb',
          color: '#d97706',
        };
      case 'info':
        return {
          ...baseStyle,
          border: '2px solid #c50000',
          backgroundColor: '#fef2f2',
          color: '#c50000',
        };
      default:
        return {
          ...baseStyle,
          border: '2px solid #c50000',
          backgroundColor: '#fef2f2',
          color: '#c50000',
        };
    }
  };

  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '!';
      case 'info':
        return 'i';
      default:
        return '!';
    }
  };

  return (
    <>
      <style>
        {`
          @keyframes slideInRight {
            from {
              transform: translateX(100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
          
          @keyframes slideOutRight {
            from {
              transform: translateX(0);
              opacity: 1;
            }
            to {
              transform: translateX(100%);
              opacity: 0;
            }
          }
        `}
      </style>
      <div style={getNotificationStyle()}>
        {/* Icon */}
        <div style={{
          fontSize: '16px',
          fontWeight: 'bold',
          flexShrink: 0,
          width: '20px',
          height: '20px',
          borderRadius: '50%',
          backgroundColor: notification.type === 'success' ? '#10b981' : 
                          notification.type === 'error' ? '#ef4444' : 
                          notification.type === 'warning' ? '#f59e0b' : '#c50000',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {getIcon()}
        </div>

        {/* Content */}
        <div style={{ flex: 1 }}>
          <div style={{
            fontSize: '14px',
            fontWeight: '600',
            lineHeight: '1.3',
            marginBottom: '2px',
          }}>
            {notification.title}
          </div>
          <div style={{
            fontSize: '12px',
            lineHeight: '1.3',
            opacity: 0.8,
          }}>
            {notification.message}
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={() => onHide(notification.id)}
          style={{
            background: 'none',
            border: 'none',
            color: '#6b7280',
            fontSize: '14px',
            cursor: 'pointer',
            padding: '2px',
            borderRadius: '3px',
            flexShrink: 0,
            opacity: 0.6,
            transition: 'opacity 0.2s ease',
          }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
          onMouseLeave={(e) => e.currentTarget.style.opacity = '0.6'}
        >
          ×
        </button>
      </div>

      <style>
        {`
          @keyframes progressBar {
            from {
              width: 100%;
            }
            to {
              width: 0%;
            }
          }
        `}
      </style>
    </>
  );
};
