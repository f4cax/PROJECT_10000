import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from '../utils/translations';
import PWAStatus from '../components/common/PWAStatus';

const AdminDashboard = () => {
  const { user, token } = useAuth();
  const { t } = useTranslation();
  const { FullStatus } = PWAStatus();
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
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

    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    const response = await fetch(`${apiUrl}${url}`, {
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
      alert(t('statsLoadError') + ': ' + error.message);
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
      alert('User loading error: ' + error.message);
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
      alert('Search error: ' + error.message);
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
      alert(t('userUpdated'));
      loadUsers();
      setEditingUser(null);
    } catch (error) {
      console.error('Ошибка обновления:', error);
      alert('Update error: ' + error.message);
    }
  };

  const deleteUser = async (userId) => {
    try {
      await apiCall(`/api/admin/users/${userId}`, { method: 'DELETE' });
      alert('✅ ' + t('userDeleted'));
      loadUsers();
    } catch (error) {
      console.error('Ошибка удаления:', error);
      alert('❌ Delete error: ' + error.message);
    }
  };

  const createFirstAdmin = async (adminData) => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      await fetch(`${apiUrl}/api/admin/create-first-admin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(adminData),
      });
      alert('✅ Admin created!');
      setShowCreateAdmin(false);
      loadUsers();
    } catch (error) {
      console.error('Ошибка создания админа:', error);
      alert('❌ Admin creation error: ' + error.message);
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
      
      alert('✅ ' + t('dataExported'));
    } catch (error) {
      console.error('Ошибка экспорта:', error);
      alert('❌ Export error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const optimizeDatabase = async () => {
    if (!window.confirm(t('confirmOptimize'))) return;
    
    try {
      setLoading(true);
      await apiCall('/api/admin/optimize', { method: 'POST' });
      alert('✅ ' + t('dbOptimized'));
    } catch (error) {
      console.error('Ошибка оптимизации:', error);
      alert('❌ Optimization error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const getDatabaseStats = async () => {
    try {
      setLoading(true);
      const data = await apiCall('/api/admin/db-stats');
      setDbStats(data);
      alert('✅ ' + t('dbStatsUpdated'));
    } catch (error) {
      console.error('Ошибка получения статистики БД:', error);
      alert('❌ DB stats error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const clearDatabase = async () => {
    const confirmation = window.prompt(t('confirmClearDB'));
    
    if (confirmation !== 'УДАЛИТЬ ВСЕ ДАННЫЕ') {
      alert(t('operationCanceled'));
      return;
    }

    try {
      setLoading(true);
      await apiCall('/api/admin/clear-database', { method: 'DELETE' });
      alert('✅ ' + t('dbCleared'));
      // Перезагружаем данные
      loadStats();
      loadUsers();
    } catch (error) {
      console.error('Ошибка очистки БД:', error);
      alert('❌ DB clear error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const resetSystem = async () => {
    const confirmation = window.prompt(t('confirmSystemReset'));
    
    if (confirmation !== 'СБРОС СИСТЕМЫ') {
      alert(t('operationCanceled'));
      return;
    }

    try {
      setLoading(true);
      await apiCall('/api/admin/reset-system', { method: 'POST' });
      alert('✅ ' + t('systemReset'));
      window.location.href = '/';
    } catch (error) {
      console.error('Ошибка сброса системы:', error);
      alert('❌ System reset error: ' + error.message);
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
      
      alert('✅ ' + t('settingUpdated'));
    } catch (error) {
      console.error('Ошибка обновления настроек:', error);
      alert('❌ Settings update error: ' + error.message);
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
            {t('accessDenied')}
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            {t('adminRightsRequired')}
          </p>
          <div className="mt-4">
            <button 
              onClick={() => window.location.href = '/'}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              {t('backToHome')}
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
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-2">
            🛡️ {t('adminPanelTitle')}
          </h1>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-300">
            {t('welcomeAdmin')} <span className="font-semibold text-blue-600 dark:text-blue-400">{user?.name}</span>! 
            {t('manageUsersStats')}
          </p>
          <div className="mt-3 md:mt-4 flex flex-wrap gap-1 md:gap-2">
            <span className="inline-flex items-center px-2 md:px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs font-medium rounded-full">
              ✅ {t('connectedMongoDB')}
            </span>
            <span className="inline-flex items-center px-2 md:px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium rounded-full">
              🔐 {t('jwtAuth')}
            </span>
            <span className="inline-flex items-center px-2 md:px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-xs font-medium rounded-full">
              👑 {t('adminRights')}
            </span>
          </div>
        </div>

        {/* Табы */}
        <div className="mb-4 md:mb-6">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex overflow-x-auto scrollbar-hide space-x-2 md:space-x-8 pb-1">
              {[
                { id: 'stats', label: t('systemStats').split(' ')[0], icon: '📊', fullLabel: t('systemStats') },
                { id: 'users', label: t('userManagement').split(' ')[0], icon: '👥', fullLabel: t('userManagement') },
                { id: 'database', label: t('database'), icon: '🗄️', fullLabel: t('database') },
                { id: 'settings', label: t('systemSettings').split(' ')[0], icon: '⚙️', fullLabel: t('systemSettings') }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-shrink-0 py-2 md:py-3 px-3 md:px-4 border-b-2 font-medium text-xs md:text-sm transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:border-gray-300'
                  }`}
                >
                  <span className="mr-1 md:mr-2">{tab.icon}</span>
                  <span className="hidden sm:inline">{tab.fullLabel}</span>
                  <span className="sm:hidden">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Контент табов */}
        {activeTab === 'stats' && (
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white mb-4 md:mb-6">📊 {t('platformStats')}</h2>
            
            {loading ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">⏳</div>
                <p className="text-gray-600 dark:text-gray-300">{t('loadingStats')}</p>
              </div>
            ) : stats ? (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
                {/* Карточки статистики */}
                <div className="bg-white dark:bg-gray-800 p-3 md:p-6 rounded-lg shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-300">
                        {t('totalUsers')}
                      </p>
                      <p className="text-xl md:text-3xl font-bold text-gray-800 dark:text-white">
                        {stats.totalUsers}
                      </p>
                    </div>
                    <div className="text-2xl md:text-4xl">👥</div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-3 md:p-6 rounded-lg shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-300">
                        {t('activeUsers7Days')}
                      </p>
                      <p className="text-xl md:text-3xl font-bold text-green-600">
                        {stats.activeUsers}
                      </p>
                    </div>
                    <div className="text-2xl md:text-4xl">✅</div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-3 md:p-6 rounded-lg shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-300">
                        {t('usersWithGoals')}
                      </p>
                      <p className="text-xl md:text-3xl font-bold text-blue-600">
                        {stats.usersWithGoals}
                      </p>
                    </div>
                    <div className="text-2xl md:text-4xl">🎯</div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-3 md:p-6 rounded-lg shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-300">
                        {t('averageIncome')}
                      </p>
                      <p className="text-lg md:text-3xl font-bold text-yellow-600">
                        {stats.averageIncome.toLocaleString('ru-RU')} ₽
                      </p>
                    </div>
                    <div className="text-2xl md:text-4xl">💰</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">❌</div>
                <p className="text-gray-600 dark:text-gray-300">{t('statsLoadError')}</p>
              </div>
            )}

            {/* PWA Статус */}
            <div className="mt-6 md:mt-8">
              <FullStatus showDetailed={true} />
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 md:mb-6 space-y-3 sm:space-y-0">
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white">👥 {t('userManagementTitle')}</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {t('fullControlDescription')}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                <button
                  onClick={() => setShowCreateAdmin(true)}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors duration-200 text-sm"
                >
                  <span>👑</span>
                  <span>{t('createAdminButton')}</span>
                </button>
                <button
                  onClick={loadUsers}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors duration-200 text-sm"
                >
                  <span>🔄</span>
                  <span>{t('refreshButton')}</span>
                </button>
              </div>
            </div>

            {/* Поиск */}
            <div className="mb-4 md:mb-6 flex flex-col sm:flex-row gap-2 sm:gap-4">
              <input
                type="text"
                placeholder={t('searchPlaceholderAdmin')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-white text-sm"
              />
              <div className="flex space-x-2">
              <button
                onClick={searchUsers}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
              >
                🔍 {t('searchButtonAdmin')}
              </button>
              <button
                onClick={() => { setSearchQuery(''); loadUsers(); }}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm"
              >
                {t('resetButtonAdmin')}
              </button>
              </div>
            </div>

            {/* Responsive таблица пользователей */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
              {/* Мобильная версия (карточки) */}
              <div className="block md:hidden">
                {users.map((userItem) => (
                  <div key={userItem._id} className="p-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center">
                        <div className="text-2xl mr-3">
                          {userItem.role === 'admin' ? '👑' : '👤'}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {userItem.name}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {userItem.email}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col space-y-1 items-end">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          userItem.role === 'admin' 
                            ? 'bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-200'
                            : 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-200'
                        }`}>
                          {userItem.role === 'admin' ? t('adminRole') : t('userRole')}
                        </span>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          userItem.isActive 
                            ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200'
                            : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-200'
                        }`}>
                          {userItem.isActive ? t('activeStatus') : t('blockedStatus')}
                        </span>
                      </div>
                    </div>
                    <div className="mb-3">
                      <span className="text-xs text-gray-500 dark:text-gray-400">{t('income')}: </span>
                      <span className="text-sm text-gray-900 dark:text-white">
                        {userItem.financialData?.monthlyIncome > 0 
                          ? `${userItem.financialData.monthlyIncome.toLocaleString('ru-RU')} ₽`
                          : t('notSpecifiedIncome')
                        }
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      <button
                        onClick={() => setEditingUser(userItem)}
                        className="bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800 text-blue-600 dark:text-blue-400 px-2 py-1 rounded text-xs"
                      >
                        ✏️ {t('editButton')}
                      </button>
                      {userItem.role !== 'admin' && (
                        <button
                          onClick={() => updateUser(userItem._id, { role: 'admin' })}
                          className="bg-purple-100 hover:bg-purple-200 dark:bg-purple-900 dark:hover:bg-purple-800 text-purple-600 dark:text-purple-400 px-2 py-1 rounded text-xs"
                        >
                          👑 {t('adminButton')}
                        </button>
                      )}
                      <button
                        onClick={() => updateUser(userItem._id, { isActive: !userItem.isActive })}
                        className={`px-2 py-1 rounded text-xs ${
                          userItem.isActive 
                            ? 'bg-red-100 hover:bg-red-200 dark:bg-red-900 dark:hover:bg-red-800 text-red-600 dark:text-red-400' 
                            : 'bg-green-100 hover:bg-green-200 dark:bg-green-900 dark:hover:bg-green-800 text-green-600 dark:text-green-400'
                        }`}
                      >
                        {userItem.isActive ? `🔒 ${t('blockButton')}` : `🔓 ${t('unblockButton')}`}
                      </button>
                      {userItem._id !== user?.id && (
                        <button
                          onClick={() => {
                            if (window.confirm(t('confirmDeleteUser', { name: userItem.name }))) {
                              deleteUser(userItem._id);
                            }
                          }}
                          className="bg-red-100 hover:bg-red-200 dark:bg-red-900 dark:hover:bg-red-800 text-red-600 dark:text-red-400 px-2 py-1 rounded text-xs"
                        >
                          🗑️ {t('deleteButton')}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop версия (таблица) */}
              <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {t('user')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {t('role')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {t('status')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {t('income')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {t('actions')}
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
                          {userItem.role === 'admin' ? t('adminRole') : t('userRole')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          userItem.isActive 
                            ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200'
                            : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-200'
                        }`}>
                          {userItem.isActive ? t('activeStatus') : t('blockedStatus')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {userItem.financialData?.monthlyIncome > 0 
                          ? `${userItem.financialData.monthlyIncome.toLocaleString('ru-RU')} ₽`
                          : t('notSpecifiedIncome')
                        }
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setEditingUser(userItem)}
                            className="bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-lg transition-colors duration-200 flex items-center space-x-1"
                            title={t('editUser')}
                          >
                            <span>✏️</span>
                            <span>{t('editButton')}</span>
                          </button>
                          {userItem.role !== 'admin' && (
                            <button
                              onClick={() => updateUser(userItem._id, { role: 'admin' })}
                              className="bg-purple-100 hover:bg-purple-200 dark:bg-purple-900 dark:hover:bg-purple-800 text-purple-600 dark:text-purple-400 px-3 py-1 rounded-lg transition-colors duration-200 flex items-center space-x-1"
                              title={t('createAdmin')}
                            >
                              <span>👑</span>
                              <span>{t('adminButton')}</span>
                            </button>
                          )}
                          {userItem.role === 'admin' && userItem._id !== user?.id && (
                            <button
                              onClick={() => updateUser(userItem._id, { role: 'user' })}
                              className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-400 px-3 py-1 rounded-lg transition-colors duration-200 flex items-center space-x-1"
                              title={t('userRole')}
                            >
                              <span>👤</span>
                              <span>{t('userButton')}</span>
                            </button>
                          )}
                          <button
                            onClick={() => updateUser(userItem._id, { isActive: !userItem.isActive })}
                            className={`px-3 py-1 rounded-lg transition-colors duration-200 flex items-center space-x-1 ${
                              userItem.isActive 
                                ? 'bg-red-100 hover:bg-red-200 dark:bg-red-900 dark:hover:bg-red-800 text-red-600 dark:text-red-400' 
                                : 'bg-green-100 hover:bg-green-200 dark:bg-green-900 dark:hover:bg-green-800 text-green-600 dark:text-green-400'
                            }`}
                            title={userItem.isActive ? t('blockButton') : t('unblockButton')}
                          >
                            <span>{userItem.isActive ? '🔒' : '🔓'}</span>
                            <span>{userItem.isActive ? t('blockButton') : t('unblockButton')}</span>
                          </button>
                          {userItem._id !== user?.id && (
                            <button
                              onClick={() => {
                                if (window.confirm(t('confirmDeleteUserLong', { name: userItem.name }))) {
                                  deleteUser(userItem._id);
                                }
                              }}
                              className="bg-red-100 hover:bg-red-200 dark:bg-red-900 dark:hover:bg-red-800 text-red-600 dark:text-red-400 px-3 py-1 rounded-lg transition-colors duration-200 flex items-center space-x-1"
                              title={t('deleteUser')}
                            >
                              <span>🗑️</span>
                              <span>{t('deleteButton')}</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            </div>

            {/* Пагинация */}
            {pagination.totalPages > 1 && (
              <div className="mt-4 md:mt-6 flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-2">
                <button
                  disabled={!pagination.hasPrev}
                  onClick={() => loadUsers(pagination.currentPage - 1)}
                  className="w-full sm:w-auto px-3 md:px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 text-sm"
                >
                  ← {t('previousPage')}
                </button>
                <span className="px-3 md:px-4 py-2 text-sm text-gray-600 dark:text-gray-300 text-center">
                  {t('pageOf', { current: pagination.currentPage, total: pagination.totalPages })}
                </span>
                <button
                  disabled={!pagination.hasNext}
                  onClick={() => loadUsers(pagination.currentPage + 1)}
                  className="w-full sm:w-auto px-3 md:px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 text-sm"
                >
                  {t('nextPage')} →
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'database' && (
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white mb-4 md:mb-6">🗄️ {t('databaseTitle')}</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
              {/* Информация о базе данных */}
              <div className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-lg shadow-lg">
                <h3 className="text-base md:text-lg font-bold text-gray-800 dark:text-white mb-3 md:mb-4 flex items-center">
                  <span className="text-xl md:text-2xl mr-2">🏢</span>
                  {t('databaseInfo')}
                </h3>
                <div className="space-y-2 md:space-y-3">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-sm text-gray-600 dark:text-gray-400">{t('databaseType')}</span>
                    <span className="font-medium text-sm text-gray-800 dark:text-white">MongoDB Atlas</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-sm text-gray-600 dark:text-gray-400">{t('collections')}</span>
                    <span className="font-medium text-sm text-gray-800 dark:text-white">
                      {dbStats ? `${dbStats.collections} коллекций` : 'users, tests'}
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-sm text-gray-600 dark:text-gray-400">{t('connection')}</span>
                    <span className="inline-flex items-center px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs font-medium rounded-full">
                      ✅ {t('connectionActive')}
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">{t('region')}</span>
                    <span className="font-medium text-sm text-gray-800 dark:text-white">EU (Ireland)</span>
                  </div>
                </div>
              </div>

              {/* Операции с БД */}
              <div className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-lg shadow-lg">
                <h3 className="text-base md:text-lg font-bold text-gray-800 dark:text-white mb-3 md:mb-4 flex items-center">
                  <span className="text-xl md:text-2xl mr-2">⚡</span>
                  {t('databaseOperations')}
                </h3>
                <div className="space-y-2 md:space-y-3">
                  <button 
                    onClick={exportData}
                    disabled={loading}
                    className="w-full text-left p-3 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 border border-blue-200 dark:border-blue-800 rounded-lg transition-colors duration-200 disabled:opacity-50"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm md:text-base text-blue-800 dark:text-blue-200">📊 {t('exportDataButton')}</span>
                      <span className="text-blue-600 dark:text-blue-400">{loading ? '⏳' : '→'}</span>
                    </div>
                    <span className="text-xs md:text-sm text-blue-600 dark:text-blue-400">{t('exportDataDesc')}</span>
                  </button>
                  
                  <button 
                    onClick={optimizeDatabase}
                    disabled={loading}
                    className="w-full text-left p-3 bg-yellow-50 dark:bg-yellow-900/20 hover:bg-yellow-100 dark:hover:bg-yellow-900/40 border border-yellow-200 dark:border-yellow-800 rounded-lg transition-colors duration-200 disabled:opacity-50"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm md:text-base text-yellow-800 dark:text-yellow-200">🔄 {t('optimizationButton')}</span>
                      <span className="text-yellow-600 dark:text-yellow-400">{loading ? '⏳' : '→'}</span>
                    </div>
                    <span className="text-xs md:text-sm text-yellow-600 dark:text-yellow-400">{t('optimizationDesc')}</span>
                  </button>
                  
                  <button 
                    onClick={getDatabaseStats}
                    disabled={loading}
                    className="w-full text-left p-3 bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/40 border border-purple-200 dark:border-purple-800 rounded-lg transition-colors duration-200 disabled:opacity-50"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm md:text-base text-purple-800 dark:text-purple-200">📋 {t('dbStatsButton')}</span>
                      <span className="text-purple-600 dark:text-purple-400">{loading ? '⏳' : '→'}</span>
                    </div>
                    <span className="text-xs md:text-sm text-purple-600 dark:text-purple-400">{t('dbStatsDesc')}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Журнал системных операций */}
            <div className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-lg shadow-lg">
              <h3 className="text-base md:text-lg font-bold text-gray-800 dark:text-white mb-3 md:mb-4 flex items-center">
                <span className="text-xl md:text-2xl mr-2">📋</span>
                {t('recentOperations')}
              </h3>
              <div className="space-y-2">
                {[
                  { time: '14:32', action: 'Создан пользователь "Весна 25"', type: 'success' },
                  { time: '14:30', action: 'Создан администратор "Администратор"', type: 'info' },
                  { time: '14:25', action: 'Подключение к MongoDB Atlas установлено', type: 'success' },
                  { time: '14:20', action: 'Система запущена', type: 'info' }
                ].map((log, index) => (
                  <div key={index} className="flex items-center space-x-2 md:space-x-3 p-2 md:p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <span className="text-xs md:text-sm text-gray-500 dark:text-gray-400 font-mono flex-shrink-0">{log.time}</span>
                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      log.type === 'success' ? 'bg-green-500' : 
                      log.type === 'info' ? 'bg-blue-500' : 'bg-yellow-500'
                    }`}></span>
                    <span className="text-xs md:text-sm text-gray-700 dark:text-gray-300 flex-1 break-words">{log.action}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white mb-4 md:mb-6">⚙️ {t('systemSettingsTitle')}</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              {/* Финансовые настройки */}
              <div className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-lg shadow-lg">
                <h3 className="text-base md:text-lg font-bold text-gray-800 dark:text-white mb-3 md:mb-4 flex items-center">
                  <span className="text-xl md:text-2xl mr-2">💰</span>
                  {t('financialSettings')}
                </h3>
                <div className="space-y-3 md:space-y-4">
                  <div>
                    <label className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('budgetRule')}
                    </label>
                    <select className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white">
                      <option>50-25-15-10 (Mark Tilbury)</option>
                      <option>50-30-20 (Классическое)</option>
                      <option>60-20-20 (Агрессивное)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('defaultCurrency')}
                    </label>
                    <select className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white">
                      <option>RUB (Российский рубль)</option>
                      <option>USD (Доллар США)</option>
                      <option>EUR (Евро)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Системные настройки */}
              <div className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-lg shadow-lg">
                <h3 className="text-base md:text-lg font-bold text-gray-800 dark:text-white mb-3 md:mb-4 flex items-center">
                  <span className="text-xl md:text-2xl mr-2">🔧</span>
                  {t('systemSettingsSection')}
                </h3>
                <div className="space-y-3 md:space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs md:text-sm text-gray-700 dark:text-gray-300 pr-2">{t('userRegistration')}</span>
                    <button 
                      onClick={() => toggleSetting('registration')}
                      disabled={loading}
                      className={`relative inline-flex h-5 w-9 md:h-6 md:w-11 items-center rounded-full transition-colors disabled:opacity-50 flex-shrink-0 ${
                        systemSettings.registration ? 'bg-green-600' : 'bg-gray-200 dark:bg-gray-600'
                      }`}
                    >
                      <span className={`inline-block h-3 w-3 md:h-4 md:w-4 transform rounded-full bg-white transition-transform ${
                        systemSettings.registration ? 'translate-x-5 md:translate-x-6' : 'translate-x-1'
                      }`}></span>
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs md:text-sm text-gray-700 dark:text-gray-300 pr-2">{t('cbrApiSetting')}</span>
                    <button 
                      onClick={() => toggleSetting('cbrApi')}
                      disabled={loading}
                      className={`relative inline-flex h-5 w-9 md:h-6 md:w-11 items-center rounded-full transition-colors disabled:opacity-50 flex-shrink-0 ${
                        systemSettings.cbrApi ? 'bg-green-600' : 'bg-gray-200 dark:bg-gray-600'
                      }`}
                    >
                      <span className={`inline-block h-3 w-3 md:h-4 md:w-4 transform rounded-full bg-white transition-transform ${
                        systemSettings.cbrApi ? 'translate-x-5 md:translate-x-6' : 'translate-x-1'
                      }`}></span>
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs md:text-sm text-gray-700 dark:text-gray-300 pr-2">{t('autoNotifications')}</span>
                    <button 
                      onClick={() => toggleSetting('notifications')}
                      disabled={loading}
                      className={`relative inline-flex h-5 w-9 md:h-6 md:w-11 items-center rounded-full transition-colors disabled:opacity-50 flex-shrink-0 ${
                        systemSettings.notifications ? 'bg-green-600' : 'bg-gray-200 dark:bg-gray-600'
                      }`}
                    >
                      <span className={`inline-block h-3 w-3 md:h-4 md:w-4 transform rounded-full bg-white transition-transform ${
                        systemSettings.notifications ? 'translate-x-5 md:translate-x-6' : 'translate-x-1'
                      }`}></span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Действия системы */}
            <div className="mt-4 md:mt-6 bg-white dark:bg-gray-800 p-4 md:p-6 rounded-lg shadow-lg">
              <h3 className="text-base md:text-lg font-bold text-gray-800 dark:text-white mb-3 md:mb-4 flex items-center">
                <span className="text-xl md:text-2xl mr-2">🚨</span>
                {t('dangerousActions')}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                <button 
                  onClick={clearDatabase}
                  disabled={loading}
                  className="p-3 md:p-4 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 transition-colors duration-200 disabled:opacity-50"
                >
                  <div className="text-xl md:text-2xl mb-1 md:mb-2">{loading ? '⏳' : '🗑️'}</div>
                  <div className="font-medium mb-1 text-sm md:text-base">{t('clearDatabaseButton')}</div>
                  <div className="text-xs">{t('clearDatabaseDesc')}</div>
                </button>
                <button 
                  onClick={resetSystem}
                  disabled={loading}
                  className="p-3 md:p-4 bg-yellow-50 dark:bg-yellow-900/20 hover:bg-yellow-100 dark:hover:bg-yellow-900/40 border border-yellow-200 dark:border-yellow-800 rounded-lg text-yellow-700 dark:text-yellow-300 transition-colors duration-200 disabled:opacity-50"
                >
                  <div className="text-xl md:text-2xl mb-1 md:mb-2">{loading ? '⏳' : '🔄'}</div>
                  <div className="font-medium mb-1 text-sm md:text-base">{t('systemResetButton')}</div>
                  <div className="text-xs">{t('systemResetDesc')}</div>
                </button>
                <button 
                  onClick={exportData}
                  disabled={loading}
                  className="p-3 md:p-4 bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/40 border border-purple-200 dark:border-purple-800 rounded-lg text-purple-700 dark:text-purple-300 transition-colors duration-200 disabled:opacity-50"
                >
                  <div className="text-xl md:text-2xl mb-1 md:mb-2">{loading ? '⏳' : '📤'}</div>
                  <div className="font-medium mb-1 text-sm md:text-base">{t('fullDataExportButton')}</div>
                  <div className="text-xs">{t('fullDataExportDesc')}</div>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Модальное окно редактирования пользователя */}
      {editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-base md:text-lg font-bold text-gray-800 dark:text-white mb-3 md:mb-4">
              {t('editUserTitle')}
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
              <div className="space-y-3 md:space-y-4">
                <div>
                  <label className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('nameField')}</label>
                  <input
                    name="name"
                    defaultValue={editingUser.name}
                    className="block w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('emailField')}</label>
                  <input
                    name="email"
                    type="email"
                    defaultValue={editingUser.email}
                    className="block w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('roleField')}</label>
                  <select
                    name="role"
                    defaultValue={editingUser.role}
                    className="block w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                  >
                    <option value="user">{t('userOption')}</option>
                    <option value="admin">{t('adminOption')}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('statusField')}</label>
                  <select
                    name="isActive"
                    defaultValue={editingUser.isActive.toString()}
                    className="block w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                  >
                    <option value="true">{t('activeOption')}</option>
                    <option value="false">{t('blockedOption')}</option>
                  </select>
                </div>
              </div>
              <div className="mt-4 md:mt-6 flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="w-full sm:w-auto px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 text-sm"
                >
                  {t('cancelButton')}
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm"
                >
                  {t('saveButton')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Модальное окно создания админа */}
      {showCreateAdmin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-base md:text-lg font-bold text-gray-800 dark:text-white mb-3 md:mb-4">
              {t('createAdminTitle')}
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
              <div className="space-y-3 md:space-y-4">
                <div>
                  <label className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('nameField')}</label>
                  <input
                    name="name"
                    required
                    className="block w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('emailField')}</label>
                  <input
                    name="email"
                    type="email"
                    required
                    className="block w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('passwordField')}</label>
                  <input
                    name="password"
                    type="password"
                    required
                    minLength="6"
                    className="block w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                  />
                </div>
              </div>
              <div className="mt-4 md:mt-6 flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4">
                <button
                  type="button"
                  onClick={() => setShowCreateAdmin(false)}
                  className="w-full sm:w-auto px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 text-sm"
                >
                  {t('cancelButton')}
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm"
                >
                  {t('createButton')}
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