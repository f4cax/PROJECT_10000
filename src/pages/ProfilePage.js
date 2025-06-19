import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const ProfilePage = () => {
  const { user, token } = useAuth();
  const [activeTab, setActiveTab] = useState('basic');
  const [loading, setLoading] = useState(false);
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

  // Загрузка данных пользователя при инициализации
  useEffect(() => {
    if (user) {
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
    }
  }, [user]);

  const apiCall = async (url, options = {}) => {
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
  };

  const handleBasicInfoSave = async () => {
    try {
      setLoading(true);
      await apiCall('/api/user/profile', {
        method: 'PUT',
        body: JSON.stringify(basicInfo)
      });
      
      setMessage('Профиль обновлен');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Ошибка обновления профиля:', error);
      setMessage('Ошибка обновления: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFinancialDataSave = async () => {
    try {
      setLoading(true);
      await apiCall('/api/user/financial-data', {
        method: 'PUT',
        body: JSON.stringify(financialData)
      });
      
      setMessage('Финансовые данные обновлены');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Ошибка обновления финансовых данных:', error);
      setMessage('Ошибка обновления: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Заголовок */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
            👤 Профиль пользователя
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Управляйте своими данными и настройками
          </p>
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
                    <option value="">Выберите регион</option>
                    <option value="moscow">Москва</option>
                    <option value="spb">Санкт-Петербург</option>
                    <option value="central">Центральный ФО</option>
                    <option value="northwest">Северо-Западный ФО</option>
                  </select>
                </div>
              </div>
              <div className="mt-6">
                <button
                  onClick={handleBasicInfoSave}
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  {loading ? 'Сохранение...' : 'Сохранить'}
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