/* eslint-disable */

const CACHE_NAME = 'financial-compass-v2.0';
const STATIC_CACHE = 'static-v2.0';
const DYNAMIC_CACHE = 'dynamic-v2.0';
const API_CACHE = 'api-v2.0';

// Статические ресурсы для кэширования
const STATIC_ASSETS = [
  '/',
  '/static/css/main.css',
  '/static/js/main.js',
  '/manifest.json',
  '/favicon.ico',
  '/favicon.svg',
  '/apple-touch-icon.svg'
];

// API эндпоинты для кэширования
const API_ENDPOINTS = [
  '/api/cbr/currencies',
  '/api/stocks/data',
  '/api/user/profile'
];

// Стратегии кэширования
const CACHE_STRATEGIES = {
  // Кэш сначала (для статических ресурсов)
  CACHE_FIRST: 'cache-first',
  // Сеть сначала (для динамических данных)
  NETWORK_FIRST: 'network-first',
  // Только кэш (для оффлайн страниц)
  CACHE_ONLY: 'cache-only',
  // Только сеть (для критических обновлений)
  NETWORK_ONLY: 'network-only'
};

// Установка Service Worker
self.addEventListener('install', (event) => {
  console.log('💾 [SW] Установка Service Worker...');
  
  event.waitUntil(
    Promise.all([
      // Кэшируем статические ресурсы
      caches.open(STATIC_CACHE).then((cache) => {
        console.log('📦 [SW] Кэширование статических ресурсов');
        return cache.addAll(STATIC_ASSETS);
      }),
      
      // Создаем offline страницу
      caches.open(DYNAMIC_CACHE).then((cache) => {
        console.log('🌐 [SW] Создание offline кэша');
        return cache.put('/offline', new Response(`
          <!DOCTYPE html>
          <html lang="ru">
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>Финансовый компас - Оффлайн</title>
            <style>
              body { 
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white; text-align: center; padding: 2rem; margin: 0;
                min-height: 100vh; display: flex; align-items: center; justify-content: center;
              }
              .container { max-width: 500px; }
              .compass { font-size: 4rem; margin-bottom: 1rem; }
              h1 { font-size: 2rem; margin-bottom: 1rem; }
              p { font-size: 1.1rem; opacity: 0.9; margin-bottom: 2rem; }
              button { 
                background: rgba(255,255,255,0.2); border: 2px solid white; 
                color: white; padding: 12px 24px; font-size: 1rem; border-radius: 8px;
                cursor: pointer; transition: all 0.3s ease;
              }
              button:hover { background: rgba(255,255,255,0.3); }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="compass">🧭</div>
              <h1>Финансовый компас</h1>
              <p>Нет подключения к интернету, но основные функции доступны в оффлайн режиме!</p>
              <button onclick="window.location.reload()">🔄 Попробовать снова</button>
            </div>
          </body>
          </html>
        `, { headers: { 'Content-Type': 'text/html' } }));
      })
    ]).then(() => {
      console.log('✅ [SW] Установка завершена');
      // Принудительно активируем новый SW
      return self.skipWaiting();
    })
  );
});

// Активация Service Worker
self.addEventListener('activate', (event) => {
  console.log('🚀 [SW] Активация Service Worker...');
  
  event.waitUntil(
    Promise.all([
      // Очистка старых кэшей
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && 
                cacheName !== DYNAMIC_CACHE && 
                cacheName !== API_CACHE) {
              console.log('🗑️ [SW] Удаление старого кэша:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      
      // Принимаем контроль над всеми клиентами
      self.clients.claim()
    ]).then(() => {
      console.log('✅ [SW] Активация завершена');
    })
  );
});

// Умная стратегия кэширования
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Игнорируем запросы к другим доменам (кроме API)
  if (url.origin !== location.origin && !isApiRequest(request)) {
    return;
  }
  
  // Определяем стратегию кэширования
  if (isStaticAsset(request)) {
    // Статические ресурсы - кэш сначала
    event.respondWith(handleStaticAsset(request));
  } else if (isApiRequest(request)) {
    // API запросы - сеть сначала с fallback
    event.respondWith(handleApiRequest(request));
  } else if (isNavigationRequest(request)) {
    // Навигация - сеть сначала с offline fallback
    event.respondWith(handleNavigationRequest(request));
  } else {
    // Остальные запросы - динамическое кэширование
    event.respondWith(handleDynamicRequest(request));
  }
});

// Проверка типов запросов
function isStaticAsset(request) {
  return request.destination === 'script' || 
         request.destination === 'style' || 
         request.destination === 'image' ||
         request.url.includes('/static/');
}

function isApiRequest(request) {
  return request.url.includes('/api/') || 
         request.url.includes('cbr.ru') ||
         request.url.includes('eodhd.com') ||
         request.url.includes('api.coingecko.com');
}

function isNavigationRequest(request) {
  return request.mode === 'navigate';
}

// Обработчики стратегий кэширования

// Cache First - для статических ресурсов
async function handleStaticAsset(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('⚠️ [SW] Ошибка загрузки статического ресурса:', error);
    return new Response('Ресурс недоступен', { status: 503 });
  }
}

// Network First - для API запросов
async function handleApiRequest(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(API_CACHE);
      // Кэшируем только GET запросы
      if (request.method === 'GET') {
        cache.put(request, networkResponse.clone());
      }
    }
    return networkResponse;
  } catch (error) {
    console.log('🌐 [SW] Сеть недоступна, ищем в кэше API');
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      // Добавляем заголовок о том, что данные из кэша
      const response = cachedResponse.clone();
      response.headers.set('X-Cache-Status', 'from-cache');
      return response;
    }
    
    // Возвращаем заглушку для API
    return new Response(JSON.stringify({
      error: 'Данные недоступны в оффлайн режиме',
      cached: false,
      timestamp: Date.now()
    }), {
      headers: { 'Content-Type': 'application/json' },
      status: 503
    });
  }
}

// Network First с offline fallback - для навигации
async function handleNavigationRequest(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('🌐 [SW] Сеть недоступна, ищем страницу в кэше');
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Возвращаем offline страницу
    return caches.match('/offline');
  }
}

// Динамическое кэширование
async function handleDynamicRequest(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    return cachedResponse || new Response('Контент недоступен', { status: 503 });
  }
}

// Push уведомления с улучшенной логикой
self.addEventListener('push', (event) => {
  console.log('📱 [SW] Получено push уведомление');
  
  let notificationData = {
    title: 'Финансовый компас',
    body: 'У вас есть новые финансовые данные!',
    icon: '/favicon.svg',
    badge: '/favicon.svg',
    vibrate: [200, 100, 200],
    tag: 'financial-update',
    renotify: true,
    requireInteraction: false,
    actions: [
      {
        action: 'open',
        title: '📈 Открыть приложение',
        icon: '/favicon.svg'
      },
      {
        action: 'dismiss',
        title: '❌ Закрыть',
        icon: '/favicon.svg'
      }
    ],
    data: {
      url: '/',
      timestamp: Date.now()
    }
  };

  // Парсим данные из push сообщения
  if (event.data) {
    try {
      const pushData = event.data.json();
      notificationData = { ...notificationData, ...pushData };
    } catch (error) {
      console.log('⚠️ [SW] Ошибка парсинга push данных:', error);
    }
  }

  event.waitUntil(
    self.registration.showNotification(notificationData.title, notificationData)
  );
});

// Обработка кликов по уведомлениям
self.addEventListener('notificationclick', (event) => {
  console.log('👆 [SW] Клик по уведомлению');
  
  event.notification.close();

  if (event.action === 'open' || !event.action) {
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then((clientList) => {
        // Проверяем, есть ли уже открытое окно
        for (let client of clientList) {
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            return client.focus();
          }
        }
        
        // Открываем новое окно
        if (clients.openWindow) {
          const targetUrl = event.notification.data?.url || '/';
          return clients.openWindow(targetUrl);
        }
      })
    );
  } else if (event.action === 'dismiss') {
    // Просто закрываем уведомление
    console.log('❌ [SW] Уведомление отклонено пользователем');
  }
});

// Синхронизация в фоне
self.addEventListener('sync', (event) => {
  console.log('🔄 [SW] Фоновая синхронизация:', event.tag);
  
  if (event.tag === 'background-sync') {
    event.waitUntil(performBackgroundSync());
  }
});

async function performBackgroundSync() {
  try {
    console.log('🔄 [SW] Выполнение фоновой синхронизации...');
    
    // Обновляем критически важные данные
    const responses = await Promise.allSettled([
      fetch('/api/cbr/currencies'),
      fetch('/api/stocks/data')
    ]);
    
    console.log('✅ [SW] Фоновая синхронизация завершена');
    
    // Уведомляем клиентов об обновлении данных
    const clients = await self.clients.matchAll();
    clients.forEach(client => {
      client.postMessage({
        type: 'BACKGROUND_SYNC_COMPLETE',
        timestamp: Date.now()
      });
    });
  } catch (error) {
    console.log('⚠️ [SW] Ошибка фоновой синхронизации:', error);
  }
}

// Сообщения от клиентов
self.addEventListener('message', (event) => {
  console.log('💬 [SW] Сообщение от клиента:', event.data);
  
  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  } else if (event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({
      version: CACHE_NAME,
      timestamp: Date.now()
    });
  } else if (event.data.type === 'CLEAR_CACHE') {
    clearAllCaches().then(() => {
      event.ports[0].postMessage({ success: true });
    });
  }
});

// Очистка всех кэшей
async function clearAllCaches() {
  const cacheNames = await caches.keys();
  await Promise.all(cacheNames.map(name => caches.delete(name)));
  console.log('🗑️ [SW] Все кэши очищены');
}

console.log('🚀 [SW] Service Worker загружен. Версия:', CACHE_NAME); 