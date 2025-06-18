import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const AdminDashboard = () => {
  const { user, token } = useAuth();
  const [activeTab, setActiveTab] = useState('stats');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [showCreateAdmin, setShowCreateAdmin] = useState(false);
  const [dbStats, setDbStats] = useState(null);
  const [systemSettings, setSystemSettings] = useState({
    registration: true,
    cbrApi: true,
    notifications: false
  });

  // Проверка прав доступа
  useEffect(() => {
    // Также проверяем localStorage на случай если useAuth не обновился
    const savedUser = localStorage.getItem('user');
    let currentUser = user;
    
    if (!currentUser && savedUser) {
      try {
        currentUser = JSON.parse(savedUser);
      } catch (error) {
        console.error('Ошибка парсинга пользователя:', error);
      }
    }
    
    console.log('AdminDashboard - текущий пользователь:', currentUser);
    console.log('AdminDashboard - роль пользователя:', currentUser?.role);
    
    if (!currentUser || currentUser.role !== 'admin') {
      console.log('Доступ запрещен! Требуются права администратора.');
      return;
    }
    
    // Загружаем данные для активной вкладки
    if (activeTab === 'stats') {
      loadStats();
    } else if (activeTab === 'users') {
      loadUsers();
    } else if (activeTab === 'settings') {
      loadSettings();
    }
  }, [user, activeTab]);

  const loadSettings = async () => {
    try {
      const data = await apiCall('/api/admin/settings');
      setSystemSettings(data);
      console.log('Настройки загружены:', data);
    } catch (error) {
      console.error('Ошибка загрузки настроек:', error);
      // Не показываем alert для настроек, просто логируем
    }
  };

  // API функции
  const apiCall = async (url, options = {}) => {
    // Получаем актуальный токен
    const currentToken = token || localStorage.getItem('authToken');
    
    if (!currentToken) {
      throw new Error('Токен авторизации отсутствует');
    }

    console.log('API запрос:', url);
    console.log('Токен:', currentToken ? 'Есть' : 'Отсутствует');

    const response = await fetch(`http://localhost:5000${url}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${currentToken}`,
        ...options.headers,
      },
    });
    
    console.log('Ответ API:', response.status, response.statusText);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Ошибка API:', errorText);
      
      if (response.status === 401) {
        // Токен недействителен, очищаем данные
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        window.location.href = '/';
        throw new Error('Токен недействителен. Авторизуйтесь заново.');
      }
      
      try {
        const error = JSON.parse(errorText);
        throw new Error(error.error || 'Ошибка сервера');
      } catch (e) {
        throw new Error(`Ошибка сервера: ${response.status}`);
      }
    }
    
    return response.json();
  };

  const loadStats = async () => {
    try {
      setLoading(true);
      const data = await apiCall('/api/admin/stats');
      setStats(data);
    } catch (error) {
      console.error('Ошибка загрузки статистики:', error);
      alert('Ошибка загрузки статистики: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async (page = 1) => {
    try {
      setLoading(true);
      const data = await apiCall(`/api/admin/users?page=${page}&limit=10`);
      setUsers(data.users);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Ошибка загрузки пользователей:', error);
      alert('Ошибка загрузки пользователей: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const searchUsers = async () => {
    if (!searchQuery.trim()) return loadUsers();
    
    try {
      setLoading(true);
      const data = await apiCall(`/api/admin/users/search?query=${encodeURIComponent(searchQuery)}`);
      setUsers(data.users);
      setPagination({});
    } catch (error) {
      console.error('Ошибка поиска:', error);
      alert('Ошибка поиска: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (userId, updateData) => {
    try {
      await apiCall(`/api/admin/users/${userId}`, {
        method: 'PUT',
        body: JSON.stringify(updateData),
      });
      alert('Пользователь обновлен!');
      loadUsers();
      setEditingUser(null);
    } catch (error) {
      console.error('Ошибка обновления:', error);
      alert('Ошибка обновления: ' + error.message);
    }
  };

  const deleteUser = async (userId) => {
    try {
      await apiCall(`/api/admin/users/${userId}`, { method: 'DELETE' });
      alert('✅ Пользователь успешно удален из базы данных!');
      loadUsers();
    } catch (error) {
      console.error('Ошибка удаления:', error);
      alert('❌ Ошибка удаления: ' + error.message);
    }
  };

  const createFirstAdmin = async (adminData) => {
    try {
      await fetch('http://localhost:5000/api/admin/create-first-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(adminData),
      });
      alert('✅ Админ создан!');
      setShowCreateAdmin(false);
      loadUsers();
    } catch (error) {
      console.error('Ошибка создания админа:', error);
      alert('❌ Ошибка создания админа: ' + error.message);
    }
  };

  // Функции для работы с базой данных
  const exportData = async () => {
    try {
      setLoading(true);
      const data = await apiCall('/api/admin/export');
      
      // Создаем и скачиваем файл
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `financeguide-export-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      window.URL.revokeObjectURL(url);
      
      alert('✅ Данные экспортированы!');
    } catch (error) {
      console.error('Ошибка экспорта:', error);
      alert('❌ Ошибка экспорта: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const optimizeDatabase = async () => {
    if (!window.confirm('Выполнить оптимизацию базы данных?\n\nЭто может занять некоторое время.')) return;
    
    try {
      setLoading(true);
      await apiCall('/api/admin/optimize', { method: 'POST' });
      alert('✅ База данных оптимизирована!');
    } catch (error) {
      console.error('Ошибка оптимизации:', error);
      alert('❌ Ошибка оптимизации: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const getDatabaseStats = async () => {
    try {
      setLoading(true);
      const data = await apiCall('/api/admin/db-stats');
      setDbStats(data);
      alert('✅ Статистика БД обновлена!');
    } catch (error) {
      console.error('Ошибка получения статистики БД:', error);
      alert('❌ Ошибка получения статистики БД: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const clearDatabase = async () => {
    const confirmation = window.prompt(
      '⚠️ ОПАСНО! Вы собираетесь удалить ВСЕ данные!\n\nДля подтверждения введите: УДАЛИТЬ ВСЕ ДАННЫЕ'
    );
    
    if (confirmation !== 'УДАЛИТЬ ВСЕ ДАННЫЕ') {
      alert('Операция отменена');
      return;
    }

    try {
      setLoading(true);
      await apiCall('/api/admin/clear-database', { method: 'DELETE' });
      alert('✅ База данных очищена!');
      // Перезагружаем данные
      loadStats();
      loadUsers();
    } catch (error) {
      console.error('Ошибка очистки БД:', error);
      alert('❌ Ошибка очистки БД: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const resetSystem = async () => {
    const confirmation = window.prompt(
      '⚠️ ВНИМАНИЕ! Сброс системы к заводским настройкам!\n\nВведите: СБРОС СИСТЕМЫ'
    );
    
    if (confirmation !== 'СБРОС СИСТЕМЫ') {
      alert('Операция отменена');
      return;
    }

    try {
      setLoading(true);
      await apiCall('/api/admin/reset-system', { method: 'POST' });
      alert('✅ Система сброшена к заводским настройкам!');
      window.location.href = '/';
    } catch (error) {
      console.error('Ошибка сброса системы:', error);
      alert('❌ Ошибка сброса системы: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleSetting = async (setting) => {
    try {
      const newSettings = { ...systemSettings, [setting]: !systemSettings[setting] };
      setSystemSettings(newSettings);
      
      await apiCall('/api/admin/settings', {
        method: 'PUT',
        body: JSON.stringify(newSettings),
      });
      
      alert('✅ Настройка обновлена!');
    } catch (error) {
      console.error('Ошибка обновления настроек:', error);
      alert('❌ Ошибка обновления настроек: ' + error.message);
      // Откатываем изменения
      setSystemSettings(systemSettings);
    }
  };

  // Проверка прав доступа для отображения
  const checkAdminAccess = () => {
    const savedUser = localStorage.getItem('user');
    let currentUser = user;
    
    if (!currentUser && savedUser) {
      try {
        currentUser = JSON.parse(savedUser);
      } catch (error) {
        console.error('Ошибка парсинга пользователя:', error);
        return false;
      }
    }
    
    return currentUser && currentUser.role === 'admin';
  };

  if (!checkAdminAccess()) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg text-center">
          <div className="text-6xl mb-4">🚫</div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            Доступ запрещен
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Для доступа к админ-панели требуются права администратора
          </p>
          <div className="mt-4">
            <button 
              onClick={() => window.location.href = '/'}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              Вернуться на главную
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Заголовок */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
            🛡️ Админ-панель ФинансГид
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Добро пожаловать, <span className="font-semibold text-blue-600 dark:text-blue-400">{user?.name}</span>! 
            Управляйте пользователями и следите за статистикой системы.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="inline-flex items-center px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs font-medium rounded-full">
              ✅ Подключено к MongoDB Atlas
            </span>
            <span className="inline-flex items-center px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium rounded-full">
              🔐 JWT авторизация
            </span>
            <span className="inline-flex items-center px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-xs font-medium rounded-full">
              👑 Права администратора
            </span>
          </div>
        </div>

        {/* Табы */}
        <div className="mb-6">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'stats', label: '📊 Статистика системы', icon: '📊' },
                { id: 'users', label: '👥 Управление пользователями', icon: '👥' },
                { id: 'database', label: '🗄️ База данных', icon: '🗄️' },
                { id: 'settings', label: '⚙️ Настройки системы', icon: '⚙️' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-3 px-4 border-b-2 font-medium text-sm transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:border-gray-300'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Контент табов */}
        {activeTab === 'stats' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">📊 Статистика платформы</h2>
            
            {loading ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">⏳</div>
                <p className="text-gray-600 dark:text-gray-300">Загрузка статистики...</p>
              </div>
            ) : stats ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Карточки статистики */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                        Всего пользователей
                      </p>
                      <p className="text-3xl font-bold text-gray-800 dark:text-white">
                        {stats.totalUsers}
                      </p>
                    </div>
                    <div className="text-4xl">👥</div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                        Активные (7 дней)
                      </p>
                      <p className="text-3xl font-bold text-green-600">
                        {stats.activeUsers}
                      </p>
                    </div>
                    <div className="text-4xl">✅</div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                        С целями накопления
                      </p>
                      <p className="text-3xl font-bold text-blue-600">
                        {stats.usersWithGoals}
                      </p>
                    </div>
                    <div className="text-4xl">🎯</div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                        Средний доход
                      </p>
                      <p className="text-3xl font-bold text-yellow-600">
                        {stats.averageIncome.toLocaleString('ru-RU')} ₽
                      </p>
                    </div>
                    <div className="text-4xl">💰</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">❌</div>
                <p className="text-gray-600 dark:text-gray-300">Ошибка загрузки статистики</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'users' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">👥 Управление пользователями</h2>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Полный контроль над учетными записями: редактирование, назначение ролей, удаление
                </p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowCreateAdmin(true)}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200"
                >
                  <span>👑</span>
                  <span>Создать админа</span>
                </button>
                <button
                  onClick={loadUsers}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200"
                >
                  <span>🔄</span>
                  <span>Обновить</span>
                </button>
              </div>
            </div>

            {/* Поиск */}
            <div className="mb-6 flex gap-4">
              <input
                type="text"
                placeholder="Поиск по имени или email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
              />
              <button
                onClick={searchUsers}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
              >
                🔍 Поиск
              </button>
              <button
                onClick={() => { setSearchQuery(''); loadUsers(); }}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg"
              >
                Сбросить
              </button>
            </div>

            {/* Таблица пользователей */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Пользователь
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Роль
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Статус
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Доход
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Действия
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {users.map((userItem) => (
                    <tr key={userItem._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="text-2xl mr-3">
                            {userItem.role === 'admin' ? '👑' : '👤'}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {userItem.name}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {userItem.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          userItem.role === 'admin' 
                            ? 'bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-200'
                            : 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-200'
                        }`}>
                          {userItem.role === 'admin' ? 'Админ' : 'Пользователь'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          userItem.isActive 
                            ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200'
                            : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-200'
                        }`}>
                          {userItem.isActive ? 'Активен' : 'Заблокирован'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {userItem.financialData?.monthlyIncome > 0 
                          ? `${userItem.financialData.monthlyIncome.toLocaleString('ru-RU')} ₽`
                          : 'Не указан'
                        }
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setEditingUser(userItem)}
                            className="bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-lg transition-colors duration-200 flex items-center space-x-1"
                            title="Редактировать пользователя"
                          >
                            <span>✏️</span>
                            <span>Изменить</span>
                          </button>
                          {userItem.role !== 'admin' && (
                            <button
                              onClick={() => updateUser(userItem._id, { role: 'admin' })}
                              className="bg-purple-100 hover:bg-purple-200 dark:bg-purple-900 dark:hover:bg-purple-800 text-purple-600 dark:text-purple-400 px-3 py-1 rounded-lg transition-colors duration-200 flex items-center space-x-1"
                              title="Сделать администратором"
                            >
                              <span>👑</span>
                              <span>Админ</span>
                            </button>
                          )}
                          {userItem.role === 'admin' && userItem._id !== user?.id && (
                            <button
                              onClick={() => updateUser(userItem._id, { role: 'user' })}
                              className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-400 px-3 py-1 rounded-lg transition-colors duration-200 flex items-center space-x-1"
                              title="Снять права администратора"
                            >
                              <span>👤</span>
                              <span>Юзер</span>
                            </button>
                          )}
                          <button
                            onClick={() => updateUser(userItem._id, { isActive: !userItem.isActive })}
                            className={`px-3 py-1 rounded-lg transition-colors duration-200 flex items-center space-x-1 ${
                              userItem.isActive 
                                ? 'bg-red-100 hover:bg-red-200 dark:bg-red-900 dark:hover:bg-red-800 text-red-600 dark:text-red-400' 
                                : 'bg-green-100 hover:bg-green-200 dark:bg-green-900 dark:hover:bg-green-800 text-green-600 dark:text-green-400'
                            }`}
                            title={userItem.isActive ? 'Заблокировать' : 'Разблокировать'}
                          >
                            <span>{userItem.isActive ? '🔒' : '🔓'}</span>
                            <span>{userItem.isActive ? 'Блок' : 'Актив'}</span>
                          </button>
                          {userItem._id !== user?.id && (
                            <button
                              onClick={() => {
                                if (window.confirm(`⚠️ ВНИМАНИЕ! Вы уверены, что хотите НАВСЕГДА удалить пользователя "${userItem.name}"?\n\nЭто действие необратимо! Все данные пользователя будут потеряны.`)) {
                                  deleteUser(userItem._id);
                                }
                              }}
                              className="bg-red-100 hover:bg-red-200 dark:bg-red-900 dark:hover:bg-red-800 text-red-600 dark:text-red-400 px-3 py-1 rounded-lg transition-colors duration-200 flex items-center space-x-1"
                              title="Удалить из базы данных навсегда"
                            >
                              <span>🗑️</span>
                              <span>Удалить</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Пагинация */}
            {pagination.totalPages > 1 && (
              <div className="mt-6 flex justify-center space-x-2">
                <button
                  disabled={!pagination.hasPrev}
                  onClick={() => loadUsers(pagination.currentPage - 1)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50"
                >
                  ← Предыдущая
                </button>
                <span className="px-4 py-2 text-gray-600 dark:text-gray-300">
                  Страница {pagination.currentPage} из {pagination.totalPages}
                </span>
                <button
                  disabled={!pagination.hasNext}
                  onClick={() => loadUsers(pagination.currentPage + 1)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50"
                >
                  Следующая →
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'database' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">🗄️ База данных</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Информация о базе данных */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center">
                  <span className="text-2xl mr-2">🏢</span>
                  Информация о БД
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">Тип базы:</span>
                    <span className="font-medium text-gray-800 dark:text-white">MongoDB Atlas</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">Коллекции:</span>
                    <span className="font-medium text-gray-800 dark:text-white">
                      {dbStats ? `${dbStats.collections} коллекций` : 'users, tests'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">Подключение:</span>
                    <span className="inline-flex items-center px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs font-medium rounded-full">
                      ✅ Активно
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">Регион:</span>
                    <span className="font-medium text-gray-800 dark:text-white">EU (Ireland)</span>
                  </div>
                </div>
              </div>

              {/* Операции с БД */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center">
                  <span className="text-2xl mr-2">⚡</span>
                  Операции с БД
                </h3>
                <div className="space-y-3">
                  <button 
                    onClick={exportData}
                    disabled={loading}
                    className="w-full text-left p-3 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 border border-blue-200 dark:border-blue-800 rounded-lg transition-colors duration-200 disabled:opacity-50"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-blue-800 dark:text-blue-200">📊 Экспорт данных</span>
                      <span className="text-blue-600 dark:text-blue-400">{loading ? '⏳' : '→'}</span>
                    </div>
                    <span className="text-sm text-blue-600 dark:text-blue-400">Скачать базу в JSON формате</span>
                  </button>
                  
                  <button 
                    onClick={optimizeDatabase}
                    disabled={loading}
                    className="w-full text-left p-3 bg-yellow-50 dark:bg-yellow-900/20 hover:bg-yellow-100 dark:hover:bg-yellow-900/40 border border-yellow-200 dark:border-yellow-800 rounded-lg transition-colors duration-200 disabled:opacity-50"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-yellow-800 dark:text-yellow-200">🔄 Оптимизация</span>
                      <span className="text-yellow-600 dark:text-yellow-400">{loading ? '⏳' : '→'}</span>
                    </div>
                    <span className="text-sm text-yellow-600 dark:text-yellow-400">Очистка устаревших данных</span>
                  </button>
                  
                  <button 
                    onClick={getDatabaseStats}
                    disabled={loading}
                    className="w-full text-left p-3 bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/40 border border-purple-200 dark:border-purple-800 rounded-lg transition-colors duration-200 disabled:opacity-50"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-purple-800 dark:text-purple-200">📋 Статистика БД</span>
                      <span className="text-purple-600 dark:text-purple-400">{loading ? '⏳' : '→'}</span>
                    </div>
                    <span className="text-sm text-purple-600 dark:text-purple-400">Размер коллекций и индексы</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Журнал системных операций */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center">
                <span className="text-2xl mr-2">📋</span>
                Последние операции
              </h3>
              <div className="space-y-2">
                {[
                  { time: '14:32', action: 'Создан пользователь "Весна 25"', type: 'success' },
                  { time: '14:30', action: 'Создан администратор "Администратор"', type: 'info' },
                  { time: '14:25', action: 'Подключение к MongoDB Atlas установлено', type: 'success' },
                  { time: '14:20', action: 'Система запущена', type: 'info' }
                ].map((log, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <span className="text-sm text-gray-500 dark:text-gray-400 font-mono">{log.time}</span>
                    <span className={`w-2 h-2 rounded-full ${
                      log.type === 'success' ? 'bg-green-500' : 
                      log.type === 'info' ? 'bg-blue-500' : 'bg-yellow-500'
                    }`}></span>
                    <span className="text-sm text-gray-700 dark:text-gray-300 flex-1">{log.action}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">⚙️ Настройки системы</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Финансовые настройки */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center">
                  <span className="text-2xl mr-2">💰</span>
                  Финансовые настройки
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Правило распределения бюджета
                    </label>
                    <select className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white">
                      <option>50-25-15-10 (Mark Tilbury)</option>
                      <option>50-30-20 (Классическое)</option>
                      <option>60-20-20 (Агрессивное)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Валюта по умолчанию
                    </label>
                    <select className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white">
                      <option>RUB (Российский рубль)</option>
                      <option>USD (Доллар США)</option>
                      <option>EUR (Евро)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Системные настройки */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center">
                  <span className="text-2xl mr-2">🔧</span>
                  Системные настройки
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300">Регистрация новых пользователей</span>
                    <button 
                      onClick={() => toggleSetting('registration')}
                      disabled={loading}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors disabled:opacity-50 ${
                        systemSettings.registration ? 'bg-green-600' : 'bg-gray-200 dark:bg-gray-600'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        systemSettings.registration ? 'translate-x-6' : 'translate-x-1'
                      }`}></span>
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300">API ЦБ РФ</span>
                    <button 
                      onClick={() => toggleSetting('cbrApi')}
                      disabled={loading}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors disabled:opacity-50 ${
                        systemSettings.cbrApi ? 'bg-green-600' : 'bg-gray-200 dark:bg-gray-600'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        systemSettings.cbrApi ? 'translate-x-6' : 'translate-x-1'
                      }`}></span>
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300">Автоматические уведомления</span>
                    <button 
                      onClick={() => toggleSetting('notifications')}
                      disabled={loading}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors disabled:opacity-50 ${
                        systemSettings.notifications ? 'bg-green-600' : 'bg-gray-200 dark:bg-gray-600'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        systemSettings.notifications ? 'translate-x-6' : 'translate-x-1'
                      }`}></span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Действия системы */}
            <div className="mt-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center">
                <span className="text-2xl mr-2">🚨</span>
                Опасные действия
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button 
                  onClick={clearDatabase}
                  disabled={loading}
                  className="p-4 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 transition-colors duration-200 disabled:opacity-50"
                >
                  <div className="text-2xl mb-2">{loading ? '⏳' : '🗑️'}</div>
                  <div className="font-medium mb-1">Очистить БД</div>
                  <div className="text-xs">Удалить все данные</div>
                </button>
                <button 
                  onClick={resetSystem}
                  disabled={loading}
                  className="p-4 bg-yellow-50 dark:bg-yellow-900/20 hover:bg-yellow-100 dark:hover:bg-yellow-900/40 border border-yellow-200 dark:border-yellow-800 rounded-lg text-yellow-700 dark:text-yellow-300 transition-colors duration-200 disabled:opacity-50"
                >
                  <div className="text-2xl mb-2">{loading ? '⏳' : '🔄'}</div>
                  <div className="font-medium mb-1">Сброс системы</div>
                  <div className="text-xs">Вернуть к начальным настройкам</div>
                </button>
                <button 
                  onClick={exportData}
                  disabled={loading}
                  className="p-4 bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/40 border border-purple-200 dark:border-purple-800 rounded-lg text-purple-700 dark:text-purple-300 transition-colors duration-200 disabled:opacity-50"
                >
                  <div className="text-2xl mb-2">{loading ? '⏳' : '📤'}</div>
                  <div className="font-medium mb-1">Экспорт всех данных</div>
                  <div className="text-xs">Скачать полную копию</div>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Модальное окно редактирования пользователя */}
      {editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
              Редактировать пользователя
            </h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              updateUser(editingUser._id, {
                name: formData.get('name'),
                email: formData.get('email'),
                role: formData.get('role'),
                isActive: formData.get('isActive') === 'true'
              });
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Имя</label>
                  <input
                    name="name"
                    defaultValue={editingUser.name}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                  <input
                    name="email"
                    type="email"
                    defaultValue={editingUser.email}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Роль</label>
                  <select
                    name="role"
                    defaultValue={editingUser.role}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                  >
                    <option value="user">Пользователь</option>
                    <option value="admin">Админ</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Статус</label>
                  <select
                    name="isActive"
                    defaultValue={editingUser.isActive.toString()}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                  >
                    <option value="true">Активен</option>
                    <option value="false">Заблокирован</option>
                  </select>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                >
                  Сохранить
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Модальное окно создания админа */}
      {showCreateAdmin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
              Создать администратора
            </h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              createFirstAdmin({
                name: formData.get('name'),
                email: formData.get('email'),
                password: formData.get('password')
              });
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Имя</label>
                  <input
                    name="name"
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                  <input
                    name="email"
                    type="email"
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Пароль</label>
                  <input
                    name="password"
                    type="password"
                    required
                    minLength="6"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowCreateAdmin(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
                >
                  Создать
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard; 