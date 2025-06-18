import React, { useState } from 'react';
import { useTranslation } from '../../utils/translations';

export default function IncomeForm({ monthlyIncome, setMonthlyIncome }) {
  const { t } = useTranslation();
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const income = parseFloat(inputValue);
    if (income && income > 0) {
      setMonthlyIncome(income);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value.replace(/[^\d]/g, ''); // Только цифры
    setInputValue(value);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('ru-RU').format(num);
  };

  return (
    <div className="card">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="income" className="label">
            💰 {t('monthlyIncomeLabel')}
          </label>
          <div className="relative">
            <input
              type="text"
              id="income"
              value={inputValue}
              onChange={handleInputChange}
              placeholder="50000"
              className="input-field pr-12"
              required
            />
            <span className="absolute right-3 top-2 text-gray-500">{t('rublesSymbol')}</span>
          </div>
          {inputValue && (
            <p className="text-sm text-gray-600 mt-1">
              {formatNumber(inputValue)} {t('rublesSymbol')}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="btn-primary w-full"
          disabled={!inputValue || inputValue <= 0}
        >
          📊 {t('calculateButton')}
        </button>
      </form>

      {monthlyIncome > 0 && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-800">
            ✅ {t('calculationCompleted')} <span className="font-semibold">{formatNumber(monthlyIncome)} {t('rublesSymbol')}</span>
          </p>
        </div>
      )}
    </div>
  );
} 