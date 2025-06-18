import React from 'react';

export default function FinancialStrategyCard({ selectedStrategy, onStrategyChange }) {
  const strategies = [
    {
      id: 'conservative',
      title: 'Умеренная стратегия',
      subtitle: 'Низкий риск',
      description: 'Банковские вклады, ОФЗ, стабильные дивиденды',
      expectedReturn: '5-8% годовых',
      riskLevel: 'Минимальный',
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
      pros: ['Стабильность', 'Защита от инфляции', 'Предсказуемость'],
      cons: ['Низкая доходность', 'Медленный рост']
    },
    {
      id: 'moderate',
      title: 'Умеренно рискованная',
      subtitle: 'Средний риск',
      description: 'Индексные фонды, ETF, смешанный портфель',
      expectedReturn: '8-12% годовых',
      riskLevel: 'Средний',
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
      pros: ['Баланс риска/доходности', 'Диверсификация', 'Рост выше инфляции'],
      cons: ['Возможные колебания', 'Требует знаний']
    },
    {
      id: 'aggressive',
      title: 'Рискованная стратегия',
      subtitle: 'Высокий риск',
      description: 'Акции роста, стартапы, криптовалюты',
      expectedReturn: '12-25% годовых',
      riskLevel: 'Высокий',
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
      pros: ['Высокая потенциальная доходность', 'Быстрый рост капитала'],
      cons: ['Высокая волатильность', 'Можете потерять деньги', 'Стресс']
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          📊 Выберите инвестиционную стратегию
        </h3>
        <p className="text-gray-600">
          Как вы хотите инвестировать свои 15% дохода? Это повлияет на рекомендации и прогнозы.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {strategies.map((strategy) => (
          <div
            key={strategy.id}
            onClick={() => onStrategyChange(strategy)}
            className={`card cursor-pointer transition-all duration-200 hover:shadow-xl ${
              selectedStrategy?.id === strategy.id
                ? `${strategy.borderColor} border-2 ${strategy.bgColor}`
                : 'border-gray-200 hover:border-primary-300'
            }`}
          >
            {/* Заголовок */}
            <div className="text-center mb-4">
              <div className={`w-16 h-16 ${strategy.color} rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-3`}>
                {strategy.icon}
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-1">
                {strategy.title}
              </h4>
              <p className={`text-sm font-medium ${strategy.textColor}`}>
                {strategy.subtitle}
              </p>
            </div>

            {/* Основная информация */}
            <div className="space-y-3 mb-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Инструменты:</p>
                <p className="text-sm font-medium text-gray-900">
                  {strategy.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-gray-600">Доходность:</p>
                  <p className="font-semibold text-green-600">{strategy.expectedReturn}</p>
                </div>
                <div>
                  <p className="text-gray-600">Риск:</p>
                  <p className={`font-semibold ${strategy.textColor}`}>{strategy.riskLevel}</p>
                </div>
              </div>
            </div>

            {/* Распределение портфеля */}
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-900 mb-2">Распределение портфеля:</p>
              <div className="space-y-1">
                {Object.entries(strategy.investmentSplit).map(([type, percentage]) => (
                  <div key={type} className="flex justify-between text-xs">
                    <span className="text-gray-600 capitalize">
                      {type === 'bonds' ? 'Облигации' : 
                       type === 'stocks' ? 'Акции' : 
                       type === 'alternative' ? 'Альтернативы' : 'Наличные'}:
                    </span>
                    <span className="font-medium">{percentage}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Плюсы и минусы */}
            <div className="grid grid-cols-1 gap-3 text-xs">
              <div>
                <p className="font-medium text-green-700 mb-1">✅ Плюсы:</p>
                <ul className="space-y-0.5 text-green-600">
                  {strategy.pros.map((pro, index) => (
                    <li key={index}>• {pro}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="font-medium text-red-700 mb-1">⚠️ Риски:</p>
                <ul className="space-y-0.5 text-red-600">
                  {strategy.cons.map((con, index) => (
                    <li key={index}>• {con}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Индикатор выбора */}
            {selectedStrategy?.id === strategy.id && (
              <div className="mt-4 text-center">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${strategy.bgColor} ${strategy.textColor}`}>
                  ✓ Выбрано
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Предупреждение о рисках */}
      <div className="card bg-yellow-50 border-yellow-200">
        <div className="flex items-start">
          <span className="text-2xl mr-3">⚠️</span>
          <div>
            <h4 className="font-semibold text-yellow-900 mb-1">
              Важно помнить о рисках
            </h4>
            <p className="text-sm text-yellow-800">
              Прошлая доходность не гарантирует будущих результатов. 
              Инвестируйте только те деньги, которые можете позволить себе потерять. 
              Рассмотрите консультацию с финансовым консультантом.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 