import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from '../utils/translations';

const ProfilePage = () => {
  const { user, token, updateUser } = useAuth();
  const { t, language, changeLanguage } = useTranslation();
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

  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: false,
    emailUpdates: true
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

      setSettings({
        notifications: user.settings?.notifications ?? true,
        darkMode: user.settings?.darkMode ?? false,
        emailUpdates: user.settings?.emailUpdates ?? true
      });
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
      
      // Обновляем язык если изменился
      if (basicInfo.language !== language) {
        changeLanguage(basicInfo.language);
      }
      
      setMessage(t('profileUpdated'));
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
      
      setMessage(t('financialDataUpdated'));
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Ошибка обновления финансовых данных:', error);
      setMessage('Ошибка обновления: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSettingsSave = async () => {
    try {
      setLoading(true);
      await apiCall('/api/user/settings', {
        method: 'PUT',
        body: JSON.stringify(settings)
      });
      
      setMessage(t('settingsUpdated'));
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Ошибка обновления настроек:', error);
      setMessage('Ошибка обновления: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const calculateCompoundInterest = (principal, monthlyContribution, annualRate, years) => {
    const monthlyRate = annualRate / 12 / 100;
    const totalMonths = years * 12;
    
    // Формула для сложного процента с ежемесячными взносами
    const futureValue = principal * Math.pow(1 + monthlyRate, totalMonths) +
      monthlyContribution * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate);
    
    return Math.round(futureValue);
  };

  const investmentProjections = [1, 3, 5, 10].map(years => ({
    years,
    amount: calculateCompoundInterest(
      financialData.investments,
      financialData.monthlyIncome * 0.15, // 15% от дохода на инвестиции
      8, // 8% годовых
      years
    )
  }));

  const tabs = [
    { id: 'basic', name: t('basicInfo'), icon: '👤' },
    { id: 'financial', name: t('financialData'), icon: '💰' },
    { id: 'projections', name: t('investmentProjections'), icon: '📈' },
    { id: 'settings', name: t('settings'), icon: '⚙️' }
  ];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Заголовок */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
            👤 {t('userProfile')}
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            {t('manageProfileDesc')}
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
                {t('basicInfo')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('name')}
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
                    {t('email')}
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
                    {t('age')}
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
                    {t('region')}
                  </label>
                  <select
                    value={basicInfo.region}
                    onChange={(e) => setBasicInfo({...basicInfo, region: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">{t('selectRegion')}</option>
                    <option value="moscow">Москва</option>
                    <option value="spb">Санкт-Петербург</option>
                    <option value="central">Центральный ФО</option>
                    <option value="northwest">Северо-Западный ФО</option>
                    <option value="south">Южный ФО</option>
                    <option value="north-caucasus">Северо-Кавказский ФО</option>
                    <option value="volga">Приволжский ФО</option>
                    <option value="ural">Уральский ФО</option>
                    <option value="siberia">Сибирский ФО</option>
                    <option value="far-east">Дальневосточный ФО</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('language')}
                  </label>
                  <select
                    value={basicInfo.language}
                    onChange={(e) => setBasicInfo({...basicInfo, language: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="ru">Русский</option>
                    <option value="en">English</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('currency')}
                  </label>
                  <select
                    value={basicInfo.currency}
                    onChange={(e) => setBasicInfo({...basicInfo, currency: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="RUB">₽ Рубль</option>
                    <option value="USD">$ Доллар</option>
                    <option value="EUR">€ Евро</option>
                  </select>
                </div>
              </div>
              <div className="mt-6">
                <button
                  onClick={handleBasicInfoSave}
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  {loading ? t('saving') : t('save')}
                </button>
              </div>
            </div>
          )}

          {/* Финансовые данные */}
          {activeTab === 'financial' && (
            <div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6">
                {t('financialData')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('monthlyIncome')} (₽)
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
                    {t('totalAssets')} (₽)
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
                    {t('monthlyExpenses')} (₽)
                  </label>
                  <input
                    type="number"
                    value={financialData.monthlyExpenses}
                    onChange={(e) => setFinancialData({...financialData, monthlyExpenses: Number(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('currentInvestments')} (₽)
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
                    {t('investmentType')}
                  </label>
                  <select
                    value={financialData.investmentType}
                    onChange={(e) => setFinancialData({...financialData, investmentType: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="index-funds">{t('indexFunds')}</option>
                    <option value="stocks">{t('individualStocks')}</option>
                    <option value="bonds">{t('bonds')}</option>
                    <option value="mixed">{t('mixedPortfolio')}</option>
                    <option value="crypto">{t('cryptocurrency')}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('goalAmount')} (₽)
                  </label>
                  <input
                    type="number"
                    value={financialData.goalAmount}
                    onChange={(e) => setFinancialData({...financialData, goalAmount: Number(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('financialGoal')}
                  </label>
                  <textarea
                    value={financialData.financialGoal}
                    onChange={(e) => setFinancialData({...financialData, financialGoal: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder={t('financialGoalPlaceholder')}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('goalDeadline')}
                  </label>
                  <input
                    type="date"
                    value={financialData.goalDeadline}
                    onChange={(e) => setFinancialData({...financialData, goalDeadline: e.target.value})}
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
                  {loading ? t('saving') : t('save')}
                </button>
              </div>
            </div>
          )}

          {/* Прогнозы инвестиций */}
          {activeTab === 'projections' && (
            <div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6">
                {t('investmentProjections')}
              </h2>
              <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  {t('projectionNote')} 8% {t('annualReturn')} {t('monthlyContribution')} 15% {t('fromIncome')}.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {investmentProjections.map(projection => (
                  <div key={projection.years} className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
                    <div className="text-3xl font-bold mb-2">
                      {projection.years} {projection.years === 1 ? t('year') : t('years')}
                    </div>
                    <div className="text-xl font-semibold mb-1">
                      {projection.amount.toLocaleString('ru-RU')} ₽
                    </div>
                    <div className="text-sm opacity-80">
                      {t('projectedValue')}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Калькулятор сложного процента */}
              <div className="mt-8 p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                  {t('compoundInterestCalculator')}
                </h3>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <p className="mb-2">📊 {t('currentInvestments')}: {financialData.investments.toLocaleString('ru-RU')} ₽</p>
                  <p className="mb-2">💰 {t('monthlyContribution')}: {(financialData.monthlyIncome * 0.15).toLocaleString('ru-RU')} ₽</p>
                  <p>📈 {t('expectedReturn')}: 8% {t('annually')}</p>
                </div>
              </div>
            </div>
          )}

          {/* Настройки */}
          {activeTab === 'settings' && (
            <div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6">
                {t('settingsAndPreferences')}
              </h2>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t('enableNotifications')}
                    </label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {t('notificationsDesc')}
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.notifications}
                    onChange={(e) => setSettings({...settings, notifications: e.target.checked})}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t('darkMode')}
                    </label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {t('darkModeDesc')}
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.darkMode}
                    onChange={(e) => setSettings({...settings, darkMode: e.target.checked})}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t('emailUpdates')}
                    </label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {t('emailUpdatesDesc')}
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.emailUpdates}
                    onChange={(e) => setSettings({...settings, emailUpdates: e.target.checked})}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                  {t('dangerZone')}
                </h3>
                <div className="space-y-4">
                  <button className="w-full text-left p-4 border border-yellow-300 dark:border-yellow-600 rounded-lg hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition-colors">
                    <div className="font-medium text-yellow-700 dark:text-yellow-400">
                      {t('resetFinancialData')}
                    </div>
                    <div className="text-sm text-yellow-600 dark:text-yellow-500">
                      {t('resetFinancialDataDesc')}
                    </div>
                  </button>
                  
                  <button className="w-full text-left p-4 border border-red-300 dark:border-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                    <div className="font-medium text-red-700 dark:text-red-400">
                      {t('deleteAccount')}
                    </div>
                    <div className="text-sm text-red-600 dark:text-red-500">
                      {t('deleteAccountDesc')}
                    </div>
                  </button>
                </div>
              </div>
              
              <div className="mt-6">
                <button
                  onClick={handleSettingsSave}
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  {loading ? t('saving') : t('save')}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage; 