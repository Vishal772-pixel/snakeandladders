import React, { useEffect } from 'react';

interface AlertProps {
  type: string;
  content: string;
  onClose?: () => void;
  duration?: number;
}

const Alert: React.FC<AlertProps> = ({ type, content, onClose, duration = 3000 }) => {
  useEffect(() => {
    if (onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [onClose, duration]);

  const getAlertStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-100 border-green-500 text-green-700';
      case 'error':
        return 'bg-red-100 border-red-500 text-red-700';
      case 'warning':
        return 'bg-yellow-100 border-yellow-500 text-yellow-700';
      case 'info':
      default:
        return 'bg-blue-100 border-blue-500 text-blue-700';
    }
  };

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
      <div className={`px-4 py-3 rounded-lg border-l-4 shadow-md ${getAlertStyles()}`}>
        <div className="flex items-center">
          <div className="py-1">
            <p className="font-bold">{content}</p>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="ml-4 text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Alert;