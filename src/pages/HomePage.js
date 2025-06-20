import React, { useState, useEffect, useCallback, useRef } from 'react';
import BudgetChart from '../components/charts/BudgetChart';
import BudgetRuleCard from '../components/forms/BudgetRuleCard';
import IncomeForm from '../components/forms/IncomeForm';
import NotificationCard from '../components/common/NotificationCard';
import FinancialStrategyCard from '../components/forms/FinancialStrategyCard';
import SavingsGoalCard from '../components/forms/SavingsGoalCard';
import { useTranslation } from '../utils/translations';
import { useAuth } from '../contexts/AuthContext';

export default function HomePage() {
  const { t } = useTranslation();
  const { saveMonthlyIncome, saveStrategy, saveSavingsGoals, isAuthenticated, user } = useAuth();
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [budgetDistribution, setBudgetDistribution] = useState({
    needs: 0,        // 50% - Обязательные расходы
    safety: 0,       // 25% - Подушка безопасности  
    investments: 0,  // 15% - Инвестиции
    wants: 0         // 10% - Развлечения и желания
  });
  const [notifications, setNotifications] = useState([]);
  const [selectedStrategy, setSelectedStrategy] = useState(null);
  const [savingsGoals, setSavingsGoals] = useState([]);
  
  // Отслеживание была ли выполнена первоначальная загрузка
  const hasLoadedInitialData = useRef(false);
  
  // Мемоизированная функция обновления стратегии для стабильности
  const handleStrategyChange = useCallback((newStrategy) => {
    // Проверяем что стратегия действительно изменилась
    if (!selectedStrategy || selectedStrategy.id !== newStrategy.id) {
      setSelectedStrategy(newStrategy);
    }
  }, [selectedStrategy]);

  // Правило 50-25-15-10 Mark Tilbury
  const calculateBudget = (income) => {
    return {
      needs: Math.round(income * 0.50),
      safety: Math.round(income * 0.25),
      investments: Math.round(income * 0.15),
      wants: Math.round(income * 0.10)
    };
  };

  // Генерация уведомлений и советов с учётом стратегии
  const generateNotifications = (income, budget, strategy, goals) => {
    const notifications = [];

    if (income < 30000) {
      notifications.push({
        id: 1,
        type: 'warning',
        title: t('language') === 'ru' ? 'Низкий доход' : 'Low Income',
        message: t('lowIncomeWarning'),
        icon: '⚠️'
      });
    }

    if (income > 100000) {
      notifications.push({
        id: 2,
        type: 'success',
        title: t('language') === 'ru' ? 'Отличный доход!' : 'Great Income!',
        message: t('highIncomeAdvice'),
        icon: '💪'
      });
    }

    if (budget.wants > 10000) {
      notifications.push({
        id: 3,
        type: 'danger',
        title: t('language') === 'ru' ? 'Много трат на желания' : 'High Entertainment Spending',
        message: t('highSpendingWarning'),
        icon: '🚨'
      });
    }

    // Уведомления в зависимости от стратегии
    if (strategy) {
      const expectedReturn = getExpectedReturn(strategy.id);
      const yearlyProjection = budget.investments * 12 * (1 + expectedReturn / 100);
      
      notifications.push({
        id: 4,
        type: 'info',
        title: `${t('strategyForecastFor')} ${strategy.title.toLowerCase()}`,
        message: `${t('strategyProjection')} "${strategy.title}" ${t('monthlyInvestment')} ${budget.investments.toLocaleString()} ${t('rubPerMonth')} ~${Math.round(yearlyProjection).toLocaleString()} ${t('rubThroughYear')} (${strategy.expectedReturn}).`,
        icon: strategy.icon
      });

      // Предупреждения по рискам
      if (strategy.id === 'aggressive' && income < 50000) {
        notifications.push({
          id: 5,
          type: 'warning',
          title: t('highRiskLowIncome'),
          message: t('aggressiveRiskWarning'),
          icon: '⚠️'
        });
      }
    }

    // Уведомления по целям
    if (goals && goals.length > 0 && budget.safety > 0) {
      goals.forEach((goal, index) => {
        const monthsToGoal = Math.ceil((goal.targetAmount - goal.currentAmount) / budget.safety);
        const monthWord = monthsToGoal === 1 ? t('monthWord') : monthsToGoal < 5 ? t('monthsWord2') : t('monthsWord');
        notifications.push({
          id: 6 + index,
          type: 'success',
          title: `${t('savingsProgress')} "${goal.title}"`,
          message: `${t('savingMonthly')} ${budget.safety.toLocaleString()} ${t('achieveGoalInStrategy')} ${monthsToGoal} ${monthWord}!`,
          icon: '🎯'
        });
      });
    }

    return notifications;
  };

  // Функция для получения ожидаемой доходности по стратегии
  const getExpectedReturn = (strategyId) => {
    switch (strategyId) {
      case 'conservative': return 6.5; // 5-8% среднее 6.5%
      case 'moderate': return 10; // 8-12% среднее 10%
      case 'aggressive': return 18; // 12-25% среднее 18%
      default: return 10;
    }
  };

  // Функция для создания объекта стратегии по ID (синхронизировано с FinancialStrategyCard)
  const createStrategyById = useCallback((strategyId) => {
    const strategiesMap = {
      'conservative': {
        id: 'conservative',
        title: t('conservativeTitle'),
        subtitle: t('conservativeSubtitle'),
        description: t('conservativeDescription'),
        expectedReturn: t('conservativeReturn'),
        riskLevel: t('conservativeRisk'),
        icon: '🛡️'
      },
      'moderate': {
        id: 'moderate',
        title: t('moderateTitle'),
        subtitle: t('moderateSubtitle'),
        description: t('moderateDescription'),
        expectedReturn: t('moderateReturn'),
        riskLevel: t('moderateRisk'),
        icon: '⚖️'
      },
      'aggressive': {
        id: 'aggressive',
        title: t('aggressiveTitle'),
        subtitle: t('aggressiveSubtitle'),
        description: t('aggressiveDescription'),
        expectedReturn: t('aggressiveReturn'),
        riskLevel: t('aggressiveRisk'),
        icon: '🚀'
      }
    };
    
    return strategiesMap[strategyId] || null;
  }, [t]);

  // Загрузка данных пользователя при авторизации (один раз)
  useEffect(() => {
    if (isAuthenticated && user?.financialData && !hasLoadedInitialData.current) {
      const data = user.financialData;
      console.log('Первоначальная загрузка данных пользователя');
      
      if (data.monthlyIncome) {
        console.log('Загружаем месячный доход:', data.monthlyIncome);
        setMonthlyIncome(data.monthlyIncome);
      }
      
      if (data.budgetDistribution) {
        console.log('Загружаем распределение бюджета');
        setBudgetDistribution(data.budgetDistribution);
      }
      
      if (data.selectedStrategy) {
        console.log('Загружаем сохраненную стратегию:', data.selectedStrategy);
        const strategy = createStrategyById(data.selectedStrategy);
        setSelectedStrategy(strategy);
      }
      
      if (data.savingsGoals && data.savingsGoals.length > 0) {
        console.log('Загружаем цели накопления из БД:', data.savingsGoals);
        setSavingsGoals(data.savingsGoals);
      } else {
        console.log('Нет сохраненных целей в БД');
      }
      
      // Отмечаем что данные загружены
      hasLoadedInitialData.current = true;
    }
  }, [isAuthenticated, user?.financialData, createStrategyById]);

  // Сброс флага загрузки при смене пользователя
  useEffect(() => {
    if (!isAuthenticated) {
      hasLoadedInitialData.current = false;
      console.log('Сбросили флаг загрузки данных');
    }
  }, [isAuthenticated]);

  // Обновление стратегии при смене языка (только если стратегия уже выбрана)
  useEffect(() => {
    if (selectedStrategy?.id) {
      const updatedStrategy = createStrategyById(selectedStrategy.id);
      // Обновляем только если заголовок действительно изменился (смена языка)
      if (updatedStrategy && updatedStrategy.title !== selectedStrategy.title) {
        setSelectedStrategy(updatedStrategy);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t, createStrategyById]); // Намеренно НЕ включаем selectedStrategy - обновляем только при смене языка

  useEffect(() => {
    if (monthlyIncome > 0) {
      const budget = calculateBudget(monthlyIncome);
      setBudgetDistribution(budget);
      setNotifications(generateNotifications(monthlyIncome, budget, selectedStrategy, savingsGoals));
      
      // Автосохранение в БД если пользователь авторизован
      if (isAuthenticated) {
        saveMonthlyIncome(monthlyIncome, budget);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [monthlyIncome, selectedStrategy, savingsGoals, isAuthenticated, saveMonthlyIncome]);

  // Автосохранение стратегии (только если изменилась)
  useEffect(() => {
    if (selectedStrategy && isAuthenticated && user?.financialData) {
      // Сохраняем только если стратегия действительно изменилась
      const currentSavedStrategy = user.financialData.selectedStrategy;
      if (currentSavedStrategy !== selectedStrategy.id) {
        console.log('Сохраняем новую стратегию:', selectedStrategy.id);
        saveStrategy(selectedStrategy);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedStrategy, isAuthenticated, saveStrategy, user?.financialData?.selectedStrategy]);

  return (
    <div className="space-y-8 fade-in">
      {/* Заголовок */}
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4">
          💰 {t('financialManagement')}
        </h1>
        <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto px-4">
          {t('budgetDistributionRule')} <span className="font-semibold text-primary-600">50-25-15-10</span> {t('fromMarkTilbury')}
        </p>
      </div>

      {/* Форма ввода дохода */}
      <div className="max-w-md mx-auto px-4 md:px-0">
        <IncomeForm 
          monthlyIncome={monthlyIncome}
          setMonthlyIncome={setMonthlyIncome}
        />
      </div>

      {monthlyIncome > 0 && (
        <>
          {/* Карточки распределения бюджета */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 px-2 md:px-0">
            <BudgetRuleCard
              title={t('essentialExpenses')}
              subtitle={`50${t('percentFromIncome')}`}
              amount={budgetDistribution.needs}
              color="bg-gray-500"
              description={t('essentialDesc')}
              icon="🏠"
            />
            <BudgetRuleCard
              title={t('emergencyFund')}
              subtitle={`25${t('percentFromIncome')}`}
              amount={budgetDistribution.safety}
              color="bg-primary-500"
              description={t('emergencyDesc')}
              icon="🛡️"
            />
            <BudgetRuleCard
              title={t('investments')}
              subtitle={selectedStrategy ? `${selectedStrategy.title} • 15${t('percentFromIncome')}` : `15${t('percentFromIncome')}`}
              amount={budgetDistribution.investments}
              color="bg-green-500"
              description={selectedStrategy ? `${selectedStrategy.icon} ${selectedStrategy.description}\n${selectedStrategy.expectedReturn}` : t('investmentsDesc')}
              icon={selectedStrategy ? selectedStrategy.icon : "📈"}
            />
            <BudgetRuleCard
              title={t('entertainment')}
              subtitle={`10${t('percentFromIncome')}`}
              amount={budgetDistribution.wants}
              color="bg-danger-500"
              description={t('entertainmentDesc')}
              icon="🎉"
            />
          </div>

          {/* Финансовая стратегия */}
          <FinancialStrategyCard
            selectedStrategy={selectedStrategy}
            onStrategyChange={handleStrategyChange}
          />

          {/* Цели накопления */}
          <div className="space-y-6">
            {savingsGoals.map((goal, index) => (
              <SavingsGoalCard
                key={goal.id || index}
                goal={goal}
                onGoalChange={(updatedGoal) => {
                  if (updatedGoal === null) {
                    // Удаление цели
                    const newGoals = savingsGoals.filter((_, i) => i !== index);
                    console.log('Удаляем цель, новый массив:', newGoals);
                    setSavingsGoals(newGoals);
                    if (isAuthenticated) {
                      saveSavingsGoals(newGoals);
                    }
                  } else {
                    // Обновление цели
                    const newGoals = [...savingsGoals];
                    newGoals[index] = updatedGoal;
                    console.log('Обновляем цель, новый массив:', newGoals);
                    setSavingsGoals(newGoals);
                    if (isAuthenticated) {
                      saveSavingsGoals(newGoals);
                    }
                  }
                }}
                monthlyBudget={budgetDistribution}
              />
            ))}
            
            {/* Кнопка добавления новой цели */}
            <div className="card bg-gradient-to-r from-primary-50 to-blue-50 border-primary-200 text-center">
              <div className="text-4xl mb-3">🎯</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {t('setSavingsGoal')}
              </h3>
              <p className="text-gray-600 mb-4">
                {t('addNewGoalDescription')}
              </p>
              <button
                onClick={() => {
                  const newGoal = {
                    id: Date.now(),
                    title: '',
                    targetAmount: '',
                    currentAmount: 0,
                    deadline: '',
                    category: 'other',
                    priority: 'medium'
                  };
                  const updatedGoals = [...savingsGoals, newGoal];
                  console.log('Добавляем новую цель, новый массив:', updatedGoals);
                  setSavingsGoals(updatedGoals);
                }}
                className="btn-primary"
              >
                📝 {t('setSavingsGoal')}
              </button>
            </div>
          </div>

          {/* Диаграмма распределения */}
          <div className="max-w-2xl mx-auto">
            <div className="card">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">
                {t('budgetVisualization')}
              </h3>
              <BudgetChart budgetDistribution={budgetDistribution} />
            </div>
          </div>

          {/* Уведомления и рекомендации */}
          {notifications.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900 text-center">
                💡 {t('personalRecommendations')}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {notifications.map((notification) => (
                  <NotificationCard key={notification.id} notification={notification} />
                ))}
              </div>
            </div>
          )}

          {/* Дополнительная информация */}
          <div className="card bg-gradient-to-r from-primary-50 to-blue-50 border-primary-200">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-primary-900 mb-2">
                🎯 {t('markTilburyRuleTitle')}
              </h3>
              <p className="text-primary-700 text-sm">
                {t('markTilburyRuleDesc')}
              </p>
              <div className="mt-4 flex justify-center space-x-4 text-xs text-primary-600">
                <span>✅ {t('needsCategoryDesc')}</span>
                <span>✅ {t('savingsCategoryDesc')}</span>
                <span>✅ {t('investmentsCategoryDesc')}</span>
                <span>✅ {t('wantsCategoryDesc')}</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
} 