import React, { useState, useEffect } from 'react';
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
  const { saveMonthlyIncome, saveStrategy, isAuthenticated, user } = useAuth();
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [budgetDistribution, setBudgetDistribution] = useState({
    needs: 0,        // 50% - Обязательные расходы
    safety: 0,       // 25% - Подушка безопасности  
    investments: 0,  // 15% - Инвестиции
    wants: 0         // 10% - Развлечения и желания
  });
  const [notifications, setNotifications] = useState([]);
  const [selectedStrategy, setSelectedStrategy] = useState(null);
  const [savingsGoal, setSavingsGoal] = useState(null);

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
  const generateNotifications = (income, budget, strategy, goal) => {
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
      const monthlyReturn = budget.investments * (expectedReturn / 100 / 12);
      const yearlyProjection = budget.investments * 12 * (1 + expectedReturn / 100);
      
      notifications.push({
        id: 4,
        type: 'info',
        title: `Прогноз для ${strategy.title.toLowerCase()}`,
        message: `При стратегии "${strategy.title}" ваши ${budget.investments.toLocaleString()} руб в месяц могут превратиться в ~${Math.round(yearlyProjection).toLocaleString()} руб через год (${strategy.expectedReturn}).`,
        icon: strategy.icon
      });

      // Предупреждения по рискам
      if (strategy.id === 'aggressive' && income < 50000) {
        notifications.push({
          id: 5,
          type: 'warning',
          title: 'Высокий риск при низком доходе',
          message: 'Рискованная стратегия может быть слишком стрессовой при доходе менее 50,000 руб. Рассмотрите умеренную стратегию.',
          icon: '⚠️'
        });
      }
    }

    // Уведомления по цели
    if (goal && budget.safety > 0) {
      const monthsToGoal = Math.ceil((goal.targetAmount - goal.currentAmount) / budget.safety);
      notifications.push({
        id: 6,
        type: 'success',
        title: `Прогресс по цели "${goal.title}"`,
        message: `Откладывая ${budget.safety.toLocaleString()} руб в месяц, вы достигнете цели через ${monthsToGoal} ${monthsToGoal === 1 ? 'месяц' : monthsToGoal < 5 ? 'месяца' : 'месяцев'}!`,
        icon: '🎯'
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

  // Загрузка данных пользователя при авторизации
  useEffect(() => {
    if (isAuthenticated && user?.financialData) {
      const data = user.financialData;
      if (data.monthlyIncome) {
        setMonthlyIncome(data.monthlyIncome);
      }
      if (data.budgetDistribution) {
        setBudgetDistribution(data.budgetDistribution);
      }
      if (data.selectedStrategy) {
        // Найти стратегию по ID
        const strategies = [
          { id: 'conservative', title: 'Консервативная стратегия' },
          { id: 'moderate', title: 'Умеренная стратегия' },
          { id: 'aggressive', title: 'Агрессивная стратегия' }
        ];
        const strategy = strategies.find(s => s.id === data.selectedStrategy);
        setSelectedStrategy(strategy);
      }
      if (data.savingsGoals && data.savingsGoals.length > 0) {
        setSavingsGoal(data.savingsGoals[0]); // Пока поддерживаем одну цель
      }
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    if (monthlyIncome > 0) {
      const budget = calculateBudget(monthlyIncome);
      setBudgetDistribution(budget);
      setNotifications(generateNotifications(monthlyIncome, budget, selectedStrategy, savingsGoal));
      
      // Автосохранение в БД если пользователь авторизован
      if (isAuthenticated) {
        saveMonthlyIncome(monthlyIncome, budget);
      }
    }
  }, [monthlyIncome, selectedStrategy, savingsGoal, isAuthenticated]);

  // Автосохранение стратегии
  useEffect(() => {
    if (selectedStrategy && isAuthenticated) {
      saveStrategy(selectedStrategy);
    }
  }, [selectedStrategy, isAuthenticated]);

  return (
    <div className="space-y-8 fade-in">
      {/* Заголовок */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          💰 {t('financialManagement')}
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          {t('budgetDistributionRule')} <span className="font-semibold text-primary-600">50-25-15-10</span> {t('fromMarkTilbury')}
        </p>
      </div>

      {/* Форма ввода дохода */}
      <div className="max-w-md mx-auto">
        <IncomeForm 
          monthlyIncome={monthlyIncome}
          setMonthlyIncome={setMonthlyIncome}
        />
      </div>

      {monthlyIncome > 0 && (
        <>
          {/* Карточки распределения бюджета */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
              subtitle={`15${t('percentFromIncome')}`}
              amount={budgetDistribution.investments}
              color="bg-green-500"
              description={selectedStrategy ? `${selectedStrategy.description}` : t('investmentsDesc')}
              icon="📈"
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
            onStrategyChange={setSelectedStrategy}
          />

          {/* Цели накопления */}
          <SavingsGoalCard
            goal={savingsGoal}
            onGoalChange={setSavingsGoal}
            monthlyBudget={budgetDistribution}
          />

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
                🎯 Правило 50-25-15-10 от Mark Tilbury
              </h3>
              <p className="text-primary-700 text-sm">
                Это проверенная временем формула финансового успеха. Следуя этому правилу, 
                вы обеспечите себе финансовую стабильность и создадите капитал для будущего.
              </p>
              <div className="mt-4 flex justify-center space-x-4 text-xs text-primary-600">
                <span>✅ Покрытие всех нужд</span>
                <span>✅ Финансовая подушка</span>
                <span>✅ Рост капитала</span>
                <span>✅ Качество жизни</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
} 