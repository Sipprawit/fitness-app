import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import React, {  ReactNode } from 'react';
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
      padding: '16px 20px',
      borderRadius: '12px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '12px',
      position: 'relative',
      overflow: 'hidden',
      animation: 'slideInRight 0.3s ease-out',
      minWidth: '300px',
      maxWidth: '400px',
    };

    switch (notification.type) {
      case 'success':
        return {
          ...baseStyle,
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.95) 0%, rgba(5, 150, 105, 0.95) 100%)',
          color: '#ffffff',
        };
      case 'error':
        return {
          ...baseStyle,
          background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.95) 0%, rgba(220, 38, 38, 0.95) 100%)',
          color: '#ffffff',
        };
      case 'warning':
        return {
          ...baseStyle,
          background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.95) 0%, rgba(217, 119, 6, 0.95) 100%)',
          color: '#ffffff',
        };
      case 'info':
        return {
          ...baseStyle,
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.95) 0%, rgba(37, 99, 235, 0.95) 100%)',
          color: '#ffffff',
        };
      default:
        return {
          ...baseStyle,
          background: 'linear-gradient(135deg, rgba(197, 0, 0, 0.95) 0%, rgba(220, 38, 38, 0.95) 100%)',
          color: '#ffffff',
        };
    }
  };

  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      default:
        return '📢';
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
          fontSize: '20px',
          flexShrink: 0,
          marginTop: '2px',
        }}>
          {getIcon()}
        </div>

        {/* Content */}
        <div style={{ flex: 1 }}>
          <h4 style={{
            margin: '0 0 4px 0',
            fontSize: '16px',
            fontWeight: '600',
            lineHeight: '1.4',
          }}>
            {notification.title}
          </h4>
          <p style={{
            margin: 0,
            fontSize: '14px',
            opacity: 0.9,
            lineHeight: '1.4',
          }}>
            {notification.message}
          </p>
        </div>

        {/* Close Button */}
        <button
          onClick={() => onHide(notification.id)}
          style={{
            background: 'none',
            border: 'none',
            color: 'inherit',
            fontSize: '18px',
            cursor: 'pointer',
            padding: '4px',
            borderRadius: '4px',
            flexShrink: 0,
            opacity: 0.7,
            transition: 'opacity 0.2s ease',
          }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
          onMouseLeave={(e) => e.currentTarget.style.opacity = '0.7'}
        >
          ×
        </button>

        {/* Progress Bar */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: 'rgba(255, 255, 255, 0.3)',
          borderRadius: '0 0 12px 12px',
        }}>
          <div style={{
            height: '100%',
            background: 'rgba(255, 255, 255, 0.8)',
            borderRadius: '0 0 12px 12px',
            animation: `progressBar ${notification.duration}ms linear forwards`,
          }} />
        </div>
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
