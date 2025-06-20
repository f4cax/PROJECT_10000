import React, { useState, useEffect } from 'react';
import { useTranslation } from '../../utils/translations';

const PWAStatus = () => {
  // const { t } = useTranslation(); // Пока не используется, но оставляем для будущего
  const [pwaStatus, setPwaStatus] = useState({
    isInstalled: false,
    isOnline: navigator.onLine,
    swRegistered: false,
    updateAvailable: false,
    cacheStatus: 'unknown'
  });
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    // Проверяем статус Service Worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(() => {
        setPwaStatus(prev => ({ ...prev, swRegistered: true }));
      });

      // Слушаем сообщения от Service Worker
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data.type === 'BACKGROUND_SYNC_COMPLETE') {
          setPwaStatus(prev => ({ ...prev, cacheStatus: 'updated' }));
          setTimeout(() => {
            setPwaStatus(prev => ({ ...prev, cacheStatus: 'active' }));
          }, 3000);
        }
      });
    }

    // Проверяем, установлено ли приложение
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                        window.navigator.standalone === true;
    setPwaStatus(prev => ({ ...prev, isInstalled: isStandalone }));

    // Слушаем событие beforeinstallprompt
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
    };

    // Слушаем изменения онлайн статуса
    const handleOnline = () => setPwaStatus(prev => ({ ...prev, isOnline: true }));
    const handleOffline = () => setPwaStatus(prev => ({ ...prev, isOnline: false }));

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleInstallPWA = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        setShowInstallPrompt(false);
        setPwaStatus(prev => ({ ...prev, isInstalled: true }));
      }
      
      setDeferredPrompt(null);
    }
  };

  const clearCache = async () => {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      const messageChannel = new MessageChannel();
      messageChannel.port1.onmessage = (event) => {
        if (event.data.success) {
          window.location.reload();
        }
      };
      
      navigator.serviceWorker.controller.postMessage(
        { type: 'CLEAR_CACHE' },
        [messageChannel.port2]
      );
    }
  };

  // Мини-индикатор статуса
  const MiniStatus = () => (
    <div className="flex items-center space-x-2 text-xs">
      {/* Онлайн статус */}
      <div className={`w-2 h-2 rounded-full ${
        pwaStatus.isOnline ? 'bg-green-500' : 'bg-red-500'
      }`} title={pwaStatus.isOnline ? 'Онлайн' : 'Оффлайн'} />
      
      {/* PWA статус */}
      {pwaStatus.isInstalled && (
        <span className="text-blue-600 dark:text-blue-400" title="Установлено как PWA">
          📱
        </span>
      )}
      
      {/* Service Worker статус */}
      {pwaStatus.swRegistered && (
        <span className="text-green-600 dark:text-green-400" title="Service Worker активен">
          ⚡
        </span>
      )}
    </div>
  );

  // Полноценный статус для админ-панели
  const FullStatus = ({ showDetailed = false }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3 flex items-center">
        🧭 PWA Статус
      </h3>
      
      <div className="space-y-3">
        {/* Общий статус */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-300">Статус подключения:</span>
          <span className={`text-sm font-medium flex items-center space-x-1 ${
            pwaStatus.isOnline ? 'text-green-600' : 'text-red-600'
          }`}>
            <div className={`w-2 h-2 rounded-full ${
              pwaStatus.isOnline ? 'bg-green-500' : 'bg-red-500'
            }`} />
            <span>{pwaStatus.isOnline ? 'Онлайн' : 'Оффлайн'}</span>
          </span>
        </div>

        {/* Статус установки */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-300">PWA установлено:</span>
          <span className={`text-sm font-medium ${
            pwaStatus.isInstalled ? 'text-green-600' : 'text-gray-600'
          }`}>
            {pwaStatus.isInstalled ? '✅ Да' : '❌ Нет'}
          </span>
        </div>

        {/* Service Worker */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-300">Service Worker:</span>
          <span className={`text-sm font-medium ${
            pwaStatus.swRegistered ? 'text-green-600' : 'text-red-600'
          }`}>
            {pwaStatus.swRegistered ? '⚡ Активен' : '❌ Неактивен'}
          </span>
        </div>

        {/* Статус кэша */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-300">Статус кэша:</span>
          <span className="text-sm font-medium text-blue-600">
            {pwaStatus.cacheStatus === 'updated' && '🔄 Обновлен'}
            {pwaStatus.cacheStatus === 'active' && '💾 Активен'}
            {pwaStatus.cacheStatus === 'unknown' && '❓ Неизвестен'}
          </span>
        </div>

        {/* Действия */}
        {showDetailed && (
          <div className="pt-3 border-t border-gray-200 dark:border-gray-700 space-y-2">
            {!pwaStatus.isInstalled && showInstallPrompt && (
              <button
                onClick={handleInstallPWA}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors duration-200"
              >
                📱 Установить как приложение
              </button>
            )}
            
            <button
              onClick={clearCache}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm transition-colors duration-200"
            >
              🗑️ Очистить кэш
            </button>
          </div>
        )}
      </div>
    </div>
  );

  // Уведомление об оффлайн режиме
  const OfflineNotification = () => (
    !pwaStatus.isOnline && (
      <div className="fixed top-16 left-4 right-4 z-50 bg-yellow-500 text-white p-3 rounded-lg shadow-lg animate-pulse">
        <div className="flex items-center space-x-2">
          <span>⚠️</span>
          <span className="text-sm font-medium">
            Нет подключения к интернету. Работаем в оффлайн режиме.
          </span>
        </div>
      </div>
    )
  );

  return {
    MiniStatus,
    FullStatus,
    OfflineNotification,
    pwaStatus,
    showInstallPrompt,
    handleInstallPWA
  };
};

export default PWAStatus; 