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

// Функция для получения реальных данных от Alpha Vantage API
const fetchRealStockData = async (symbol) => {
  const API_KEY = process.env.REACT_APP_ALPHA_VANTAGE_API_KEY || 'J753PYAH9OD50RBP';
  
  try {
    const response = await fetch(
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Проверяем есть ли данные
    if (data['Error Message']) {
      throw new Error(data['Error Message']);
    }
    
    if (data['Note']) {
      throw new Error('API limit exceeded');
    }
    
    const quote = data['Global Quote'];
    if (!quote) {
      throw new Error('No data received');
    }
    
    // Преобразуем данные Alpha Vantage в наш формат
    const price = parseFloat(quote['05. price']);
    const previousClose = parseFloat(quote['08. previous close']);
    const change = price - previousClose;
    const changePercent = (change / previousClose) * 100;
    
    return {
      price: Number(price.toFixed(2)),
      change: Number(change.toFixed(2)),
      changePercent: Number(changePercent.toFixed(2)),
      volume: parseInt(quote['06. volume']).toLocaleString(),
      high: parseFloat(quote['03. high']),
      low: parseFloat(quote['04. low']),
      previousClose: previousClose
    };
  } catch (error) {
    console.error(`Error fetching data for ${symbol}:`, error);
    throw error;
  }
};

export default function StocksPage() {
  const { t } = useTranslation();
  const [stockData, setStockData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStock, setSelectedStock] = useState('AAPL');
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isUsingRealAPI, setIsUsingRealAPI] = useState(false);
  
  // Состояние для калькулятора сложного процента
  const [calculator, setCalculator] = useState({
    initialAmount: 100000,
    monthlyContribution: 10000,
    annualReturn: 10,
    years: 10
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

  // Загрузка данных акций
  const fetchStockData = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      
      // Проверяем доступность API ключа
      const API_KEY = process.env.REACT_APP_ALPHA_VANTAGE_API_KEY || 'J753PYAH9OD50RBP';
      
      if (API_KEY && API_KEY !== 'demo') {
        // Пытаемся получить реальные данные
        try {
          console.log('Загружаем реальные данные от Alpha Vantage...');
          const realData = {};
          
          // Загружаем данные для каждой акции последовательно (чтобы не превысить лимиты API)
          for (const stock of popularStocks.slice(0, 3)) { // Ограничиваем первыми 3 для экономии запросов
            try {
              const data = await fetchRealStockData(stock.symbol);
              realData[stock.symbol] = {
                ...data,
                marketCap: getMarketCap(stock.symbol), // Статичные данные
                pe: getPERatio(stock.symbol), // Статичные данные
                high52w: data.high * 1.2, // Примерное значение
                low52w: data.low * 0.8    // Примерное значение
              };
              
              // Небольшая задержка между запросами
              await new Promise(resolve => setTimeout(resolve, 500));
            } catch (err) {
              console.error(`Failed to fetch ${stock.symbol}:`, err);
              // Продолжаем со следующей акцией
            }
          }
          
          if (Object.keys(realData).length > 0) {
            setStockData(realData);
            setIsUsingRealAPI(true);
            setError(null);
            console.log('Загружены реальные данные:', realData);
          } else {
            throw new Error('No real data available');
          }
          
        } catch (apiError) {
          console.log('Ошибка API, переключаемся на демо-данные:', apiError.message);
          // Fallback на демо-данные
          const demoData = generateRandomStockData();
          setStockData(demoData);
          setIsUsingRealAPI(false);
          setError('API недоступен, показаны демо-данные');
        }
      } else {
        // Используем демо-данные
        console.log('API ключ не настроен, используем демо-данные');
        await new Promise(resolve => setTimeout(resolve, 1000)); // Имитация загрузки
        const demoData = generateRandomStockData();
        setStockData(demoData);
        setIsUsingRealAPI(false);
        setError('Демо-режим: настройте API ключ для реальных данных');
      }
      
      setLastUpdated(new Date());
      
    } catch (err) {
      console.error('Общая ошибка загрузки данных:', err);
      setError(err.message);
      setIsUsingRealAPI(false);
    } finally {
      setLoading(false);
    }
  }, [popularStocks]);

  // Вспомогательные функции для статичных данных
  const getMarketCap = (symbol) => {
    const caps = {
      'AAPL': '2.7T', 'GOOGL': '1.6T', 'MSFT': '2.5T',
      'TSLA': '745B', 'AMZN': '1.3T', 'NVDA': '1.1T'
    };
    return caps[symbol] || 'N/A';
  };

  const getPERatio = (symbol) => {
    const ratios = {
      'AAPL': 28.5, 'GOOGL': 25.3, 'MSFT': 32.1,
      'TSLA': 45.2, 'AMZN': 58.7, 'NVDA': 65.4
    };
    return ratios[symbol] || 0;
  };

  useEffect(() => {
    fetchStockData();
  }, [fetchStockData]);

  // Расчет сложного процента
  const calculateCompoundInterest = () => {
    const { initialAmount, monthlyContribution, annualReturn, years } = calculator;
    const monthlyRate = annualReturn / 100 / 12;
    const totalMonths = years * 12;
    
    // Формула для сложного процента с ежемесячными взносами
    const futureValue = initialAmount * Math.pow(1 + monthlyRate, totalMonths) +
      monthlyContribution * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate);
    
    const totalContributions = initialAmount + (monthlyContribution * totalMonths);
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
          <p className="text-gray-600 dark:text-gray-400">{t('gettingFreshQuotes')}</p>
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
        <div className="mt-4 flex items-center justify-center space-x-4">
          {lastUpdated && (
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {t('lastUpdated')}: {formatTime(lastUpdated)}
            </span>
          )}
          <button
            onClick={() => fetchStockData(false)}
            disabled={loading}
            className="btn-secondary text-sm"
          >
            {loading ? '⏳' : '🔄'} {t('updateData')}
          </button>
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
          🔥 {t('popularStocks')} {isUsingRealAPI && <span className="text-green-600 text-sm">(Live Data)</span>}
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
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                      {stock.symbol}
                    </h3>
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
                onChange={(e) => setCalculator({...calculator, initialAmount: Number(e.target.value)})}
                className="input-field"
                placeholder="100000"
              />
            </div>
            
            <div>
              <label className="label">{t('monthlyContribution')} (₽)</label>
              <input
                type="number"
                value={calculator.monthlyContribution}
                onChange={(e) => setCalculator({...calculator, monthlyContribution: Number(e.target.value)})}
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
                onChange={(e) => setCalculator({...calculator, annualReturn: Number(e.target.value)})}
                className="input-field"
                placeholder="10"
              />
            </div>
            
            <div>
              <label className="label">{t('investmentPeriod')} (лет)</label>
              <input
                type="number"
                value={calculator.years}
                onChange={(e) => setCalculator({...calculator, years: Number(e.target.value)})}
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
            <li>• Начните с индексных фондов (S&P 500, NASDAQ)</li>
            <li>• Инвестируйте регулярно, а не пытайтесь угадать время</li>
            <li>• Диверсифицируйте портфель по секторам</li>
            <li>• Не паникуйте при кратковременных падениях</li>
            <li>• Изучайте основы финансовой грамотности</li>
          </ul>
        </div>
        
        <div className="card bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800">
          <h4 className="font-semibold text-orange-900 dark:text-orange-300 mb-3">
            ⚠️ {t('importantWarnings')}
          </h4>
          <ul className="text-sm text-orange-800 dark:text-orange-300 space-y-2">
            <li>• Прошлая доходность не гарантирует будущие результаты</li>
            <li>• Инвестируйте только те деньги, которые готовы потерять</li>
            <li>• Высокая доходность всегда связана с высокими рисками</li>
            <li>• Рассмотрите консультацию с финансовым советником</li>
            <li>• Изучите налоговые аспекты инвестирования</li>
          </ul>
        </div>
      </div>

      {/* Информация об API */}
      <div className="card bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-800">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-300 mb-2">
            🔌 {isUsingRealAPI ? 'Реальные данные от Alpha Vantage API' : 'Демо-данные Alpha Vantage API'}
          </h3>
          <p className="text-purple-700 dark:text-purple-400 text-sm mb-3">
            Профессиональные финансовые данные для трейдеров и инвесторов
          </p>
          <div className="flex justify-center space-x-4 text-xs text-purple-600 dark:text-purple-400">
            <span>{isUsingRealAPI ? '✅ Реальные котировки' : '🔶 Демо котировки'}</span>
            <span>✅ Исторические данные</span>
            <span>✅ Технические индикаторы</span>
            <span>✅ Новости рынка</span>
          </div>
          {!isUsingRealAPI && (
            <p className="text-xs text-purple-500 dark:text-purple-400 mt-2">
              API ключ: J753PYAH9OD50RBP - настройте в переменных окружения REACT_APP_ALPHA_VANTAGE_API_KEY
            </p>
          )}
        </div>
      </div>
    </div>
  );
} 