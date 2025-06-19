import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from '../utils/translations';

export default function AssetsPage() {
  const { t } = useTranslation();
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stockPrices, setStockPrices] = useState({});
  const [newAsset, setNewAsset] = useState({
    type: 'cash',
    name: '',
    amount: 0,
    currency: 'RUB'
  });

  // Загрузка данных пользователя
  useEffect(() => {
    loadUserProfile();
    loadStockPrices();
  }, []);

  const loadUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch('/api/user/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const profile = await response.json();
        setUserProfile(profile);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStockPrices = async () => {
    try {
      const API_KEY = process.env.REACT_APP_EODHD_API_KEY || '68545cf3e0b555.23627356';
      const symbols = ['AAPL.US', 'GOOGL.US', 'MSFT.US', 'TSLA.US', 'AMZN.US', 'NVDA.US'];
      const url = `https://eodhd.com/api/real-time/${symbols[0]}?s=${symbols.slice(1).join(',')}&api_token=${API_KEY}&fmt=json`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      const prices = {};
      const stocksData = Array.isArray(data) ? data : [data];
      
      stocksData.forEach(stock => {
        if (stock && stock.code) {
          const symbol = stock.code.replace('.US', '');
          prices[symbol] = parseFloat(stock.close || stock.price || 0);
        }
      });
      
      setStockPrices(prices);
    } catch (error) {
      console.error('Error loading stock prices:', error);
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
  const assets = assetsData.map(asset => ({
    ...asset,
    name: t(asset.nameKey)
  }));

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

  const formatNumber = (num) => {
    return new Intl.NumberFormat('ru-RU').format(num);
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto space-y-8 fade-in">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            💰 {t('assets') || 'Активы'}
          </h1>
          <div className="animate-spin text-4xl">⏳</div>
        </div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="max-w-6xl mx-auto space-y-8 fade-in">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            💰 {t('assets') || 'Активы'}
          </h1>
          <div className="card text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {t('loginRequired')}
            </p>
            <button 
              onClick={() => window.location.href = '/profile'}
              className="btn-primary"
            >
              {t('goToProfile')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 fade-in">
      {/* Заголовок */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          💰 {t('assetsTitle')}
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          {t('assetsSubtitle')}
        </p>
      </div>

      {/* Общая статистика */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card text-center bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
          <h3 className="text-lg font-semibold text-green-900 dark:text-green-300 mb-2">
            {t('totalAssetsValue')}
          </h3>
          <div className="text-3xl font-bold text-green-600 dark:text-green-400">
            {formatCurrency(totalValue)}
          </div>
        </div>

        <div className="card text-center">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {t('numberOfAssets')}
          </h3>
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            {assets.length}
          </div>
        </div>

        <div className="card text-center">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {t('monthlyIncome')}
          </h3>
          <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
            {formatCurrency(userProfile.monthlyIncome || 0)}
          </div>
        </div>

        <div className="card text-center">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {t('savingsGoal')}
          </h3>
          <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
            {formatCurrency(userProfile.goalAmount || 0)}
          </div>
        </div>
      </div>

      {/* Список активов */}
      <div className="card">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
          📊 {t('yourAssets')}
        </h2>
        
        <div className="space-y-4">
          {assets.map(asset => {
            const percentage = totalValue > 0 ? (asset.amount / totalValue * 100) : 0;
            return (
              <div key={asset.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="text-3xl">{asset.icon}</div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {asset.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {percentage.toFixed(1)}{t('ofTotalPortfolio')}
                    </p>
                  </div>
                </div>
                
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
              </div>
            );
          })}
        </div>
      </div>

      {/* Расчёт инфляции */}
      <div className="card bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800">
        <h2 className="text-2xl font-semibold text-orange-900 dark:text-orange-300 mb-6">
          📉 {t('inflationImpact')}
        </h2>
        <p className="text-orange-700 dark:text-orange-400 mb-4">
          {t('currentInflation')} {(inflationRate * 100).toFixed(1)}{t('assetsWillWorth')}
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <h4 className="font-semibold text-orange-900 dark:text-orange-300">{t('after1Year')}</h4>
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {formatCurrency(valueAfterInflation.oneYear)}
            </div>
            <div className="text-sm text-orange-700 dark:text-orange-500">
              -{formatCurrency(totalValue - valueAfterInflation.oneYear)} {t('inTodaysPrices')}
            </div>
          </div>
          
          <div className="text-center">
            <h4 className="font-semibold text-orange-900 dark:text-orange-300">{t('after3Years')}</h4>
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {formatCurrency(valueAfterInflation.threeYears)}
            </div>
            <div className="text-sm text-orange-700 dark:text-orange-500">
              -{formatCurrency(totalValue - valueAfterInflation.threeYears)} {t('inTodaysPrices')}
            </div>
          </div>
          
          <div className="text-center">
            <h4 className="font-semibold text-orange-900 dark:text-orange-300">{t('after5Years')}</h4>
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {formatCurrency(valueAfterInflation.fiveYears)}
            </div>
            <div className="text-sm text-orange-700 dark:text-orange-500">
              -{formatCurrency(totalValue - valueAfterInflation.fiveYears)} {t('inTodaysPrices')}
            </div>
          </div>
        </div>
      </div>

      {/* Рекомендуемое распределение */}
      <div className="card">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
          🎯 {t('recommendedAllocation')}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {t('optimalPortfolioStructure')}
            </h3>
            <div className="space-y-3">
              {recommendedAllocation.map(item => (
                <div key={item.type} className="flex items-center justify-between">
                  <span className="text-gray-700 dark:text-gray-300">{t(item.nameKey)}</span>
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
              💡 {t('investmentTips')}
            </h4>
            <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
              <li>• {t('diversifyPortfolio')}</li>
              <li>• {t('regularRebalancing')}</li>
              <li>• {t('considerInflation')}</li>
              <li>• {t('maxCashPercent')}</li>
              <li>• {t('indexFundsAdvice')}</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Прогресс к цели */}
      {userProfile.goalAmount > 0 && (
        <div className="card bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
          <h2 className="text-2xl font-semibold text-green-900 dark:text-green-300 mb-6">
            🎯 {t('goalProgress')}
          </h2>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-green-700 dark:text-green-400">
                {t('target')} {formatCurrency(userProfile.goalAmount)}
              </span>
              <span className="text-green-700 dark:text-green-400">
                {t('currentAssets')} {formatCurrency(totalValue)}
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
                  ? t('goalAchieved')
                  : `${t('remainingToSave')} ${formatCurrency(userProfile.goalAmount - totalValue)}`
                }
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 