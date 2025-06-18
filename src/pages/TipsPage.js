import React from 'react';
import { useTranslation } from '../utils/translations';

export default function TipsPage() {
  const { t, language } = useTranslation();
  
  const beginnerTips = language === 'ru' ? [
    {
      title: "Ведите учёт доходов и расходов",
      description: "Записывайте все траты в течение месяца. Используйте мобильные приложения или обычный блокнот.",
      icon: "📝",
      difficulty: t('beginner')
    },
    {
      title: "Создайте подушку безопасности",
      description: "Откладывайте 25% дохода на экстренные случаи. Цель: 3-6 месячных расходов на отдельном счёте.",
      icon: "🛡️",
      difficulty: t('beginner')
    },
    {
      title: "Избегайте спонтанных покупок",
      description: "Перед крупной покупкой подождите 24 часа. Спросите себя: 'Действительно ли мне это нужно?'",
      icon: "🛑",
      difficulty: t('beginner')
    },
    {
      title: "Автоматизируйте накопления",
      description: "Настройте автоперевод 25% зарплаты на накопительный счёт в день получения дохода.",
      icon: "🤖",
      difficulty: t('beginner')
    }
  ] : [
    {
      title: "Track Income and Expenses",
      description: "Record all expenses during the month. Use mobile apps or a regular notebook.",
      icon: "📝",
      difficulty: t('beginner')
    },
    {
      title: "Create Emergency Fund",
      description: "Save 25% of income for emergencies. Goal: 3-6 months of expenses in a separate account.",
      icon: "🛡️",
      difficulty: t('beginner')
    },
    {
      title: "Avoid Impulse Purchases",
      description: "Before a large purchase wait 24 hours. Ask yourself: 'Do I really need this?'",
      icon: "🛑",
      difficulty: t('beginner')
    },
    {
      title: "Automate Savings",
      description: "Set up auto-transfer of 25% salary to savings account on payday.",
      icon: "🤖",
      difficulty: t('beginner')
    }
  ];

  const intermediateTips = language === 'ru' ? [
    {
      title: "Инвестируйте в индексные фонды",
      description: "Начните с ETF на российский рынок (TMOS, SBMX). Они дают доходность выше депозитов при умеренном риске.",
      icon: "📈",
      difficulty: t('intermediate')
    },
    {
      title: "Откройте ИИС",
      description: "Индивидуальный инвестиционный счёт даёт налоговый вычет до 52,000 руб в год + доходность от инвестиций.",
      icon: "💰",
      difficulty: t('intermediate')
    },
    {
      title: "Диверсифицируйте активы",
      description: "Распределите инвестиции: 60% акции, 30% облигации, 10% валюта. Не вкладывайте всё в одну корзину.",
      icon: "🎯",
      difficulty: t('intermediate')
    },
    {
      title: "Изучите налоговые льготы",
      description: "Используйте налоговые вычеты: лечение, обучение, ипотека, ИИС, пенсионные взносы.",
      icon: "📋",
      difficulty: t('intermediate')
    }
  ] : [
    {
      title: "Invest in Index Funds",
      description: "Start with ETFs on Russian market (TMOS, SBMX). They provide returns above deposits with moderate risk.",
      icon: "📈",
      difficulty: t('intermediate')
    },
    {
      title: "Open IIS Account",
      description: "Individual Investment Account provides tax deduction up to 52,000 RUB per year + investment returns.",
      icon: "💰",
      difficulty: t('intermediate')
    },
    {
      title: "Diversify Assets",
      description: "Distribute investments: 60% stocks, 30% bonds, 10% currency. Don't put all eggs in one basket.",
      icon: "🎯",
      difficulty: t('intermediate')
    },
    {
      title: "Learn Tax Benefits",
      description: "Use tax deductions: medical, education, mortgage, IIS, pension contributions.",
      icon: "📋",
      difficulty: t('intermediate')
    }
  ];

  const advancedTips = language === 'ru' ? [
    {
      title: "Создайте пассивный доход",
      description: "Инвестируйте в дивидендные акции, REIT, облигации. Цель: пассивный доход покрывает базовые расходы.",
      icon: "🏦",
      difficulty: t('advanced')
    },
    {
      title: "Рефинансируйте кредиты",
      description: "Регулярно сравнивайте условия кредитов. Снижение ставки на 1% экономит тысячи рублей.",
      icon: "📉",
      difficulty: t('advanced')
    },
    {
      title: "Планируйте на 20+ лет",
      description: "Составьте план достижения финансовой независимости. Используйте силу сложного процента.",
      icon: "🔮",
      difficulty: t('advanced')
    },
    {
      title: "Изучайте международные рынки",
      description: "Рассмотрите ETF на S&P 500, развивающиеся рынки. Валютная диверсификация защищает от рисков рубля.",
      icon: "🌍",
      difficulty: t('advanced')
    }
  ] : [
    {
      title: "Create Passive Income",
      description: "Invest in dividend stocks, REITs, bonds. Goal: passive income covers basic expenses.",
      icon: "🏦",
      difficulty: t('advanced')
    },
    {
      title: "Refinance Loans",
      description: "Regularly compare loan conditions. 1% rate reduction saves thousands of rubles.",
      icon: "📉",
      difficulty: t('advanced')
    },
    {
      title: "Plan 20+ Years Ahead",
      description: "Create a financial independence plan. Use the power of compound interest.",
      icon: "🔮",
      difficulty: t('advanced')
    },
    {
      title: "Study International Markets",
      description: "Consider S&P 500 ETFs, emerging markets. Currency diversification protects from ruble risks.",
      icon: "🌍",
      difficulty: t('advanced')
    }
  ];

  const commonMistakes = language === 'ru' ? [
    {
      title: "Инвестирование без подушки безопасности",
      description: "Не инвестируйте пока не накопили 3-6 месячных расходов на чёрный день",
      icon: "❌"
    },
    {
      title: "Покупка по рекомендациям из соцсетей",
      description: "Не следуйте слепо советам блогеров. Изучайте компании самостоятельно",
      icon: "📱"
    },
    {
      title: "Попытки 'поймать дно' рынка",
      description: "Регулярные инвестиции (DCA) эффективнее попыток угадать лучшее время",
      icon: "📊"
    },
    {
      title: "Игнорирование инфляции",
      description: "Деньги под матрасом теряют покупательную способность. Инвестируйте выше уровня инфляции",
      icon: "💸"
    }
  ] : [
    {
      title: "Investing Without Emergency Fund",
      description: "Don't invest until you have 3-6 months of expenses saved for emergencies",
      icon: "❌"
    },
    {
      title: "Buying Based on Social Media Tips",
      description: "Don't blindly follow blogger advice. Research companies independently",
      icon: "📱"
    },
    {
      title: "Trying to 'Catch the Bottom'",
      description: "Regular investing (DCA) is more effective than trying to time the market",
      icon: "📊"
    },
    {
      title: "Ignoring Inflation",
      description: "Cash under the mattress loses purchasing power. Invest above inflation rate",
      icon: "💸"
    }
  ];

  const TipCard = ({ tip, category = "" }) => (
    <div className="card hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center">
          <span className="text-2xl mr-3">{tip.icon}</span>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">{tip.title}</h3>
            {tip.difficulty && (
              <span className={`text-xs px-2 py-1 rounded-full ${
                tip.difficulty === t('beginner') ? 'bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-300' :
                tip.difficulty === t('intermediate') ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-800 dark:text-yellow-300' :
                'bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-300'
              }`}>
                {tip.difficulty}
              </span>
            )}
          </div>
        </div>
      </div>
      <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{tip.description}</p>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 fade-in">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          💡 {t('financialTips')}
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          {t('practicalRecommendations')}
        </p>
      </div>

      {/* Советы для новичков */}
      <section>
        <div className="flex items-center mb-6">
          <span className="text-3xl mr-3">🌱</span>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('forBeginners')}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {beginnerTips.map((tip, index) => (
            <TipCard key={index} tip={tip} />
          ))}
        </div>
      </section>

      {/* Советы среднего уровня */}
      <section>
        <div className="flex items-center mb-6">
          <span className="text-3xl mr-3">📊</span>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('intermediateLevel')}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {intermediateTips.map((tip, index) => (
            <TipCard key={index} tip={tip} />
          ))}
        </div>
      </section>

      {/* Продвинутые советы */}
      <section>
        <div className="flex items-center mb-6">
          <span className="text-3xl mr-3">🚀</span>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('advancedLevel')}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {advancedTips.map((tip, index) => (
            <TipCard key={index} tip={tip} />
          ))}
        </div>
      </section>

      {/* Частые ошибки */}
      <section>
        <div className="flex items-center mb-6">
          <span className="text-3xl mr-3">⚠️</span>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('commonMistakes')}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {commonMistakes.map((mistake, index) => (
            <div key={index} className="card bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 hover:shadow-lg transition-shadow duration-200">
              <div className="flex items-start mb-3">
                <span className="text-2xl mr-3">{mistake.icon}</span>
                <div>
                  <h3 className="font-semibold text-red-900 dark:text-red-300">{mistake.title}</h3>
                </div>
              </div>
              <p className="text-red-800 dark:text-red-400 text-sm leading-relaxed">{mistake.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Калькулятор сложного процента */}
      <section className="card bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
        <div className="text-center mb-6">
          <span className="text-4xl mb-4 block">🧮</span>
          <h2 className="text-2xl font-bold text-blue-900 dark:text-blue-300 mb-2">{t('compoundInterestPower')}</h2>
          <p className="text-blue-700 dark:text-blue-400">
            {t('compoundInterestExample')}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">1,35 млн ₽</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">{t('years10')}</div>
          </div>
          <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">4,2 млн ₽</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">{t('years20')}</div>
          </div>
          <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">12,8 млн ₽</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">{t('years30')}</div>
          </div>
        </div>
        
        <div className="mt-4 text-center">
          <p className="text-sm text-blue-700 dark:text-blue-400">
            💡 {t('startEarly')}
          </p>
        </div>
      </section>

      {/* Полезные ресурсы */}
      <section>
        <div className="flex items-center mb-6">
          <span className="text-3xl mr-3">📚</span>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('usefulResources')}</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="card text-center">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">📖 {t('books')}</h3>
            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
              <li>• "Богатый папа, бедный папа" - Р. Кийосаки</li>
              <li>• "Самый богатый человек в Вавилоне"</li>
              <li>• "Разумный инвестор" - Б. Грэхэм</li>
            </ul>
          </div>
          
          <div className="card text-center">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">🎥 {t('youtube')}</h3>
            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
              <li>• Mark Tilbury</li>
              <li>• Финансовый советник</li>
              <li>• InvestFuture</li>
            </ul>
          </div>
          
          <div className="card text-center">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">💻 {t('websites')}</h3>
            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
              <li>• smart-lab.ru</li>
              <li>• cbr.ru (официальные данные)</li>
              <li>• investfunds.ru</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Призыв к действию */}
      <div className="card bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800 text-center">
        <span className="text-4xl mb-4 block">🎯</span>
        <h2 className="text-2xl font-bold text-green-900 dark:text-green-300 mb-2">{t('startNow')}</h2>
        <p className="text-green-700 dark:text-green-400 mb-4">
          {t('bestDay')}
        </p>
        <div className="flex justify-center space-x-4">
          <a href="/" className="btn-primary">📊 {t('calculateButton')}</a>
          <a href="/test" className="btn-secondary">🧠 {t('test')}</a>
        </div>
      </div>
    </div>
  );
} 