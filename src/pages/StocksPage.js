import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useTranslation } from '../utils/translations';

// Генерация случайных данных для демонстрации "обновления" (fallback)
const generateRandomStockData = () => {
  const baseData = {
    'AAPL': { basePrice: 175, basePE: 28.5, marketCap: '2.7T' },
    'GOOGL': { basePrice: 2450, basePE: 25.3, marketCap: '1.6T' },
    'MSFT': { basePrice: 345, basePE: 32.1, marketCap: '2.5T' },
    'TSLA': { basePrice: 235, basePE: 45.2, marketCap: '745B' },
    'AMZN': { basePrice: 3120, basePE: 58.7, marketCap: '1.3T' },
    'NVDA': { basePrice: 450, basePE: 65.4, marketCap: '1.1T' }
  };

  const result = {};
  Object.keys(baseData).forEach(symbol => {
    const base = baseData[symbol];
    const changePercent = (Math.random() - 0.5) * 8; // От -4% до +4%
    const newPrice = base.basePrice * (1 + changePercent / 100);
    const change = newPrice - base.basePrice;
    
    result[symbol] = {
      price: Number(newPrice.toFixed(2)),
      change: Number(change.toFixed(2)),
      changePercent: Number(changePercent.toFixed(2)),
      volume: Math.floor(Math.random() * 50000000 + 10000000).toLocaleString(),
      marketCap: base.marketCap,
      pe: base.basePE + (Math.random() - 0.5) * 5,
      high52w: newPrice * (1 + Math.random() * 0.3),
      low52w: newPrice * (1 - Math.random() * 0.3)
    };
  });

  return result;
};

export default function StocksPage() {
  const { t } = useTranslation();
  const [stockData, setStockData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStock, setSelectedStock] = useState('AAPL');
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isUsingRealAPI, setIsUsingRealAPI] = useState(false);
  const [canUpdate, setCanUpdate] = useState(true);
  const [nextUpdateTime, setNextUpdateTime] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  
  // Состояние для калькулятора сложного процента
  const [calculator, setCalculator] = useState({
    initialAmount: '',
    monthlyContribution: '',
    annualReturn: '',
    years: ''
  });

  // Популярные акции для отслеживания - мемоизируем для стабильности
  const popularStocks = useMemo(() => [
    { symbol: 'AAPL', name: 'Apple Inc.', sector: t('technology') },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', sector: t('technology') },
    { symbol: 'MSFT', name: 'Microsoft Corp.', sector: t('technology') },
    { symbol: 'TSLA', name: 'Tesla Inc.', sector: t('automotive') },
    { symbol: 'AMZN', name: 'Amazon.com Inc.', sector: t('ecommerce') },
    { symbol: 'NVDA', name: 'NVIDIA Corp.', sector: t('technology') }
  ], [t]);

  // Индексы для мониторинга
  const majorIndices = [
    { symbol: 'SPY', name: 'S&P 500 ETF', description: 'Топ-500 компаний США' },
    { symbol: 'QQQ', name: 'NASDAQ-100 ETF', description: 'Технологические компании' },
    { symbol: 'VTI', name: 'Total Stock Market ETF', description: 'Весь рынок США' }
  ];

  // Загрузка данных акций через новый API
  const fetchStockData = useCallback(async (forceUpdate = false, showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      
      console.log('📡 Загружаем данные акций через наш API...');
      
      const apiUrl = forceUpdate 
        ? '/api/stocks/data?force=true'  
        : '/api/stocks/data';
      
      const API_BASE_URL = process.env.REACT_APP_API_URL || 
        (process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5000');
      
      const response = await fetch(`${API_BASE_URL}${apiUrl}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('📈 Ответ от нашего API:', result);
      
      if (result.success) {
        setStockData(result.data);
        setLastUpdated(new Date(result.meta.lastUpdated));
        setIsUsingRealAPI(result.meta.isUsingRealAPI);
        setCanUpdate(result.meta.canUpdate);
        setNextUpdateTime(result.meta.nextUpdateTime ? new Date(result.meta.nextUpdateTime) : null);
        setError(result.meta.statusMessage);
        
        console.log('✅ Данные успешно загружены:', {
          stocksCount: Object.keys(result.data).length,
          isUsingRealAPI: result.meta.isUsingRealAPI,
          canUpdate: result.meta.canUpdate,
          statusMessage: result.meta.statusMessage
        });
      } else {
        throw new Error(result.error || 'Неизвестная ошибка API');
      }
      
    } catch (err) {
      console.error('❌ Ошибка загрузки данных через API:', err);
      
      // Fallback на локальные демо-данные
      console.log('🔄 Переключаемся на локальные демо-данные...');
      const demoData = generateRandomStockData();
      setStockData(demoData);
      setIsUsingRealAPI(false);
      setCanUpdate(true);
      setError(`Ошибка API: ${err.message}. Показаны демо-данные.`);
      setLastUpdated(new Date());
      
      console.log('🎭 Используем локальные демо-данные:', demoData);
    } finally {
      setLoading(false);
      console.log('🏁 Завершена загрузка данных акций');
    }
  }, []);

  // Обновление таймера до следующего обновления
  useEffect(() => {
    if (!nextUpdateTime || canUpdate) {
      setTimeLeft(null);
      return;
    }

    const updateTimer = () => {
      const now = new Date();
      const diff = nextUpdateTime - now;
      
      if (diff <= 0) {
        setTimeLeft(null);
        setCanUpdate(true);
        return;
      }
      
      const minutes = Math.floor(diff / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${minutes}:${seconds.toString().padStart(2, '0')}`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    
    return () => clearInterval(interval);
  }, [nextUpdateTime, canUpdate]);

  useEffect(() => {
    fetchStockData();
  }, [fetchStockData]);

  // Обработчик обновления данных
  const handleUpdateData = () => {
    if (!canUpdate || loading) return;
    fetchStockData(true, false); // forceUpdate = true, showLoading = false
  };

  // Расчет сложного процента
  const calculateCompoundInterest = () => {
    const { initialAmount, monthlyContribution, annualReturn, years } = calculator;
    
    // Проверяем, что все поля заполнены
    const initial = parseFloat(initialAmount) || 0;
    const monthly = parseFloat(monthlyContribution) || 0;
    const returnRate = parseFloat(annualReturn) || 0;
    const period = parseFloat(years) || 0;
    
    if (initial <= 0 && monthly <= 0) {
      return { futureValue: 0, totalContributions: 0, totalGain: 0 };
    }
    
    if (returnRate <= 0 || period <= 0) {
      return { futureValue: 0, totalContributions: 0, totalGain: 0 };
    }
    
    const monthlyRate = returnRate / 100 / 12;
    const totalMonths = period * 12;
    
    // Формула для сложного процента с ежемесячными взносами
    const futureValue = initial * Math.pow(1 + monthlyRate, totalMonths) +
      monthly * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate);
    
    const totalContributions = initial + (monthly * totalMonths);
    const totalGain = futureValue - totalContributions;
    
    return {
      futureValue: Math.round(futureValue),
      totalContributions: Math.round(totalContributions),
      totalGain: Math.round(totalGain)
    };
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('ru-RU').format(num);
  };

  const formatCurrency = (num) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(num);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('ru-RU', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const results = calculateCompoundInterest();

  if (loading && !lastUpdated) {
    return (
      <div className="max-w-6xl mx-auto space-y-8 fade-in">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            📈 {t('stocksAndInvestments')}
          </h1>
          <div className="text-lg text-gray-600 dark:text-gray-400">
            {t('loadingMarketData')}
          </div>
        </div>
        <div className="card text-center">
          <div className="animate-spin text-4xl mb-4">⏳</div>
          <p className="text-gray-600 dark:text-gray-400 mb-2">{t('gettingFreshQuotes')}</p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            {t('gettingFreshQuotes')}...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 fade-in">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          📈 {t('stocksAndInvestments')}
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          {t('stocksPageSubtitle')}
        </p>
        <div className="mt-4 flex items-center justify-center space-x-4 flex-wrap">
          {lastUpdated && (
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {t('lastUpdated')}: {formatTime(lastUpdated)}
            </span>
          )}
          <div className="flex items-center space-x-2">
            <button
              onClick={handleUpdateData}
              disabled={loading || !canUpdate}
              className={`btn-secondary text-sm ${(!canUpdate && !loading) ? 'opacity-50 cursor-not-allowed' : ''}`}
              title={!canUpdate ? `Обновление доступно через ${timeLeft || 'скоро'}` : ''}
            >
              {loading ? '⏳' : '🔄'} {t('updateData')}
              {timeLeft && !loading && (
                <span className="ml-1 text-xs">
                  ({timeLeft})
                </span>
              )}
            </button>
            {!canUpdate && timeLeft && (
              <span className="text-xs text-orange-600 dark:text-orange-400">
                ⏰ {timeLeft}
              </span>
            )}
          </div>
          {isUsingRealAPI && (
            <span className="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded">
              📡 Реальные данные
            </span>
          )}
        </div>
        {error && (
          <div className={`mt-2 text-sm ${isUsingRealAPI ? 'text-orange-600 dark:text-orange-400' : 'text-orange-600 dark:text-orange-400'}`}>
            {error}
          </div>
        )}
      </div>

      {/* Популярные акции */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          🔥 {t('popularStocks')} {isUsingRealAPI && <span className="text-green-600 text-sm">(All Live Data)</span>}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {popularStocks.map(stock => {
            const data = stockData[stock.symbol];
            if (!data) return null;

            const isPositive = data.change > 0;
            return (
              <div 
                key={stock.symbol} 
                className="card hover:shadow-lg dark:hover:shadow-gray-900/20 transition-shadow cursor-pointer"
                onClick={() => setSelectedStock(stock.symbol)}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                        {stock.symbol}
                      </h3>
                      {isUsingRealAPI && (
                        <span className="text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-1.5 py-0.5 rounded">
                          📡 Live
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{stock.name}</p>
                    <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded">
                      {stock.sector}
                    </span>
                  </div>
                  <div className={`text-sm font-medium ${isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {isPositive ? '↗' : '↘'} {Math.abs(data.changePercent).toFixed(2)}%
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatCurrency(data.price)}
                  </div>
                  <div className={`text-sm ${isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {isPositive ? '+' : ''}{formatCurrency(data.change)}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {t('volume')}: {data.volume}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Детальная информация о выбранной акции */}
      {selectedStock && stockData[selectedStock] && (
        <div className="card">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            📊 {t('stockDetails')}: {selectedStock}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                {formatCurrency(stockData[selectedStock].price)}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t('currentPrice')}</p>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                {stockData[selectedStock].marketCap}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t('marketCap')}</p>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                {stockData[selectedStock].pe ? stockData[selectedStock].pe.toFixed(1) : 'N/A'}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t('peRatio')}</p>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                {stockData[selectedStock].high52w ? formatCurrency(stockData[selectedStock].high52w) : 'N/A'}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t('yearHigh')}</p>
            </div>
          </div>
        </div>
      )}

      {/* Индексные фонды */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          📊 {t('indexFunds')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {majorIndices.map(index => (
            <div key={index.symbol} className="card text-center">
              <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">
                {index.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                {index.description}
              </p>
              <div className="text-primary-600 dark:text-primary-400 font-semibold">
                {t('trackSymbol')} {index.symbol}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Калькулятор сложного процента */}
      <div className="card">
        <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
          🧮 {t('compoundCalculator')}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Ввод параметров */}
          <div className="space-y-4">
            <div>
              <label className="label">{t('initialAmount')} (₽)</label>
              <input
                type="number"
                value={calculator.initialAmount}
                onChange={(e) => setCalculator({...calculator, initialAmount: e.target.value})}
                onFocus={(e) => e.target.select()}
                className="input-field"
                placeholder="100000"
              />
            </div>
            
            <div>
              <label className="label">{t('monthlyContribution')} (₽)</label>
              <input
                type="number"
                value={calculator.monthlyContribution}
                onChange={(e) => setCalculator({...calculator, monthlyContribution: e.target.value})}
                onFocus={(e) => e.target.select()}
                className="input-field"
                placeholder="10000"
              />
            </div>
            
            <div>
              <label className="label">{t('annualReturn')} (%)</label>
              <input
                type="number"
                step="0.1"
                value={calculator.annualReturn}
                onChange={(e) => setCalculator({...calculator, annualReturn: e.target.value})}
                onFocus={(e) => e.target.select()}
                className="input-field"
                placeholder="10"
              />
            </div>
            
            <div>
              <label className="label">{t('investmentPeriod')} (лет)</label>
              <input
                type="number"
                value={calculator.years}
                onChange={(e) => setCalculator({...calculator, years: e.target.value})}
                onFocus={(e) => e.target.select()}
                className="input-field"
                placeholder="10"
              />
            </div>
          </div>

          {/* Результаты */}
          <div className="space-y-4">
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
              <h4 className="font-semibold text-green-900 dark:text-green-300 mb-3">
                📈 {t('investmentResults')}
              </h4>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-green-700 dark:text-green-400">{t('finalAmount')}:</span>
                  <span className="font-bold text-green-900 dark:text-green-300">
                    {formatNumber(results.futureValue)} ₽
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-green-700 dark:text-green-400">{t('totalInvested')}:</span>
                  <span className="font-semibold text-green-800 dark:text-green-400">
                    {formatNumber(results.totalContributions)} ₽
                  </span>
                </div>
                
                <div className="flex justify-between border-t border-green-200 dark:border-green-700 pt-2">
                  <span className="text-green-700 dark:text-green-400">{t('netProfit')}:</span>
                  <span className="font-bold text-green-900 dark:text-green-300 text-lg">
                    +{formatNumber(results.totalGain)} ₽
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-blue-800 dark:text-blue-300 text-sm">
                💡 <strong>Совет:</strong> {t('investmentTip')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Рекомендации для начинающих */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-3">
            🎯 {t('forBeginnerInvestors')}
          </h4>
          <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-2">
            <li>• {t('startWithIndexFunds')}</li>
            <li>• {t('investRegularly')}</li>
            <li>• {t('diversifyBySectors')}</li>
            <li>• {t('dontPanicShortTerm')}</li>
            <li>• {t('studyFinancialLiteracy')}</li>
          </ul>
        </div>
        
        <div className="card bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800">
          <h4 className="font-semibold text-orange-900 dark:text-orange-300 mb-3">
            ⚠️ {t('importantWarnings')}
          </h4>
          <ul className="text-sm text-orange-800 dark:text-orange-300 space-y-2">
            <li>• {t('pastPerformanceWarning')}</li>
            <li>• {t('investOnlyAffordableMoney')}</li>
            <li>• {t('highReturnHighRisk')}</li>
            <li>• {t('considerFinancialAdvisor')}</li>
            <li>• {t('studyTaxAspects')}</li>
          </ul>
        </div>
      </div>

      {/* Информация об API и кэшировании */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-800">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-300 mb-2">
              🔌 {isUsingRealAPI ? 'Реальные данные от EODHD API' : 'Демо-данные EODHD API'}
            </h3>
            <p className="text-purple-700 dark:text-purple-400 text-sm mb-3">
              Профессиональные финансовые данные для трейдеров и инвесторов
            </p>
            <div className="flex justify-center space-x-4 text-xs text-purple-600 dark:text-purple-400 flex-wrap">
              <span>{isUsingRealAPI ? '✅ Реальные котировки (15-20 мин)' : '🔶 Демо котировки'}</span>
              <span>✅ 100,000 запросов/день</span>
              <span>✅ Исторические данные</span>
              <span>✅ Глобальные биржи</span>
            </div>
          </div>
        </div>
        
        <div className="card bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-blue-200 dark:border-blue-800">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-300 mb-2">
              ⚡ Умное кэширование данных
            </h3>
            <p className="text-blue-700 dark:text-blue-400 text-sm mb-3">
              Данные обновляются максимум раз в 2 часа для экономии API запросов
            </p>
            <div className="space-y-1 text-xs text-blue-600 dark:text-blue-400">
              <div>🕐 Обновление: каждые 2 часа</div>
              <div>💾 Кэш: в базе данных</div>
              <div>🚀 Скорость: мгновенная загрузка</div>
              <div>💰 Экономия: {isUsingRealAPI ? 'API запросов' : 'демо-режим'}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 