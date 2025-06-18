import React from 'react';

export default function NotificationCard({ notification }) {
  const getColorClasses = (type) => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-green-50 border-green-200',
          text: 'text-green-800',
          title: 'text-green-900',
          icon: 'bg-green-100'
        };
      case 'warning':
        return {
          bg: 'bg-yellow-50 border-yellow-200',
          text: 'text-yellow-800',
          title: 'text-yellow-900',
          icon: 'bg-yellow-100'
        };
      case 'danger':
        return {
          bg: 'bg-red-50 border-red-200',
          text: 'text-red-800',
          title: 'text-red-900',
          icon: 'bg-red-100'
        };
      case 'info':
      default:
        return {
          bg: 'bg-blue-50 border-blue-200',
          text: 'text-blue-800',
          title: 'text-blue-900',
          icon: 'bg-blue-100'
        };
    }
  };

  const colors = getColorClasses(notification.type);

  return (
    <div className={`card ${colors.bg} border-2 slide-up hover:shadow-lg transition-shadow duration-200`}>
      <div className="flex items-start space-x-3">
        <div className={`w-10 h-10 ${colors.icon} rounded-full flex items-center justify-center flex-shrink-0`}>
          <span className="text-lg">{notification.icon}</span>
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className={`text-sm font-semibold ${colors.title} mb-1`}>
            {notification.title}
          </h4>
          <p className={`text-sm ${colors.text} leading-relaxed`}>
            {notification.message}
          </p>
        </div>
      </div>
      
      {/* Дополнительные действия (если нужны) */}
      {notification.action && (
        <div className="mt-3 flex justify-end">
          <button className="text-xs font-medium text-primary-600 hover:text-primary-800 transition-colors duration-200">
            {notification.action}
          </button>
        </div>
      )}
    </div>
  );
} 