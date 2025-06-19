import React, { useState, useEffect } from 'react';
// import { useTranslation } from '../utils/translations'; // TODO: добавить переводы позже

export default function StocksPage() {
  // const { t } = useTranslation(); // TODO: добавить переводы позже
  const [stockData, setStockData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStock, setSelectedStock] = useState('AAPL');
  
  // Состояние для калькулятора сложного процента
  const [calculator, setCalculator] = useState({
    initialAmount: 100000,
    monthlyContribution: 10000,
    annualReturn: 10,
    years: 10
  });

  // Популярные акции для отслеживания
  const popularStocks = [
    { symbol: 'AAPL', name: 'Apple Inc.', sector: 'Технологии' },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', sector: 'Технологии' },
    { symbol: 'MSFT', name: 'Microsoft Corp.', sector: 'Технологии' },
    { symbol: 'TSLA', name: 'Tesla Inc.', sector: 'Автомобили' },
    { symbol: 'AMZN', name: 'Amazon.com Inc.', sector: 'E-commerce' },
    { symbol: 'NVDA', name: 'NVIDIA Corp.', sector: 'Технологии' }
  ];

  // Индексы для мониторинга
  const majorIndices = [
    { symbol: 'SPY', name: 'S&P 500 ETF', description: 'Топ-500 компаний США' },
    { symbol: 'QQQ', name: 'NASDAQ-100 ETF', description: 'Технологические компании' },
    { symbol: 'VTI', name: 'Total Stock Market ETF', description: 'Весь рынок США' }
  ];

  // Загрузка данных акций (демо-данные, т.к. нужен API ключ)
  useEffect(() => {
    const fetchStockData = async () => {
      try {
        setLoading(true);
        
        // Для демонстрации используем статические данные
        // В реальности здесь был бы запрос к Alpha Vantage API
        const demoData = {
          'AAPL': {
            price: 175.43,
            change: 2.15,
            changePercent: 1.24,
            volume: '45,123,456',
            marketCap: '2.7T',
            pe: 28.5,
            high52w: 198.23,
            low52w: 124.17
          },
          'GOOGL': {
            price: 2456.78,
            change: -12.34,
            changePercent: -0.50,
            volume: '1,234,567',
            marketCap: '1.6T',
            pe: 25.3,
            high52w: 2800.12,
            low52w: 2025.34
          },
          'MSFT': {
            price: 345.67,
            change: 5.23,
            changePercent: 1.53,
            volume: '23,456,789',
            marketCap: '2.5T',
            pe: 32.1,
            high52w: 384.30,
            low52w: 245.18
          },
          'TSLA': {
            price: 234.56,
            change: -8.90,
            changePercent: -3.65,
            volume: '67,890,123',
            marketCap: '745B',
            pe: 45.2,
            high52w: 414.50,
            low52w: 152.37
          },
          'AMZN': {
            price: 3123.45,
            change: 15.67,
            changePercent: 0.50,
            volume: '3,456,789',
            marketCap: '1.3T',
            pe: 58.7,
            high52w: 3773.08,
            low52w: 2671.45
          },
          'NVDA': {
            price: 456.78,
            change: 12.34,
            changePercent: 2.78,
            volume: '45,678,901',
            marketCap: '1.1T',
            pe: 65.4,
            high52w: 502.66,
            low52w: 180.68
          }
        };

        setStockData(demoData);
        setError(null);
      } catch (err) {
        console.error('Ошибка загрузки данных акций:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStockData();
  }, []);

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

  const results = calculateCompoundInterest();

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto space-y-8 fade-in">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">📈 Акции и Инвестиции</h1>
          <div className="text-lg text-gray-600">Загрузка актуальных данных рынка...</div>
        </div>
        <div className="card text-center">
          <div className="animate-spin text-4xl mb-4">⏳</div>
          <p className="text-gray-600">Получаем свежие котировки</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 fade-in">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          📈 Акции и Инвестиции
        </h1>
        <p className="text-lg text-gray-600">
          Актуальные котировки, анализ рынка и калькулятор сложного процента
        </p>
        {error && (
          <div className="mt-2 text-sm text-orange-600">
            Демо-режим: используются тестовые данные
          </div>
        )}
      </div>

      {/* Популярные акции */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900">🔥 Популярные акции</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {popularStocks.map(stock => {
            const data = stockData[stock.symbol];
            if (!data) return null;

            const isPositive = data.change > 0;
            return (
              <div key={stock.symbol} className="card hover:shadow-lg transition-shadow cursor-pointer"
                   onClick={() => setSelectedStock(stock.symbol)}>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-lg">{stock.symbol}</h3>
                    <p className="text-sm text-gray-600">{stock.name}</p>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">{stock.sector}</span>
                  </div>
                  <div className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    {isPositive ? '↗' : '↘'} {Math.abs(data.changePercent).toFixed(2)}%
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">
                    {formatCurrency(data.price)}
                  </div>
                  <div className={`text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    {isPositive ? '+' : ''}{formatCurrency(data.change)}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Объем: {data.volume}
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
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            📊 Детали: {selectedStock}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">
                {formatCurrency(stockData[selectedStock].price)}
              </div>
              <p className="text-sm text-gray-600">Текущая цена</p>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold">
                {stockData[selectedStock].marketCap}
              </div>
              <p className="text-sm text-gray-600">Капитализация</p>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold">
                {stockData[selectedStock].pe}
              </div>
              <p className="text-sm text-gray-600">P/E коэффициент</p>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold">
                {formatCurrency(stockData[selectedStock].high52w)}
              </div>
              <p className="text-sm text-gray-600">Максимум за год</p>
            </div>
          </div>
        </div>
      )}

      {/* Индексные фонды */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900">📊 Индексные фонды</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {majorIndices.map(index => (
            <div key={index.symbol} className="card text-center">
              <h3 className="font-bold text-lg mb-2">{index.name}</h3>
              <p className="text-sm text-gray-600 mb-3">{index.description}</p>
              <div className="text-primary-600 font-semibold">
                Отслеживать {index.symbol}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Калькулятор сложного процента */}
      <div className="card">
        <h3 className="text-2xl font-semibold text-gray-900 mb-6">
          🧮 Калькулятор сложного процента
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Ввод параметров */}
          <div className="space-y-4">
            <div>
              <label className="label">Начальная сумма (₽)</label>
              <input
                type="number"
                value={calculator.initialAmount}
                onChange={(e) => setCalculator({...calculator, initialAmount: Number(e.target.value)})}
                className="input-field"
                placeholder="100000"
              />
            </div>
            
            <div>
              <label className="label">Ежемесячное пополнение (₽)</label>
              <input
                type="number"
                value={calculator.monthlyContribution}
                onChange={(e) => setCalculator({...calculator, monthlyContribution: Number(e.target.value)})}
                className="input-field"
                placeholder="10000"
              />
            </div>
            
            <div>
              <label className="label">Годовая доходность (%)</label>
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
              <label className="label">Период инвестирования (лет)</label>
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
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold text-green-900 mb-3">📈 Результаты инвестирования</h4>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-green-700">Итоговая сумма:</span>
                  <span className="font-bold text-green-900">
                    {formatNumber(results.futureValue)} ₽
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-green-700">Всего вложено:</span>
                  <span className="font-semibold text-green-800">
                    {formatNumber(results.totalContributions)} ₽
                  </span>
                </div>
                
                <div className="flex justify-between border-t pt-2">
                  <span className="text-green-700">Чистая прибыль:</span>
                  <span className="font-bold text-green-900 text-lg">
                    +{formatNumber(results.totalGain)} ₽
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-blue-800 text-sm">
                💡 <strong>Совет:</strong> Начните инвестировать как можно раньше. 
                Сложный процент работает лучше всего при длительном горизонте инвестирования.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Рекомендации для начинающих */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card bg-blue-50 border-blue-200">
          <h4 className="font-semibold text-blue-900 mb-3">🎯 Для начинающих инвесторов</h4>
          <ul className="text-sm text-blue-800 space-y-2">
            <li>• Начните с индексных фондов (S&P 500, NASDAQ)</li>
            <li>• Инвестируйте регулярно, а не пытайтесь угадать время</li>
            <li>• Диверсифицируйте портфель по секторам</li>
            <li>• Не паникуйте при кратковременных падениях</li>
            <li>• Изучайте основы финансовой грамотности</li>
          </ul>
        </div>
        
        <div className="card bg-orange-50 border-orange-200">
          <h4 className="font-semibold text-orange-900 mb-3">⚠️ Важные предупреждения</h4>
          <ul className="text-sm text-orange-800 space-y-2">
            <li>• Прошлая доходность не гарантирует будущие результаты</li>
            <li>• Инвестируйте только те деньги, которые готовы потерять</li>
            <li>• Высокая доходность всегда связана с высокими рисками</li>
            <li>• Рассмотрите консультацию с финансовым советником</li>
            <li>• Изучите налоговые аспекты инвестирования</li>
          </ul>
        </div>
      </div>

      {/* Информация об API */}
      <div className="card bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-purple-900 mb-2">
            🔌 Данные предоставлены Alpha Vantage API
          </h3>
          <p className="text-purple-700 text-sm mb-3">
            Профессиональные финансовые данные для трейдеров и инвесторов
          </p>
          <div className="flex justify-center space-x-4 text-xs text-purple-600">
            <span>✅ Реальные котировки</span>
            <span>✅ Исторические данные</span>
            <span>✅ Технические индикаторы</span>
            <span>✅ Новости рынка</span>
          </div>
          <p className="text-xs text-purple-500 mt-2">
            Сейчас отображаются демо-данные. Для получения реальных котировок нужен API ключ.
          </p>
        </div>
      </div>
    </div>
  );
} 