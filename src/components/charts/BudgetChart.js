import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import { useTranslation } from '../../utils/translations';

// Регистрируем компоненты Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

export default function BudgetChart({ budgetDistribution }) {
  const { t } = useTranslation();
  const formatNumber = (num) => {
    return new Intl.NumberFormat('ru-RU').format(num);
  };

  const data = {
    labels: [
      `${t('essentialExpenses')} (50%)`,
      `${t('emergencyFund')} (25%)`,
      `${t('investments')} (15%)`,
      `${t('entertainment')} (10%)`
    ],
    datasets: [
      {
        data: [
          budgetDistribution.needs,
          budgetDistribution.safety,
          budgetDistribution.investments,
          budgetDistribution.wants
        ],
        backgroundColor: [
          '#6B7280', // Серый для обязательных расходов
          '#3B82F6', // Синий для подушки безопасности  
          '#10B981', // Зелёный для инвестиций
          '#EF4444'  // Красный для развлечений
        ],
        borderColor: [
          '#4B5563',
          '#2563EB',
          '#059669',
          '#DC2626'
        ],
        borderWidth: 2,
        hoverBorderWidth: 3,
        hoverOffset: 4
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 12,
            family: 'Inter'
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        titleFont: {
          size: 14,
          weight: 'bold'
        },
        bodyFont: {
          size: 13
        },
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = formatNumber(context.parsed);
            return `${label}: ${value} ₽`;
          }
        }
      }
    },
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 1000
    }
  };

  const total = Object.values(budgetDistribution).reduce((sum, value) => sum + value, 0);

  return (
    <div className="space-y-4">
      <div className="chart-container">
        <Doughnut data={data} options={options} />
      </div>
      
      {/* Сводка по распределению */}
      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">{t('totalBudget') || 'Общий бюджет'}</p>
          <p className="text-xl font-bold text-gray-900">{formatNumber(total)} {t('rublesSymbol')}</p>
        </div>
        <div className="text-center p-3 bg-primary-50 rounded-lg">
          <p className="text-sm text-primary-600">{t('investmentsPerYear') || 'Инвестиции в год'}</p>
          <p className="text-xl font-bold text-primary-900">
            {formatNumber(budgetDistribution.investments * 12)} {t('rublesSymbol')}
          </p>
        </div>
      </div>

      {/* Процентное соотношение */}
      <div className="grid grid-cols-4 gap-2 text-center text-xs">
        <div className="p-3 bg-gray-200 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600">
          <div className="w-4 h-4 bg-gray-500 rounded-full mx-auto mb-2"></div>
          <span className="font-semibold text-gray-800 dark:text-gray-200">50%</span>
        </div>
        <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-lg border border-primary-300 dark:border-primary-700">
          <div className="w-4 h-4 bg-primary-500 rounded-full mx-auto mb-2"></div>
          <span className="font-semibold text-primary-800 dark:text-primary-200">25%</span>
        </div>
        <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg border border-green-300 dark:border-green-700">
          <div className="w-4 h-4 bg-green-500 rounded-full mx-auto mb-2"></div>
          <span className="font-semibold text-green-800 dark:text-green-200">15%</span>
        </div>
        <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg border border-red-300 dark:border-red-700">
          <div className="w-4 h-4 bg-red-500 rounded-full mx-auto mb-2"></div>
          <span className="font-semibold text-red-800 dark:text-red-200">10%</span>
        </div>
      </div>
    </div>
  );
} 