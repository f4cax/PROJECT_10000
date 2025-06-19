import React, { useState, useEffect } from 'react';

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Загружаем сохраненную тему
    const savedTheme = localStorage.getItem('theme');
    
    // Если есть сохраненная тема
    if (savedTheme) {
      const darkMode = savedTheme === 'dark';
      setIsDark(darkMode);
      
      if (darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } else {
      // По умолчанию светлая тема
      setIsDark(false);
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, []);

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    
    if (newIsDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-1 md:p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex items-center justify-center min-w-[32px] md:min-w-[40px]"
      title={isDark ? 'Переключить на светлую тему' : 'Переключить на темную тему'}
    >
      {isDark ? (
        <span className="text-yellow-500 text-sm md:text-base">☀️</span>
      ) : (
        <span className="text-gray-700 text-sm md:text-base">🌙</span>
      )}
    </button>
  );
} 