import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from '../utils/translations';

export default function AssetsPage() {
  const { t } = useTranslation();
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [demoMode, setDemoMode] = useState(false);
  const [showAddAsset, setShowAddAsset] = useState(false);
  const [newAsset, setNewAsset] = useState({
    type: 'cash',
    name: '',
    amount: 0,
    currency: 'RUB'
  });

  // Демо-данные для показа возможностей
  const demoProfile = {
    name: 'Демо Пользователь',
    monthlyIncome: 120000,
    totalAssets: 2500000,
    investments: 1500000,
    goalAmount: 5000000,
    currency: 'RUB'
  };

  const [customAssets, setCustomAssets] = useState([
    {
      id: 'savings',
      type: 'cash',
      name: 'Сбережения на счете',
      amount: 350000,
      currency: 'RUB',
      icon: '💳',
      color: 'green'
    },
    {
      id: 'deposit',
      type: 'cash',
      name: 'Срочный вклад',
      amount: 500000,
      currency: 'RUB',
      icon: '🏦',
      color: 'blue'
    }
  ]);

  // Загрузка данных пользователя
  useEffect(() => {
    loadUserProfile();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        // Включаем демо-режим, если пользователь не авторизован
        setDemoMode(true);
        setUserProfile(demoProfile);
        setLoading(false);
        return;
      }

      const response = await fetch('/api/user/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const profile = await response.json();
        setUserProfile(profile);
        setDemoMode(false);
      } else {
        // Если профиль не загрузился, включаем демо-режим
        setDemoMode(true);
        setUserProfile(demoProfile);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      // При ошибке также включаем демо-режим
      setDemoMode(true);
      setUserProfile(demoProfile);
    } finally {
      setLoading(false);
    }
  };



  // Расчёт активов на основе данных профиля
  const assetsData = useMemo(() => {
    if (!userProfile) return [];

    const result = [];

    // Банковские счета и наличные
    if (userProfile.totalAssets) {
      const cashAmount = userProfile.totalAssets * 0.3; // 30% в кеше
      result.push({
        id: 'cash',
        type: 'cash',
        nameKey: 'bankingAndCash',
        amount: cashAmount,
        currency: userProfile.currency || 'RUB',
        icon: '💰',
        color: 'green'
      });
    }

    // Инвестиции в акции
    if (userProfile.investments) {
      const stocksAmount = userProfile.investments * 0.6; // 60% в акциях
      result.push({
        id: 'stocks',
        type: 'stocks',
        nameKey: 'stocksAndETF',
        amount: stocksAmount,
        currency: userProfile.currency || 'RUB',
        icon: '📈',
        color: 'blue'
      });

      // Криптовалюты
      const cryptoAmount = userProfile.investments * 0.1; // 10% в крипте
      result.push({
        id: 'crypto',
        type: 'crypto',
        nameKey: 'cryptocurrency',
        amount: cryptoAmount,
        currency: userProfile.currency || 'RUB',
        icon: '₿',
        color: 'orange'
      });
    }

    // Недвижимость (если доход высокий)
    if (userProfile.monthlyIncome > 150000) {
      const realEstateAmount = userProfile.totalAssets * 0.4;
      result.push({
        id: 'realestate',
        type: 'realestate',
        nameKey: 'realEstate',
        amount: realEstateAmount,
        currency: userProfile.currency || 'RUB',
        icon: '🏠',
        color: 'purple'
      });
    }

    return result;
  }, [userProfile]);

  // Добавляем переводы к данным активов
  const assets = [...assetsData.map(asset => ({
    ...asset,
    name: t(asset.nameKey)
  })), ...customAssets];

  // Расчёт общей стоимости активов
  const totalValue = assets.reduce((sum, asset) => sum + asset.amount, 0);

  // Расчёт с учётом инфляции
  const inflationRate = 0.065; // 6.5% инфляция в России
  const valueAfterInflation = {
    oneYear: totalValue / (1 + inflationRate),
    threeYears: totalValue / Math.pow(1 + inflationRate, 3),
    fiveYears: totalValue / Math.pow(1 + inflationRate, 5)
  };

  // Рекомендуемое распределение активов
  const recommendedAllocation = [
    { type: 'stocks', nameKey: 'stocks', percentage: 50, color: 'blue' },
    { type: 'bonds', nameKey: 'bonds', percentage: 25, color: 'green' },
    { type: 'realestate', nameKey: 'realEstate', percentage: 15, color: 'purple' },
    { type: 'cash', nameKey: 'cash', percentage: 10, color: 'gray' }
  ];

  const formatCurrency = (amount, currency = 'RUB') => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  // Добавление нового актива
  const handleAddAsset = () => {
    if (newAsset.name && newAsset.amount > 0) {
      const asset = {
        id: Date.now().toString(),
        type: newAsset.type,
        name: newAsset.name,
        amount: parseFloat(newAsset.amount),
        currency: newAsset.currency,
        icon: getAssetIcon(newAsset.type),
        color: getAssetColor(newAsset.type)
      };
      
      setCustomAssets(prev => [...prev, asset]);
      setNewAsset({ type: 'cash', name: '', amount: 0, currency: 'RUB' });
      setShowAddAsset(false);
    }
  };

  const getAssetIcon = (type) => {
    const icons = {
      cash: '💰',
      stocks: '📈',
      crypto: '₿',
      realestate: '🏠',
      business: '🏢',
      bonds: '📊',
      other: '💼'
    };
    return icons[type] || '💼';
  };

  const getAssetColor = (type) => {
    const colors = {
      cash: 'green',
      stocks: 'blue',
      crypto: 'orange',
      realestate: 'purple',
      business: 'indigo',
      bonds: 'teal',
      other: 'gray'
    };
    return colors[type] || 'gray';
  };

  // Удаление актива (только для пользовательских активов)
  const handleRemoveAsset = (assetId) => {
    setCustomAssets(prev => prev.filter(asset => asset.id !== assetId));
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto space-y-8 fade-in">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            💰 {t('assetsTitle') || 'Активы'}
          </h1>
          <div className="animate-spin text-4xl">⏳</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 fade-in">
      {/* Заголовок */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          💰 {t('assetsTitle') || 'Подсчёт всех активов'}
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          {t('assetsSubtitle') || 'Учёт и анализ всех ваших активов с поправкой на инфляцию'}
        </p>
        {demoMode && (
          <div className="mt-4 p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg border border-blue-300 dark:border-blue-700">
            <p className="text-blue-800 dark:text-blue-300 text-sm">
              📊 Демо-режим: Показаны примеры данных. Авторизуйтесь и заполните профиль для работы с реальными данными.
            </p>
          </div>
        )}
      </div>

      {/* Общая статистика */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card text-center bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
          <h3 className="text-lg font-semibold text-green-900 dark:text-green-300 mb-2">
            {t('totalAssetsValue') || 'Общая стоимость активов'}
          </h3>
          <div className="text-3xl font-bold text-green-600 dark:text-green-400">
            {formatCurrency(totalValue)}
          </div>
        </div>

        <div className="card text-center">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {t('numberOfAssets') || 'Количество активов'}
          </h3>
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            {assets.length}
          </div>
        </div>

        <div className="card text-center">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {t('monthlyIncome') || 'Месячный доход'}
          </h3>
          <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
            {formatCurrency(userProfile?.monthlyIncome || 0)}
          </div>
        </div>

        <div className="card text-center">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {t('savingsGoal') || 'Цель накоплений'}
          </h3>
          <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
            {formatCurrency(userProfile?.goalAmount || 0)}
          </div>
        </div>
      </div>

      {/* Список активов */}
      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            📊 {t('yourAssets') || 'Ваши активы'}
          </h2>
          <button
            onClick={() => setShowAddAsset(true)}
            className="btn-primary text-sm"
          >
            ➕ {t('addAsset') || 'Добавить актив'}
          </button>
        </div>
        
        <div className="space-y-4">
          {assets.map(asset => {
            const percentage = totalValue > 0 ? (asset.amount / totalValue * 100) : 0;
            const isCustom = customAssets.some(ca => ca.id === asset.id);
            
            return (
              <div key={asset.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="text-3xl">{asset.icon}</div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {asset.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {percentage.toFixed(1)}% {t('ofTotalPortfolio') || 'от общего портфеля'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-xl font-bold text-gray-900 dark:text-white">
                      {formatCurrency(asset.amount, asset.currency)}
                    </div>
                    <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                      <div 
                        className={`bg-${asset.color}-500 h-2 rounded-full transition-all duration-300`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  {isCustom && (
                    <button
                      onClick={() => handleRemoveAsset(asset.id)}
                      className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-1"
                      title="Удалить актив"
                    >
                      🗑️
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Модальное окно добавления актива */}
      {showAddAsset && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="card max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              ➕ {t('addNewAsset') || 'Добавить новый актив'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="label">{t('assetType') || 'Тип актива'}</label>
                <select
                  value={newAsset.type}
                  onChange={(e) => setNewAsset({...newAsset, type: e.target.value})}
                  className="input-field"
                >
                  <option value="cash">💰 {t('cash') || 'Наличные/Депозиты'}</option>
                  <option value="stocks">📈 {t('stocks') || 'Акции'}</option>
                  <option value="crypto">₿ {t('cryptocurrency') || 'Криптовалюта'}</option>
                  <option value="realestate">🏠 {t('realEstate') || 'Недвижимость'}</option>
                  <option value="business">🏢 {t('business') || 'Бизнес'}</option>
                  <option value="bonds">📊 {t('bonds') || 'Облигации'}</option>
                  <option value="other">💼 {t('other') || 'Другое'}</option>
                </select>
              </div>
              
              <div>
                <label className="label">{t('assetName') || 'Название актива'}</label>
                <input
                  type="text"
                  value={newAsset.name}
                  onChange={(e) => setNewAsset({...newAsset, name: e.target.value})}
                  className="input-field"
                  placeholder={t('assetNamePlaceholder') || 'Например: Вклад в Сбербанке'}
                />
              </div>
              
              <div>
                <label className="label">{t('amount') || 'Сумма'}</label>
                <input
                  type="number"
                  value={newAsset.amount}
                  onChange={(e) => setNewAsset({...newAsset, amount: e.target.value})}
                  className="input-field"
                  placeholder="0"
                />
              </div>
              
              <div>
                <label className="label">{t('currency') || 'Валюта'}</label>
                <select
                  value={newAsset.currency}
                  onChange={(e) => setNewAsset({...newAsset, currency: e.target.value})}
                  className="input-field"
                >
                  <option value="RUB">₽ Рубли</option>
                  <option value="USD">$ Доллары</option>
                  <option value="EUR">€ Евро</option>
                </select>
              </div>
            </div>
            
            <div className="flex space-x-4 mt-6">
              <button
                onClick={handleAddAsset}
                className="btn-primary flex-1"
                disabled={!newAsset.name || newAsset.amount <= 0}
              >
                {t('add') || 'Добавить'}
              </button>
              <button
                onClick={() => setShowAddAsset(false)}
                className="btn-secondary flex-1"
              >
                {t('cancel') || 'Отмена'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Расчёт инфляции */}
      <div className="card bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800">
        <h2 className="text-2xl font-semibold text-orange-900 dark:text-orange-300 mb-6">
          📉 {t('inflationImpact') || 'Влияние инфляции'}
        </h2>
        <p className="text-orange-700 dark:text-orange-400 mb-4">
          {t('currentInflation') || 'При текущей инфляции'} {(inflationRate * 100).toFixed(1)}% {t('assetsWillWorth') || 'ваши активы будут стоить:'}
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <h4 className="font-semibold text-orange-900 dark:text-orange-300">{t('after1Year') || 'Через 1 год'}</h4>
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {formatCurrency(valueAfterInflation.oneYear)}
            </div>
            <div className="text-sm text-orange-700 dark:text-orange-500">
              -{formatCurrency(totalValue - valueAfterInflation.oneYear)} {t('inTodaysPrices') || 'в сегодняшних ценах'}
            </div>
          </div>
          
          <div className="text-center">
            <h4 className="font-semibold text-orange-900 dark:text-orange-300">{t('after3Years') || 'Через 3 года'}</h4>
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {formatCurrency(valueAfterInflation.threeYears)}
            </div>
            <div className="text-sm text-orange-700 dark:text-orange-500">
              -{formatCurrency(totalValue - valueAfterInflation.threeYears)} {t('inTodaysPrices') || 'в сегодняшних ценах'}
            </div>
          </div>
          
          <div className="text-center">
            <h4 className="font-semibold text-orange-900 dark:text-orange-300">{t('after5Years') || 'Через 5 лет'}</h4>
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {formatCurrency(valueAfterInflation.fiveYears)}
            </div>
            <div className="text-sm text-orange-700 dark:text-orange-500">
              -{formatCurrency(totalValue - valueAfterInflation.fiveYears)} {t('inTodaysPrices') || 'в сегодняшних ценах'}
            </div>
          </div>
        </div>
      </div>

      {/* Рекомендуемое распределение */}
      <div className="card">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
          🎯 {t('recommendedAllocation') || 'Рекомендуемое распределение'}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {t('optimalPortfolioStructure') || 'Оптимальная структура портфеля'}
            </h3>
            <div className="space-y-3">
              {recommendedAllocation.map(item => (
                <div key={item.type} className="flex items-center justify-between">
                  <span className="text-gray-700 dark:text-gray-300">{t(item.nameKey) || item.nameKey}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className={`bg-${item.color}-500 h-2 rounded-full`}
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium w-8">{item.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
              💡 {t('investmentTips') || 'Советы по инвестированию'}
            </h4>
            <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
              <li>• {t('diversifyPortfolio') || 'Диверсифицируйте портфель'}</li>
              <li>• {t('regularRebalancing') || 'Регулярно ребалансируйте'}</li>
              <li>• {t('considerInflation') || 'Учитывайте инфляцию'}</li>
              <li>• {t('maxCashPercent') || 'Не держите более 15% в кеше'}</li>
              <li>• {t('indexFundsAdvice') || 'Рассмотрите индексные фонды'}</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Прогресс к цели */}
      {userProfile?.goalAmount > 0 && (
        <div className="card bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
          <h2 className="text-2xl font-semibold text-green-900 dark:text-green-300 mb-6">
            🎯 {t('goalProgress') || 'Прогресс к цели'}
          </h2>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-green-700 dark:text-green-400">
                {t('target') || 'Цель:'} {formatCurrency(userProfile.goalAmount)}
              </span>
              <span className="text-green-700 dark:text-green-400">
                {t('currentAssets') || 'Текущие активы:'} {formatCurrency(totalValue)}
              </span>
            </div>
            
            <div className="w-full bg-green-200 dark:bg-green-800 rounded-full h-4">
              <div 
                className="bg-green-500 h-4 rounded-full transition-all duration-500"
                style={{ width: `${Math.min((totalValue / userProfile.goalAmount) * 100, 100)}%` }}
              ></div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {((totalValue / userProfile.goalAmount) * 100).toFixed(1)}%
              </div>
              <p className="text-green-700 dark:text-green-400">
                {totalValue >= userProfile.goalAmount 
                  ? (t('goalAchieved') || '🎉 Цель достигнута!')
                  : `${t('remainingToSave') || 'Осталось накопить:'} ${formatCurrency(userProfile.goalAmount - totalValue)}`
                }
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 