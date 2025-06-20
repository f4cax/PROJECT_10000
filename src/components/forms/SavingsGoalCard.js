import React, { useState } from 'react';
import { useTranslation } from '../../utils/translations';

export default function SavingsGoalCard({ goal, onGoalChange, monthlyBudget }) {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(!goal || !goal.title);
  const [showCongratulations, setShowCongratulations] = useState(false);
  const [tempGoal, setTempGoal] = useState(goal || {
    id: Date.now().toString(),
    title: '',
    targetAmount: '',
    currentAmount: 0,
    deadline: '',
    category: 'other',
    priority: 'medium',
    isFrozen: false,
    completedAt: null
  });

  // Автоматическое поздравление и заморозка при достижении цели
  React.useEffect(() => {
    if (goal && goal.targetAmount > 0 && !goal.isFrozen) {
      const progress = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
      
      // Если цель достигнута - показываем поздравление и замораживаем
      if (progress >= 100 && !goal.completedAt) {
        setShowCongratulations(true);
        
        // Автоматически замораживаем через 3 секунды
        setTimeout(() => {
          setShowCongratulations(false);
          onGoalChange({
            ...goal,
            isFrozen: true,
            completedAt: new Date().toISOString()
          });
        }, 3000);
      }
    }
  }, [goal, onGoalChange]);

  const categories = [
    { id: 'emergency', name: t('emergencyCategory'), icon: '🛡️', color: 'bg-blue-500' },
    { id: 'vacation', name: t('vacationCategory'), icon: '✈️', color: 'bg-green-500' },
    { id: 'car', name: t('carCategory'), icon: '🚗', color: 'bg-red-500' },
    { id: 'house', name: t('houseCategory'), icon: '🏠', color: 'bg-purple-500' },
    { id: 'education', name: t('educationCategory'), icon: '🎓', color: 'bg-yellow-500' },
    { id: 'wedding', name: t('weddingCategory'), icon: '💒', color: 'bg-pink-500' },
    { id: 'business', name: t('businessCategory'), icon: '💼', color: 'bg-indigo-500' },
    { id: 'gadget', name: t('gadgetCategory'), icon: '📱', color: 'bg-gray-500' },
    { id: 'other', name: t('otherCategory'), icon: '🎯', color: 'bg-orange-500' }
  ];

  const handleSave = async () => {
    if (tempGoal.title && tempGoal.targetAmount) {
      onGoalChange(tempGoal);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    if (goal) {
      setTempGoal(goal);
      setIsEditing(false);
    }
  };

  const handleFreezeToggle = () => {
    onGoalChange({
      ...goal,
      isFrozen: !goal.isFrozen,
      completedAt: !goal.isFrozen ? new Date().toISOString() : null
    });
  };

  const handleUnfreeze = () => {
    onGoalChange({
      ...goal,
      isFrozen: false,
      completedAt: null
    });
  };

  const calculateProgress = () => {
    if (!goal || !goal.targetAmount) return 0;
    return Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
  };

  const calculateMonthsToGoal = () => {
    if (!goal || !monthlyBudget) return 0;
    const remaining = goal.targetAmount - goal.currentAmount;
    const monthsNeeded = Math.ceil(remaining / monthlyBudget.safety);
    
    // Если есть дедлайн, покажем разницу между расчетным временем и желаемым
    if (goal.deadline) {
      const today = new Date();
      const deadlineDate = new Date(goal.deadline);
      const monthsToDeadline = Math.round((deadlineDate - today) / (1000 * 60 * 60 * 24 * 30.44));
      
      return {
        calculated: monthsNeeded,
        toDeadline: monthsToDeadline,
        isRealistic: monthsNeeded <= monthsToDeadline
      };
    }
    
    return { calculated: monthsNeeded, toDeadline: null, isRealistic: true };
  };

  const getCurrentCategory = () => {
    return categories.find(cat => cat.id === (goal?.category || tempGoal.category));
  };

  // Вычисления для отображения
  const progress = calculateProgress();
  const monthsToGoal = calculateMonthsToGoal();
  const category = getCurrentCategory();
  const remaining = goal ? goal.targetAmount - goal.currentAmount : 0;
  
  const formatNumber = (num) => {
    return new Intl.NumberFormat('ru-RU').format(num);
  };

  // Поздравительное модальное окно
  if (showCongratulations) {
    return (
      <div className="card bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-300 text-center animate-pulse">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold text-yellow-800 mb-2">
          {t('congratulations')}
        </h2>
        <h3 className="text-xl font-semibold text-yellow-700 mb-3">
          {t('goalCompleted')}
        </h3>
        <p className="text-yellow-600 mb-4">
          {t('goalAchievedMessage')}
        </p>
        <div className="text-4xl mb-2">✨ {goal.title} ✨</div>
        <div className="text-lg font-semibold text-green-600">
          {formatNumber(goal.currentAmount)} {t('rublesSymbol')} / {formatNumber(goal.targetAmount)} {t('rublesSymbol')}
        </div>
        <div className="mt-4 text-sm text-gray-600">
          {t('excellentWork')} {progress > 100 ? t('goalOverachieved') : ''}  
        </div>
      </div>
    );
  }

  if (isEditing && !goal?.isFrozen) {
    return (
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-900">
            🎯 {goal ? t('editGoal') : t('setSavingsGoal')}
          </h3>
          {goal && (
            <button
              onClick={handleCancel}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          )}
        </div>

        <div className="space-y-4">
          {/* Название цели */}
          <div>
            <label className="label">{t('goalName')}</label>
            <input
              type="text"
              value={tempGoal.title}
              onChange={(e) => setTempGoal({ ...tempGoal, title: e.target.value })}
              placeholder="Vacation in Turkey"
              className="input-field"
            />
          </div>

          {/* Сумма */}
          <div>
            <label className="label">{t('targetAmount')} ({t('rublesSymbol')})</label>
            <input
              type="number"
              value={tempGoal.targetAmount}
              onChange={(e) => setTempGoal({ ...tempGoal, targetAmount: parseFloat(e.target.value) || '' })}
              placeholder="100000"
              className="input-field"
            />
          </div>

          {/* Уже накоплено */}
          <div>
            <label className="label">{t('currentAmount')} ({t('rublesSymbol')})</label>
            <input
              type="number"
              value={tempGoal.currentAmount === 0 ? '' : tempGoal.currentAmount}
              onChange={(e) => {
                const value = e.target.value;
                if (value === '') {
                  // Если поле пустое, оставляем пустым
                  setTempGoal({ ...tempGoal, currentAmount: '' });
                } else {
                  // Иначе парсим число
                  setTempGoal({ ...tempGoal, currentAmount: parseFloat(value) || 0 });
                }
              }}
              onBlur={(e) => {
                // При потере фокуса, если поле пустое - ставим 0
                if (e.target.value === '' || tempGoal.currentAmount === '') {
                  setTempGoal({ ...tempGoal, currentAmount: 0 });
                }
              }}
              placeholder="0"
              className="input-field"
            />
          </div>

          {/* Желаемая дата */}
          <div>
            <label className="label">{t('desiredDate')}</label>
            <input
              type="date"
              value={tempGoal.deadline || ''}
              onChange={(e) => setTempGoal({ ...tempGoal, deadline: e.target.value })}
              className="input-field"
              min={new Date().toISOString().split('T')[0]}
              max="2099-12-31"
            />
            <p className="text-xs text-gray-500 mt-1">
              From today ({new Date().toLocaleDateString()}) to selected date
            </p>
          </div>

          {/* Категория */}
          <div>
            <label className="label">{t('category')}</label>
            <div className="grid grid-cols-3 gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setTempGoal({ ...tempGoal, category: category.id })}
                  className={`p-3 rounded-lg border text-center transition-all ${
                    tempGoal.category === category.id
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className={`w-8 h-8 ${category.color} rounded-full flex items-center justify-center text-white mx-auto mb-1`}>
                    <span className="text-sm">{category.icon}</span>
                  </div>
                  <span className="text-xs font-medium text-gray-700">
                    {category.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Кнопки */}
          <div className="flex space-x-3">
            <button onClick={handleSave} className="btn-primary flex-1">
              💾 {t('save')} {t('goal')}
            </button>
            {goal && (
              <button onClick={handleCancel} className="btn-secondary">
                {t('cancel')}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }



  // Замороженная цель - специальное отображение
  if (goal?.isFrozen) {
    return (
      <div className="card bg-gradient-to-r from-gray-800 to-slate-800 border-gray-600 dark:from-gray-800 dark:to-slate-800 dark:border-gray-600">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center">
            <div className={`w-12 h-12 ${category.color} rounded-full flex items-center justify-center text-white text-xl mr-3 relative`}>
              {category.icon}
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-xs">
                ❄️
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-200 dark:text-gray-200 flex items-center">
                {goal.title}
                <span className="ml-2 text-sm px-2 py-1 bg-blue-900 dark:bg-blue-900 text-blue-200 dark:text-blue-200 rounded-full">
                  {t('goalFrozen')}
                </span>
              </h3>
              <p className="text-sm text-gray-400 dark:text-gray-400">{category.name}</p>
              {goal.completedAt && (
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  {t('goalCompleted')} {new Date(goal.completedAt).toLocaleDateString('ru-RU')}
                </p>
              )}
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleUnfreeze}
              className="text-blue-400 hover:text-blue-300 dark:text-blue-400 dark:hover:text-blue-300 p-1 text-sm"
              title={t('unfreezeGoal')}
            >
              🔓
            </button>
            <button
              onClick={() => onGoalChange(null)}
              className="text-red-400 hover:text-red-300 dark:text-red-400 dark:hover:text-red-300 p-1"
              title={t('deleteCompletedGoal')}
            >
              🗑️
            </button>
          </div>
        </div>

        {/* Прогресс бар - всегда 100% для замороженных */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-400 dark:text-gray-400 mb-1">
            <span>{t('progress')}</span>
            <span className="text-green-400 dark:text-green-400 font-semibold">✅ {progress.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-700 dark:bg-gray-700 rounded-full h-3">
            <div 
              className="bg-green-500 dark:bg-green-500 h-3 rounded-full"
              style={{ width: `${Math.min(progress, 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Суммы */}
        <div className="grid grid-cols-3 gap-4 mb-4 text-center">
          <div>
            <p className="text-xs text-gray-400 dark:text-gray-400">{t('accumulated')}</p>
            <p className="font-semibold text-green-400 dark:text-green-400">{formatNumber(goal.currentAmount)} {t('rublesSymbol')}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 dark:text-gray-400">{remaining > 0 ? t('remaining') : t('goalOverachieved')}</p>
            <p className={`font-semibold ${remaining > 0 ? 'text-orange-400 dark:text-orange-400' : 'text-purple-400 dark:text-purple-400'}`}>
              {remaining > 0 ? `${formatNumber(remaining)} ${t('rublesSymbol')}` : `+${formatNumber(Math.abs(remaining))} ${t('rublesSymbol')}`}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-400 dark:text-gray-400">{t('goal')}</p>
            <p className="font-semibold text-gray-200 dark:text-gray-200">{formatNumber(goal.targetAmount)} {t('rublesSymbol')}</p>
          </div>
        </div>

        {/* Информация о заморозке */}
        <div className="bg-blue-900/20 dark:bg-blue-900/20 border border-blue-800/30 dark:border-blue-800/30 rounded-lg p-3 mb-4">
          <p className="text-sm text-blue-300 dark:text-blue-300">
            ❄️ {t('frozenGoalDescription')}
          </p>
        </div>

        {/* Кнопки управления замороженной целью */}
        <div className="flex space-x-2">
          <button
            onClick={handleUnfreeze}
            className="btn-primary flex-1 text-sm py-2"
          >
            🔓 {t('keepSaving')}
          </button>
          <button
            onClick={() => onGoalChange(null)}
            className="btn-danger text-sm py-2 px-4"
            title={t('deleteCompletedGoal')}
          >
            🗑️
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="card bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <div className={`w-12 h-12 ${category.color} rounded-full flex items-center justify-center text-white text-xl mr-3`}>
            {category.icon}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{goal.title}</h3>
            <p className="text-sm text-gray-600">{category.name}</p>
          </div>
        </div>
        <div className="flex space-x-2">
          {progress >= 100 && (
            <button
              onClick={handleFreezeToggle}
              className="text-blue-600 hover:text-blue-800 p-1"
              title={t('freezeGoal')}
            >
              ❄️
            </button>
          )}
          <button
            onClick={() => setIsEditing(true)}
            className="text-gray-500 hover:text-gray-700 p-1"
            title={t('editGoal')}
          >
            ✏️
          </button>
        </div>
      </div>

      {/* Прогресс бар */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>{t('progress')}</span>
          <span>{progress.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-green-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Суммы */}
      <div className="grid grid-cols-3 gap-4 mb-4 text-center">
        <div>
          <p className="text-xs text-gray-600">{t('accumulated')}</p>
          <p className="font-semibold text-green-600">{formatNumber(goal.currentAmount)} {t('rublesSymbol')}</p>
        </div>
        <div>
          <p className="text-xs text-gray-600">{t('remaining')}</p>
          <p className="font-semibold text-orange-600">{formatNumber(remaining)} {t('rublesSymbol')}</p>
        </div>
        <div>
          <p className="text-xs text-gray-600">{t('goal')}</p>
          <p className="font-semibold text-gray-900">{formatNumber(goal.targetAmount)} {t('rublesSymbol')}</p>
        </div>
      </div>

      {/* Прогноз */}
      {monthlyBudget && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-3 space-y-2 border border-gray-200 dark:border-gray-600">
          <div className="flex justify-between text-sm">
            <span className="text-gray-700 dark:text-gray-300 font-medium">{t('monthlyDeposit')}:</span>
            <span className="font-semibold text-gray-900 dark:text-white">{formatNumber(monthlyBudget.safety)} {t('rublesSymbol')}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-700 dark:text-gray-300 font-medium">{t('achieveGoalIn')}:</span>
            <span className={`font-semibold ${monthsToGoal.isRealistic ? 'text-primary-600 dark:text-primary-400' : 'text-orange-600 dark:text-orange-400'}`}>
              {monthsToGoal.calculated} {t('months')}
            </span>
          </div>
          {goal.deadline && (
            <>
              <div className="flex justify-between text-sm">
                <span className="text-gray-700 dark:text-gray-300 font-medium">Желаемая дата:</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {new Date(goal.deadline).toLocaleDateString('ru-RU')}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-700 dark:text-gray-300 font-medium">Времени до дедлайна:</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {monthsToGoal.toDeadline} {monthsToGoal.toDeadline === 1 ? 'месяц' : monthsToGoal.toDeadline < 5 ? 'месяца' : 'месяцев'}
                </span>
              </div>
              {!monthsToGoal.isRealistic && (
                <div className="bg-orange-50 border border-orange-200 rounded p-2 mt-2">
                  <p className="text-xs text-orange-700">
                    ⚠️ Цель слишком амбициозная! Нужно увеличить сумму накоплений или продлить срок.
                  </p>
                </div>
              )}
              {monthsToGoal.isRealistic && monthsToGoal.calculated < monthsToGoal.toDeadline && (
                <div className="bg-green-50 border border-green-200 rounded p-2 mt-2">
                  <p className="text-xs text-green-700">
                    ✅ Отлично! У вас есть запас времени {monthsToGoal.toDeadline - monthsToGoal.calculated} месяцев.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Кнопка добавления средств */}
      <div className="mt-4 flex space-x-2">
        <button
          onClick={() => {
            const amount = prompt('Сколько хотите добавить к цели?');
            if (amount) {
              onGoalChange({
                ...goal,
                currentAmount: goal.currentAmount + parseFloat(amount)
              });
            }
          }}
          className="btn-primary flex-1 text-sm py-2"
        >
          💰 Добавить средства
        </button>
        <button
          onClick={() => onGoalChange(null)}
          className="btn-danger text-sm py-2 px-4"
          title="Удалить цель"
        >
          🗑️
        </button>
      </div>
    </div>
  );
} 