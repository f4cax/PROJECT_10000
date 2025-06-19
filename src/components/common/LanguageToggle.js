import React from 'react';
import { useTranslation } from '../../utils/translations';

export default function LanguageToggle() {
  const { language, changeLanguage } = useTranslation();

  const toggleLanguage = () => {
    const newLanguage = language === 'ru' ? 'en' : 'ru';
    changeLanguage(newLanguage);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="p-0.5 sm:p-1 lg:p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex items-center justify-center min-w-[28px] sm:min-w-[34px] lg:min-w-[40px]"
      title={language === 'ru' ? 'Switch to English' : 'Переключить на русский'}
    >
      <span className="text-xs sm:text-sm lg:text-base font-medium">
        {language === 'ru' ? 'Ru' : 'En'}
      </span>
    </button>
  );
} 