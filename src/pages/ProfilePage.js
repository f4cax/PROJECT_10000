import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';

const ProfilePage = () => {
  const { user, token, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('basic');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [message, setMessage] = useState('');

  // Состояния для форм
  const [basicInfo, setBasicInfo] = useState({
    name: '',
    email: '',
    age: '',
    region: '',
    language: 'ru',
    currency: 'RUB'
  });

  const [financialData, setFinancialData] = useState({
    monthlyIncome: 0,
    totalAssets: 0,
    monthlyExpenses: 0,
    investments: 0,
    investmentType: 'index-funds',
    financialGoal: '',
    goalAmount: 0,
    goalDeadline: ''
  });

  // Полный список регионов России
  const russianRegions = [
    { value: '', label: 'Выберите регион' },
    { value: 'moscow', label: 'Москва' },
    { value: 'spb', label: 'Санкт-Петербург' },
    { value: 'adygea', label: 'Республика Адыгея' },
    { value: 'altai', label: 'Республика Алтай' },
    { value: 'bashkortostan', label: 'Республика Башкортостан' },
    { value: 'buryatia', label: 'Республика Бурятия' },
    { value: 'dagestan', label: 'Республика Дагестан' },
    { value: 'ingushetia', label: 'Республика Ингушетия' },
    { value: 'kabardino-balkaria', label: 'Кабардино-Балкарская Республика' },
    { value: 'kalmykia', label: 'Республика Калмыкия' },
    { value: 'karachay-cherkessia', label: 'Карачаево-Черкесская Республика' },
    { value: 'karelia', label: 'Республика Карелия' },
    { value: 'komi', label: 'Республика Коми' },
    { value: 'crimea', label: 'Республика Крым' },
    { value: 'mari-el', label: 'Республика Марий Эл' },
    { value: 'mordovia', label: 'Республика Мордовия' },
    { value: 'sakha', label: 'Республика Саха (Якутия)' },
    { value: 'north-ossetia', label: 'Республика Северная Осетия — Алания' },
    { value: 'tatarstan', label: 'Республика Татарстан' },
    { value: 'tuva', label: 'Республика Тыва' },
    { value: 'udmurtia', label: 'Удмуртская Республика' },
    { value: 'khakassia', label: 'Республика Хакасия' },
    { value: 'chechnya', label: 'Чеченская Республика' },
    { value: 'chuvashia', label: 'Чувашская Республика' },
    { value: 'altai-krai', label: 'Алтайский край' },
    { value: 'krasnodar-krai', label: 'Краснодарский край' },
    { value: 'krasnoyarsk-krai', label: 'Красноярский край' },
    { value: 'primorsky-krai', label: 'Приморский край' },
    { value: 'stavropol-krai', label: 'Ставропольский край' },
    { value: 'khabarovsk-krai', label: 'Хабаровский край' },
    { value: 'amur', label: 'Амурская область' },
    { value: 'arkhangelsk', label: 'Архангельская область' },
    { value: 'astrakhan', label: 'Астраханская область' },
    { value: 'belgorod', label: 'Белгородская область' },
    { value: 'bryansk', label: 'Брянская область' },
    { value: 'vladimir', label: 'Владимирская область' },
    { value: 'volgograd', label: 'Волгоградская область' },
    { value: 'vologda', label: 'Вологодская область' },
    { value: 'voronezh', label: 'Воронежская область' },
    { value: 'ivanovo', label: 'Ивановская область' },
    { value: 'irkutsk', label: 'Иркутская область' },
    { value: 'kaliningrad', label: 'Калининградская область' },
    { value: 'kaluga', label: 'Калужская область' },
    { value: 'kamchatka', label: 'Камчатский край' },
    { value: 'kemerovo', label: 'Кемеровская область' },
    { value: 'kirov', label: 'Кировская область' },
    { value: 'kostroma', label: 'Костромская область' },
    { value: 'kurgan', label: 'Курганская область' },
    { value: 'kursk', label: 'Курская область' },
    { value: 'leningrad', label: 'Ленинградская область' },
    { value: 'lipetsk', label: 'Липецкая область' },
    { value: 'magadan', label: 'Магаданская область' },
    { value: 'moscow-region', label: 'Московская область' },
    { value: 'murmansk', label: 'Мурманская область' },
    { value: 'nizhny-novgorod', label: 'Нижегородская область' },
    { value: 'novgorod', label: 'Новгородская область' },
    { value: 'novosibirsk', label: 'Новосибирская область' },
    { value: 'omsk', label: 'Омская область' },
    { value: 'orenburg', label: 'Оренбургская область' },
    { value: 'oryol', label: 'Орловская область' },
    { value: 'penza', label: 'Пензенская область' },
    { value: 'perm', label: 'Пермский край' },
    { value: 'pskov', label: 'Псковская область' },
    { value: 'rostov', label: 'Ростовская область' },
    { value: 'ryazan', label: 'Рязанская область' },
    { value: 'samara', label: 'Самарская область' },
    { value: 'saratov', label: 'Саратовская область' },
    { value: 'sakhalin', label: 'Сахалинская область' },
    { value: 'sverdlovsk', label: 'Свердловская область' },
    { value: 'smolensk', label: 'Смоленская область' },
    { value: 'tambov', label: 'Тамбовская область' },
    { value: 'tver', label: 'Тверская область' },
    { value: 'tomsk', label: 'Томская область' },
    { value: 'tula', label: 'Тульская область' },
    { value: 'tyumen', label: 'Тюменская область' },
    { value: 'ulyanovsk', label: 'Ульяновская область' },
    { value: 'chelyabinsk', label: 'Челябинская область' },
    { value: 'zabaykalsky', label: 'Забайкальский край' },
    { value: 'yaroslavl', label: 'Ярославская область' },
    { value: 'nenetsky', label: 'Ненецкий автономный округ' },
    { value: 'khanty-mansi', label: 'Ханты-Мансийский автономный округ — Югра' },
    { value: 'chukotka', label: 'Чукотский автономный округ' },
    { value: 'yamalo-nenets', label: 'Ямало-Ненецкий автономный округ' },
    { value: 'sevastopol', label: 'Севастополь' },
    { value: 'jewish', label: 'Еврейская автономная область' }
  ];

  // API вызов без зависимостей, которые могут часто меняться
  const apiCall = useCallback(async (url, options = {}) => {
    const currentToken = token || localStorage.getItem('authToken');
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    
    const response = await fetch(`${apiUrl}${url}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${currentToken}`,
        ...options.headers,
      },
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      try {
        const error = JSON.parse(errorText);
        throw new Error(error.error || 'Server error');
      } catch (e) {
        throw new Error(`Server error: ${response.status}`);
      }
    }
    
    return response.json();
  }, [token]);

  // Загрузка данных при инициализации - только при наличии пользователя и токена
  useEffect(() => {
    if (!user || !token) {
      setInitialLoading(false);
      return;
    }

    let isMounted = true; // Флаг для предотвращения обновления состояния после размонтирования

    const loadUserData = async () => {
      try {
        setInitialLoading(true);
        const userData = await apiCall('/api/user/profile');
        
        if (!isMounted) return; // Проверяем, что компонент еще смонтирован
        
        // Обновляем локальные состояния
        setBasicInfo({
          name: userData.name || '',
          email: userData.email || '',
          age: userData.age || '',
          region: userData.region || '',
          language: userData.language || 'ru',
          currency: userData.currency || 'RUB'
        });

        if (userData.financialData) {
          setFinancialData({
            monthlyIncome: userData.financialData.monthlyIncome || 0,
            totalAssets: userData.financialData.totalAssets || 0,
            monthlyExpenses: userData.financialData.monthlyExpenses || 0,
            investments: userData.financialData.investments || 0,
            investmentType: userData.financialData.investmentType || 'index-funds',
            financialGoal: userData.financialData.financialGoal || '',
            goalAmount: userData.financialData.goalAmount || 0,
            goalDeadline: userData.financialData.goalDeadline || ''
          });
        }

        // Обновляем контекст
        if (updateUser) {
          updateUser(userData);
        }
        
      } catch (error) {
        if (isMounted) {
          console.error('Ошибка загрузки данных пользователя:', error);
          setMessage('Ошибка загрузки данных: ' + error.message);
        }
      } finally {
        if (isMounted) {
          setInitialLoading(false);
        }
      }
    };

    // Если у пользователя уже есть данные, используем их, иначе загружаем с сервера
    if (user.name || user.email) {
      setBasicInfo({
        name: user.name || '',
        email: user.email || '',
        age: user.age || '',
        region: user.region || '',
        language: user.language || 'ru',
        currency: user.currency || 'RUB'
      });

      if (user.financialData) {
        setFinancialData({
          monthlyIncome: user.financialData.monthlyIncome || 0,
          totalAssets: user.financialData.totalAssets || 0,
          monthlyExpenses: user.financialData.monthlyExpenses || 0,
          investments: user.financialData.investments || 0,
          investmentType: user.financialData.investmentType || 'index-funds',
          financialGoal: user.financialData.financialGoal || '',
          goalAmount: user.financialData.goalAmount || 0,
          goalDeadline: user.financialData.goalDeadline || ''
        });
      }
      setInitialLoading(false);
    } else {
      loadUserData();
    }

    return () => {
      isMounted = false; // Очистка при размонтировании
    };
  }, [user, token, apiCall, updateUser]); // Добавляем все используемые зависимости

  // Функция для ручного обновления данных
  const refetchUserData = useCallback(async () => {
    try {
      setInitialLoading(true);
      const userData = await apiCall('/api/user/profile');
      
      setBasicInfo({
        name: userData.name || '',
        email: userData.email || '',
        age: userData.age || '',
        region: userData.region || '',
        language: userData.language || 'ru',
        currency: userData.currency || 'RUB'
      });

      if (userData.financialData) {
        setFinancialData({
          monthlyIncome: userData.financialData.monthlyIncome || 0,
          totalAssets: userData.financialData.totalAssets || 0,
          monthlyExpenses: userData.financialData.monthlyExpenses || 0,
          investments: userData.financialData.investments || 0,
          investmentType: userData.financialData.investmentType || 'index-funds',
          financialGoal: userData.financialData.financialGoal || '',
          goalAmount: userData.financialData.goalAmount || 0,
          goalDeadline: userData.financialData.goalDeadline || ''
        });
      }

      if (updateUser) {
        updateUser(userData);
      }
      
    } catch (error) {
      console.error('Ошибка загрузки данных пользователя:', error);
      setMessage('Ошибка загрузки данных: ' + error.message);
    } finally {
      setInitialLoading(false);
    }
  }, [apiCall, updateUser]);

  const handleBasicInfoSave = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiCall('/api/user/profile', {
        method: 'PUT',
        body: JSON.stringify(basicInfo)
      });
      
      const updatedUser = response.user || response;
      
      if (updateUser) {
        updateUser(updatedUser);
      }
      
      setMessage('Профиль обновлен');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Ошибка обновления профиля:', error);
      setMessage('Ошибка обновления: ' + error.message);
    } finally {
      setLoading(false);
    }
  }, [apiCall, basicInfo, updateUser]);

  const handleFinancialDataSave = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiCall('/api/user/financial-data', {
        method: 'PUT',
        body: JSON.stringify(financialData)
      });
      
      if (updateUser && response.financialData) {
        const updatedUser = { ...user, financialData: response.financialData };
        updateUser(updatedUser);
      }
      
      setMessage('Финансовые данные обновлены');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Ошибка обновления финансовых данных:', error);
      setMessage('Ошибка обновления: ' + error.message);
    } finally {
      setLoading(false);
    }
  }, [apiCall, financialData, updateUser, user]);

  const calculateCompoundInterest = (principal, monthlyContribution, annualRate, years) => {
    const monthlyRate = annualRate / 12 / 100;
    const totalMonths = years * 12;
    
    const futureValue = principal * Math.pow(1 + monthlyRate, totalMonths) +
      monthlyContribution * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate);
    
    return Math.round(futureValue);
  };

  const investmentProjections = [1, 3, 5, 10].map(years => ({
    years,
    amount: calculateCompoundInterest(
      financialData.investments,
      financialData.monthlyIncome * 0.15,
      8,
      years
    )
  }));

  const tabs = [
    { id: 'basic', name: 'Основная информация', icon: '👤' },
    { id: 'financial', name: 'Финансовые данные', icon: '💰' },
    { id: 'projections', name: 'Прогнозы инвестиций', icon: '📈' }
  ];

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            Требуется авторизация
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Войдите в систему, чтобы получить доступ к профилю
          </p>
        </div>
      </div>
    );
  }

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
            Загрузка профиля...
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Получаем актуальные данные с сервера
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Заголовок */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
            👤 Профиль пользователя
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Управляйте своими данными и настройками
          </p>
          {basicInfo.name && (
            <p className="text-lg text-blue-600 dark:text-blue-400 mt-2">
              Добро пожаловать, {basicInfo.name}!
            </p>
          )}
        </div>

        {/* Сообщения */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.includes('Ошибка') || message.includes('error') 
              ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
              : 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
          }`}>
            {message}
          </div>
        )}

        {/* Табы */}
        <div className="mb-6">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-3 px-4 border-b-2 font-medium text-sm transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Контент табов */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          {/* Базовая информация */}
          {activeTab === 'basic' && (
            <div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6">
                Основная информация
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Имя
                  </label>
                  <input
                    type="text"
                    value={basicInfo.name}
                    onChange={(e) => setBasicInfo({...basicInfo, name: e.target.value})}
                    placeholder="Введите ваше имя"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={basicInfo.email}
                    onChange={(e) => setBasicInfo({...basicInfo, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Возраст
                  </label>
                  <input
                    type="number"
                    value={basicInfo.age}
                    onChange={(e) => setBasicInfo({...basicInfo, age: e.target.value})}
                    min="16"
                    max="100"
                    placeholder="Ваш возраст"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Регион
                  </label>
                  <select
                    value={basicInfo.region}
                    onChange={(e) => setBasicInfo({...basicInfo, region: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    {russianRegions.map(region => (
                      <option key={region.value} value={region.value}>
                        {region.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mt-6 flex flex-wrap gap-4">
                <button
                  onClick={handleBasicInfoSave}
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  {loading ? 'Сохранение...' : 'Сохранить'}
                </button>
                <button
                  onClick={refetchUserData}
                  disabled={loading || initialLoading}
                  className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  🔄 Обновить данные
                </button>
              </div>
            </div>
          )}

          {/* Финансовые данные */}
          {activeTab === 'financial' && (
            <div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6">
                Финансовые данные
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Месячный доход (₽)
                  </label>
                  <input
                    type="number"
                    value={financialData.monthlyIncome}
                    onChange={(e) => setFinancialData({...financialData, monthlyIncome: Number(e.target.value)})}
                    min="0"
                    step="1000"
                    placeholder="0"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Общие активы (₽)
                  </label>
                  <input
                    type="number"
                    value={financialData.totalAssets}
                    onChange={(e) => setFinancialData({...financialData, totalAssets: Number(e.target.value)})}
                    min="0"
                    step="10000"
                    placeholder="0"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Текущие инвестиции (₽)
                  </label>
                  <input
                    type="number"
                    value={financialData.investments}
                    onChange={(e) => setFinancialData({...financialData, investments: Number(e.target.value)})}
                    min="0"
                    step="5000"
                    placeholder="0"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Сумма цели (₽)
                  </label>
                  <input
                    type="number"
                    value={financialData.goalAmount}
                    onChange={(e) => setFinancialData({...financialData, goalAmount: Number(e.target.value)})}
                    min="0"
                    step="10000"
                    placeholder="0"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
              <div className="mt-6">
                <button
                  onClick={handleFinancialDataSave}
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  {loading ? 'Сохранение...' : 'Сохранить'}
                </button>
              </div>
            </div>
          )}

          {/* Прогнозы инвестиций */}
          {activeTab === 'projections' && (
            <div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6">
                Прогнозы инвестиций
              </h2>
              <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  📊 Расчет основан на доходности 8% годовых и ежемесячном пополнении 15% от дохода.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {investmentProjections.map(projection => (
                  <div key={projection.years} className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
                    <div className="text-3xl font-bold mb-2">
                      {projection.years} {projection.years === 1 ? 'год' : 'лет'}
                    </div>
                    <div className="text-xl font-semibold mb-1">
                      {projection.amount.toLocaleString('ru-RU')} ₽
                    </div>
                    <div className="text-sm opacity-80">
                      Прогнозируемая стоимость
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage; 