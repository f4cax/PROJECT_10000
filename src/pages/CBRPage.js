import React, { useState, useEffect } from 'react';
import { useTranslation } from '../utils/translations';

export default function CBRPage() {
  const { t } = useTranslation();
  const [exchangeRates, setExchangeRates] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [calculatorFrom, setCalculatorFrom] = useState('USD');
  const [calculatorTo, setCalculatorTo] = useState('RUB');
  const [calculatorAmount, setCalculatorAmount] = useState('');
  const [inflationData] = useState({
    currentRate: 5.9,
    yearRate: 7.4,
    targetRate: 4.0
  });

  // Основные популярные валюты для отображения
  const mainCurrencies = ['USD', 'EUR', 'GBP', 'CNY', 'JPY', 'CHF'];

  // Загрузка данных ЦБ РФ
  useEffect(() => {
    const fetchCBRData = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://www.cbr-xml-daily.ru/daily_json.js');
        
        if (!response.ok) {
          throw new Error('Ошибка загрузки данных ЦБ РФ');
        }
        
        const data = await response.json();
        setExchangeRates(data);
        setError(null);
      } catch (err) {
        console.error('Ошибка загрузки курсов валют:', err);
        setError(err.message);
        // Устанавливаем тестовые данные при ошибке
        setExchangeRates({
          Date: new Date().toISOString(),
          Valute: {
            USD: { Value: 92.5, Previous: 91.8, CharCode: 'USD', Name: 'Доллар США' },
            EUR: { Value: 100.2, Previous: 99.5, CharCode: 'EUR', Name: 'Евро' },
            GBP: { Value: 117.3, Previous: 116.8, CharCode: 'GBP', Name: 'Фунт стерлингов' },
            CNY: { Value: 12.8, Previous: 12.6, CharCode: 'CNY', Name: 'Китайский юань' },
            JPY: { Value: 0.65, Previous: 0.64, CharCode: 'JPY', Name: 'Японская иена' },
            CHF: { Value: 103.2, Previous: 102.8, CharCode: 'CHF', Name: 'Швейцарский франк' }
          }
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCBRData();
  }, []);

  // Расчет курса для калькулятора
  const calculateExchange = () => {
    if (!exchangeRates || !calculatorAmount || calculatorAmount === '') return '0';
    
    const amount = parseFloat(calculatorAmount);
    if (isNaN(amount) || amount <= 0) return '0';
    
    let fromRate = 1;
    let toRate = 1;
    
    if (calculatorFrom !== 'RUB' && exchangeRates.Valute[calculatorFrom]) {
      fromRate = exchangeRates.Valute[calculatorFrom].Value;
    }
    
    if (calculatorTo !== 'RUB' && exchangeRates.Valute[calculatorTo]) {
      toRate = exchangeRates.Valute[calculatorTo].Value;
    }
    
    if (calculatorFrom === 'RUB' && calculatorTo !== 'RUB') {
      return (amount / toRate).toFixed(4);
    } else if (calculatorFrom !== 'RUB' && calculatorTo === 'RUB') {
      return (amount * fromRate).toFixed(2);
    } else if (calculatorFrom !== 'RUB' && calculatorTo !== 'RUB') {
      return ((amount * fromRate) / toRate).toFixed(4);
    }
    
    return amount.toString();
  };

  // Получение изменения курса
  const getCurrencyChange = (currency) => {
    if (!currency.Previous) return { change: 0, isPositive: true };
    const change = ((currency.Value - currency.Previous) / currency.Previous * 100);
    return {
      change: Math.abs(change).toFixed(2),
      isPositive: change >= 0
    };
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('ru-RU', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(num);
  };

  const getInflationColor = (rate) => {
    if (rate <= 4) return 'text-green-600 dark:text-green-400';
    if (rate <= 6) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  // Получение флага валюты
  const getCurrencyFlag = (code) => {
    const flags = {
      'USD': '🇺🇸',
      'EUR': '🇪🇺',
      'GBP': '🇬🇧',
      'CNY': '🇨🇳',
      'JPY': '🇯🇵',
      'CHF': '🇨🇭'
    };
    return flags[code] || '💱';
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto space-y-8 fade-in">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">💱 {t('cbrPageTitle')}</h1>
          <div className="text-lg text-gray-600 dark:text-gray-400">{t('loadingData')}</div>
        </div>
        <div className="card text-center">
          <div className="animate-spin text-4xl mb-4">⏳</div>
          <p className="text-gray-600 dark:text-gray-400">{t('gettingFreshData')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 fade-in">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          💱 {t('cbrPageTitle')}
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          {t('cbrPageSubtitle')}
        </p>
        {exchangeRates && (
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
            {t('dataFor')} {new Date(exchangeRates.Date).toLocaleDateString('ru-RU')}
            {error && <span className="text-orange-600 dark:text-orange-400 ml-2">({t('demoMode')})</span>}
          </p>
        )}
      </div>

      {/* Основные курсы валют */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {exchangeRates && mainCurrencies.map(code => {
          const currency = exchangeRates.Valute[code];
          if (!currency) return null;
          
          const change = getCurrencyChange(currency);
          return (
            <div key={code} className="card hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {getCurrencyFlag(currency.CharCode)}
                  </div>
                  <div className="ml-3">
                    <h3 className="font-semibold text-gray-900 dark:text-white">{currency.CharCode}</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{currency.Name}</p>
                  </div>
                </div>
                <div className={`text-sm font-medium ${change.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {change.isPositive ? '↗' : '↘'} {change.change}%
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatNumber(currency.Value)} ₽
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  за 1 {currency.CharCode}
                </div>
                {currency.Previous && (
                  <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    Вчера: {formatNumber(currency.Previous)} ₽
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Инфляция */}
      <div className="card bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border-orange-200 dark:border-orange-800">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          📊 {t('inflationData')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className={`text-3xl font-bold ${getInflationColor(inflationData.currentRate)}`}>
              {inflationData.currentRate}%
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{t('currentInflation')}</p>
            <p className="text-xs text-gray-500 dark:text-gray-500">Месяц к месяцу</p>
          </div>
          <div className="text-center">
            <div className={`text-3xl font-bold ${getInflationColor(inflationData.yearRate)}`}>
              {inflationData.yearRate}%
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{t('yearlyInflation')}</p>
            <p className="text-xs text-gray-500 dark:text-gray-500">Год к году</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">
              {inflationData.targetRate}%
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{t('cbrTarget')}</p>
            <p className="text-xs text-gray-500 dark:text-gray-500">Цель на год</p>
          </div>
        </div>
        <div className="mt-4 p-3 bg-white dark:bg-gray-800 rounded-lg text-center">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            💡 <strong>{t('inflationImpact')} {inflationData.yearRate}%</strong> {' '}
            {t('inflationExample')} {(100000 / (1 + inflationData.yearRate / 100)).toFixed(0)} ₽ {t('inflationToday')}
          </p>
        </div>
      </div>

      {/* Калькулятор валют */}
      <div className="card">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          🧮 {t('currencyCalculator')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="label">{t('amount')}</label>
            <input
              type="number"
              value={calculatorAmount || ''}
              onChange={(e) => {
                const value = e.target.value;
                setCalculatorAmount(value === '' ? '' : parseFloat(value) || 0);
              }}
              onFocus={(e) => {
                if (e.target.value === '0' || e.target.value === '') {
                  e.target.select();
                }
              }}
              className="input-field"
              placeholder="Введите сумму"
            />
          </div>
          <div>
            <label className="label">{t('fromCurrency')}</label>
            <select
              value={calculatorFrom}
              onChange={(e) => setCalculatorFrom(e.target.value)}
              className="input-field"
            >
              <option value="RUB">RUB - {t('ruble')}</option>
              {exchangeRates && Object.entries(exchangeRates.Valute).map(([code, currency]) => (
                <option key={code} value={code}>
                  {code} - {currency.Name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">{t('toCurrency')}</label>
            <select
              value={calculatorTo}
              onChange={(e) => setCalculatorTo(e.target.value)}
              className="input-field"
            >
              <option value="RUB">RUB - {t('ruble')}</option>
              {exchangeRates && Object.entries(exchangeRates.Valute).map(([code, currency]) => (
                <option key={code} value={code}>
                  {code} - {currency.Name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                {calculateExchange()}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{calculatorTo}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Дополнительная информация */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-3">💼 {t('forInvestors')}</h4>
          <ul className="text-sm text-blue-800 dark:text-blue-400 space-y-2">
            <li>• {t('dollarRateAffects')}</li>
            <li>• {t('strongRubleReduces')}</li>
            <li>• {t('keyRate')}</li>
            <li>• {t('currencyInterventions')}</li>
          </ul>
        </div>
        
        <div className="card bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
          <h4 className="font-semibold text-green-900 dark:text-green-300 mb-3">🏠 {t('forFamilyBudget')}</h4>
          <ul className="text-sm text-green-800 dark:text-green-400 space-y-2">
            <li>• {t('currencyGrowth')}</li>
            <li>• {t('planLargePurchases')}</li>
            <li>• {t('currencyDiversification')}</li>
            <li>• {t('vacationAbroad')}</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 