import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import LanguageToggle from './LanguageToggle';
import AuthModal from '../auth/AuthModal';
import { useTranslation } from '../../utils/translations';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();
  const { t } = useTranslation();

  useEffect(() => {
    // Проверяем авторизацию при загрузке
    const token = localStorage.getItem('authToken');
    const savedUser = localStorage.getItem('user');
    if (token && savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
      } catch (error) {
        console.error('Ошибка парсинга пользователя:', error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
      }
    }
  }, []);

  // Добавляем слушатель изменений localStorage для автообновления
  useEffect(() => {
    const handleStorageChange = () => {
      const token = localStorage.getItem('authToken');
      const savedUser = localStorage.getItem('user');
      if (token && savedUser) {
        try {
          const userData = JSON.parse(savedUser);
          setUser(userData);
        } catch (error) {
          console.error('Ошибка парсинга пользователя:', error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleAuth = (userData, token) => {
    setUser(userData);
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(userData));
    // Принудительно обновляем состояние для немедленного отображения изменений
    setTimeout(() => setUser(userData), 100);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setUser(null);
  };

  const navigation = [
    { name: t('home'), href: '/', icon: '🏠' },
    { name: t('stocks'), href: '/stocks', icon: '📈' },
    { name: t('cbrData'), href: '/cbr', icon: '💱' },
    { name: t('assets'), href: '/assets', icon: '💰' },
    { name: t('tips'), href: '/tips', icon: '💡' },
    { name: t('test'), href: '/test', icon: '🧠' },
    { name: t('about'), href: '/about', icon: 'ℹ️' },
    // Админ-панель (только для админов)
    ...(user && user.role === 'admin' ? [{ name: t('admin'), href: '/admin', icon: '🛡️' }] : [])
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-gray-800 dark:bg-gray-950 shadow-lg sticky top-0 z-50 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Левая часть: Логотип и бургер-меню */}
          <div className="flex items-center space-x-2 md:space-x-4">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl md:text-2xl font-bold text-primary-400">🧭</span>
              <span className="ml-2 text-lg md:text-xl font-bold text-white nav-title">Финансовый компас</span>
            </Link>
            
            {/* Бургер-меню */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-400 hover:text-white hover:bg-gray-700 p-1 md:p-2 rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
              aria-label="Открыть меню"
            >
              <div className="w-5 h-5 md:w-6 md:h-6 flex flex-col justify-center items-center space-y-1">
                <span className={`bg-current h-0.5 w-5 md:w-6 transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
                <span className={`bg-current h-0.5 w-5 md:w-6 transition-all duration-300 ${isOpen ? 'opacity-0' : ''}`}></span>
                <span className={`bg-current h-0.5 w-5 md:w-6 transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
              </div>
            </button>
          </div>

          {/* Правая часть: Управление */}
          <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-3 nav-buttons">
            <div className="flex items-center space-x-0.5 sm:space-x-1 md:space-x-2">
              <LanguageToggle />
              <ThemeToggle />
            </div>
            
            {/* Авторизация */}
            {user ? (
              <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-3">
                <div className="flex items-center space-x-1 md:space-x-2 bg-gray-700 dark:bg-gray-800 px-1.5 sm:px-2 md:px-3 py-1 rounded-lg">
                  <span className="text-base sm:text-lg md:text-xl">{user.role === 'admin' ? '👑' : '👤'}</span>
                  <span className="text-white text-xs md:text-sm font-medium hidden sm:block">{user.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-gray-300 hover:text-white transition-colors duration-200 p-0.5 sm:p-1 md:p-2 hover:bg-gray-700 rounded-md"
                  title="Выйти из аккаунта"
                >
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="bg-primary-600 hover:bg-primary-700 text-white px-2 sm:px-3 md:px-4 py-1 md:py-2 rounded-lg text-xs md:text-sm font-medium transition-colors duration-200"
              >
                {t('login')}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Выдвижное меню */}
      <div className={`fixed inset-0 z-40 transition-all duration-300 ${isOpen ? 'visible' : 'invisible'}`}>
        {/* Фон-оверлей */}
        <div 
          className={`absolute inset-0 bg-black menu-overlay transition-opacity duration-300 ${isOpen ? 'opacity-50' : 'opacity-0'}`}
          onClick={() => setIsOpen(false)}
        ></div>
        
                {/* Само меню */}
        <div className={`absolute left-0 top-16 w-80 max-w-sm bg-gray-800 dark:bg-gray-900 shadow-2xl transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'} max-h-screen overflow-hidden flex flex-col`}>
          <div className="px-6 py-4 border-b border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-0 flex items-center">
              <span className="text-2xl mr-2">🧭</span>
              {t('navigation') || 'Навигация'}
            </h3>
          </div>
          
          {/* Прокручиваемый список разделов */}
          <div className="flex-1 overflow-y-auto px-6 py-4 nav-menu-scroll">
            <div className="space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`nav-item relative flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium group transition-all duration-200 ${
                    isActive(item.href)
                      ? 'bg-primary-600 text-white shadow-lg active'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <span className="nav-icon text-xl filter brightness-125">
                    {item.icon}
                  </span>
                  <span className="flex-1">{item.name}</span>
                  {isActive(item.href) && (
                    <span className="w-2 h-2 bg-primary-200 rounded-full animate-pulse"></span>
                  )}
                </Link>
              ))}
            </div>
          </div>
          
          {/* Информация о пользователе и быстрые действия - зафиксированы внизу */}
          <div className="border-t border-gray-700 px-6 py-4">
            {/* Дополнительная информация */}
            {user && (
              <div className="mb-4">
                <div className="flex items-center space-x-3 px-4 py-3 user-card rounded-lg">
                  <div className="relative">
                    <span className="text-2xl">{user.role === 'admin' ? '👑' : '👤'}</span>
                    {user.role === 'admin' && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white text-sm font-medium truncate">{user.name}</div>
                    <div className="text-gray-400 text-xs truncate">{user.email}</div>
                    <div className="text-primary-400 text-xs font-medium">
                      {user.role === 'admin' ? `👑 ${t('administrator') || 'Администратор'}` : `👤 ${t('user') || 'Пользователь'}`}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Быстрые действия */}
            <div className="flex space-x-2">
              <button
                onClick={() => setIsOpen(false)}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg text-sm transition-colors duration-200"
              >
                {t('close') || 'Закрыть'}
              </button>
              {!user && (
                <button
                  onClick={() => {
                    setShowAuthModal(true);
                    setIsOpen(false);
                  }}
                  className="flex-1 bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-lg text-sm transition-colors duration-200"
                >
                  {t('login')}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Модальное окно авторизации */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuth={handleAuth}
      />
    </nav>
  );
} 