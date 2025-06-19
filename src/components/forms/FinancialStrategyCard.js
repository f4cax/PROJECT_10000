import React from 'react';
import { useTranslation } from '../../utils/translations';

export default function FinancialStrategyCard({ selectedStrategy, onStrategyChange }) {
  const { t } = useTranslation();
  
  const strategies = [
    {
      id: 'conservative',
      title: t('conservativeTitle'),
      subtitle: t('conservativeSubtitle'),
      description: t('conservativeDescription'),
      expectedReturn: t('conservativeReturn'),
      riskLevel: t('conservativeRisk'),
      color: 'bg-green-500',
      borderColor: 'border-green-200',
      textColor: 'text-green-800',
      bgColor: 'bg-green-50',
      icon: '🛡️',
      investmentSplit: {
        bonds: 70,    // Облигации и ОФЗ
        stocks: 20,   // Стабильные акции
        cash: 10      // Денежные средства
      },
      pros: [t('stability'), t('inflationProtection'), t('predictability')],
      cons: [t('lowReturn'), t('slowGrowth')]
    },
    {
      id: 'moderate',
      title: t('moderateTitle'),
      subtitle: t('moderateSubtitle'),
      description: t('moderateDescription'),
      expectedReturn: t('moderateReturn'),
      riskLevel: t('moderateRisk'),
      color: 'bg-primary-500',
      borderColor: 'border-primary-200',
      textColor: 'text-primary-800',
      bgColor: 'bg-primary-50',
      icon: '⚖️',
      investmentSplit: {
        bonds: 40,    // Облигации
        stocks: 50,   // Акции и ETF
        alternative: 10 // Альтернативные инвестиции
      },
      pros: [t('riskReturnBalance'), t('diversification'), t('growthAboveInflation')],
      cons: [t('possibleFluctuations'), t('requiresKnowledge')]
    },
    {
      id: 'aggressive',
      title: t('aggressiveTitle'),
      subtitle: t('aggressiveSubtitle'),
      description: t('aggressiveDescription'),
      expectedReturn: t('aggressiveReturn'),
      riskLevel: t('aggressiveRisk'),
      color: 'bg-danger-500',
      borderColor: 'border-red-200',
      textColor: 'text-red-800',
      bgColor: 'bg-red-50',
      icon: '🚀',
      investmentSplit: {
        stocks: 70,     // Акции роста
        alternative: 20, // Стартапы, криптовалюты
        cash: 10        // Резерв
      },
      pros: [t('highPotentialReturn'), t('fastCapitalGrowth')],
      cons: [t('highVolatility'), t('canLoseMoney'), t('stress')]
    }
  ];

  const handleStrategyClick = (strategy) => {
    // Создаем новый объект чтобы React правильно обновил состояние
    const newStrategy = { ...strategy };
    onStrategyChange(newStrategy);
  };

  const getInvestmentTypeLabel = (type) => {
    switch (type) {
      case 'bonds': return t('bonds');
      case 'stocks': return t('stocks');
      case 'alternative': return t('alternative');
      case 'cash': return t('cash');
      default: return type;
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          📊 {t('chooseInvestmentStrategy')}
        </h3>
        <p className="text-gray-600 dark:text-gray-300">
          {t('investmentStrategyDesc')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {strategies.map((strategy) => {
          const isSelected = selectedStrategy?.id === strategy.id;
          
          return (
            <div
              key={strategy.id}
              onClick={() => handleStrategyClick(strategy)}
              className={`card cursor-pointer transition-all duration-200 hover:shadow-xl ${
                isSelected
                  ? `${strategy.borderColor} border-2 ${strategy.bgColor} dark:bg-opacity-20`
                  : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600'
              }`}
            >
              {/* Заголовок */}
              <div className="text-center mb-4">
                <div className={`w-16 h-16 ${strategy.color} rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-3`}>
                  {strategy.icon}
                </div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  {strategy.title}
                </h4>
                <p className={`text-sm font-medium ${strategy.textColor} dark:text-opacity-90`}>
                  {strategy.subtitle}
                </p>
              </div>

              {/* Основная информация */}
              <div className="space-y-3 mb-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{t('instruments')}:</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {strategy.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">{t('expectedReturn')}:</p>
                    <p className="font-semibold text-green-600 dark:text-green-400">{strategy.expectedReturn}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">{t('risk')}:</p>
                    <p className={`font-semibold ${strategy.textColor} dark:text-opacity-90`}>{strategy.riskLevel}</p>
                  </div>
                </div>
              </div>

              {/* Распределение портфеля */}
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">{t('portfolioDistribution')}:</p>
                <div className="space-y-1">
                  {Object.entries(strategy.investmentSplit).map(([type, percentage]) => (
                    <div key={type} className="flex justify-between text-xs">
                      <span className="text-gray-600 dark:text-gray-400">
                        {getInvestmentTypeLabel(type)}:
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">{percentage}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Плюсы и минусы */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <p className="font-medium text-green-700 dark:text-green-400 mb-1">✅ {t('pros')}:</p>
                  <ul className="space-y-0.5 text-green-600 dark:text-green-400">
                    {strategy.pros.map((pro, index) => (
                      <li key={index} className="text-xs">• {pro}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="font-medium text-red-700 dark:text-red-400 mb-1">⚠️ {t('risks')}:</p>
                  <ul className="space-y-0.5 text-red-600 dark:text-red-400">
                    {strategy.cons.map((con, index) => (
                      <li key={index} className="text-xs">• {con}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Индикатор выбора */}
              {isSelected && (
                <div className="mt-4 text-center">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${strategy.bgColor} ${strategy.textColor} dark:bg-opacity-30`}>
                    ✓ {t('selected')}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Предупреждение о рисках */}
      <div className="bg-yellow-50 dark:bg-yellow-900 dark:bg-opacity-20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
        <div className="flex items-start">
          <span className="text-2xl mr-3">⚠️</span>
          <div>
            <h4 className="font-semibold text-yellow-900 dark:text-yellow-200 mb-1">
              {t('riskWarningTitle')}
            </h4>
            <p className="text-sm text-yellow-800 dark:text-yellow-300">
              {t('riskWarningText')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 