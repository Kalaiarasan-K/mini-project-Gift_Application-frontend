import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

const Notification = ({ type, message, isVisible, onClose, autoClose = true, duration = 5000 }) => {
  useEffect(() => {
    if (isVisible && autoClose) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, autoClose, duration, onClose]);

  if (!isVisible) return null;

  const getNotificationConfig = () => {
    switch (type) {
      case 'success':
        return {
          icon: CheckCircle,
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          textColor: 'text-green-800',
          iconColor: 'text-green-600'
        };
      case 'error':
        return {
          icon: XCircle,
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          textColor: 'text-red-800',
          iconColor: 'text-red-600'
        };
      case 'warning':
        return {
          icon: AlertCircle,
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          textColor: 'text-yellow-800',
          iconColor: 'text-yellow-600'
        };
      case 'info':
      default:
        return {
          icon: Info,
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          textColor: 'text-blue-800',
          iconColor: 'text-blue-600'
        };
    }
  };

  const config = getNotificationConfig();
  const Icon = config.icon;

  return (
    <div className="fixed top-20 right-4 z-50 animate-slide-in">
      <div className={`${config.bgColor} ${config.borderColor} border rounded-lg p-4 shadow-lg max-w-sm`}>
        <div className="flex items-start space-x-3">
          <Icon className={`w-5 h-5 ${config.iconColor} flex-shrink-0 mt-0.5`} />
          <div className="flex-1">
            <p className={`${config.textColor} text-sm font-medium`}>
              {message}
            </p>
          </div>
          <button
            onClick={onClose}
            className={`${config.textColor} hover:bg-white/50 rounded p-1 transition-colors`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Hook for managing notifications
export const useNotification = () => {
  const [notification, setNotification] = useState({
    type: 'info',
    message: '',
    isVisible: false
  });

  const showNotification = (type, message) => {
    setNotification({
      type,
      message,
      isVisible: true
    });
  };

  const hideNotification = () => {
    setNotification(prev => ({
      ...prev,
      isVisible: false
    }));
  };

  return {
    notification,
    showSuccess: (message) => showNotification('success', message),
    showError: (message) => showNotification('error', message),
    showWarning: (message) => showNotification('warning', message),
    showInfo: (message) => showNotification('info', message),
    hideNotification
  };
};

export default Notification;