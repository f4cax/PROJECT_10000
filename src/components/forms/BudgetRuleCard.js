import React from 'react';

export default function BudgetRuleCard({ title, subtitle, amount, color, description, icon }) {
  const formatNumber = (num) => {
    return new Intl.NumberFormat('ru-RU').format(num);
  };

  return (
    <div className="card hover:shadow-xl transition-shadow duration-200 slide-up">
      <div className="flex items-center justify-between mb-2 md:mb-3">
        <div className={`w-10 h-10 md:w-12 md:h-12 ${color} rounded-full flex items-center justify-center text-white text-lg md:text-xl`}>
          {icon}
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500 uppercase tracking-wide">{subtitle}</p>
        </div>
      </div>
      
      <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      
      <div className="mb-2 md:mb-3">
        <p className="text-xl md:text-2xl font-bold text-gray-900">
          {formatNumber(amount)} ₽
        </p>
        <p className="text-xs md:text-sm text-gray-600">
          в месяц
        </p>
      </div>
      
      <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
        {description}
      </p>
      
      {/* Прогресс бар для визуализации */}
      <div className="mt-3 md:mt-4">
        <div className="w-full bg-gray-200 rounded-full h-1.5 md:h-2">
          <div 
            className={`h-1.5 md:h-2 rounded-full ${color}`}
            style={{ 
              width: `${title.includes('Обязательные') ? '100%' : 
                      title.includes('Подушка') ? '60%' : 
                      title.includes('Инвестиции') ? '30%' : '10%'}` 
            }}
          ></div>
        </div>
      </div>
    </div>
  );
} 