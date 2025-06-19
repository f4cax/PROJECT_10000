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
      className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex items-center space-x-1"
      title={language === 'ru' ? 'Switch to English' : 'Переключить на русский'}
    >
      <span className="text-sm font-medium">
        {language === 'ru' ? 'Ru' : 'En'}
      </span>
    </button>
  );
} 