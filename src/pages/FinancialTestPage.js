import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const FINANCIAL_TEST_QUESTIONS = [
  {
    id: 1,
    question: "Что такое инфляция?",
    options: [
      { text: "Рост цен на товары и услуги", points: 3, correct: true },
      { text: "Снижение стоимости денег", points: 2 },
      { text: "Экономический кризис", points: 1 },
      { text: "Не знаю", points: 0 }
    ]
  },
  {
    id: 2,
    question: "Какой процент от дохода рекомендуется откладывать на чёрный день?",
    options: [
      { text: "5-10%", points: 1 },
      { text: "15-25%", points: 3, correct: true },
      { text: "30-40%", points: 2 },
      { text: "Не нужно откладывать", points: 0 }
    ]
  },
  {
    id: 3,
    question: "Что такое диверсификация инвестиций?",
    options: [
      { text: "Инвестирование в разные активы для снижения рисков", points: 3, correct: true },
      { text: "Покупка только акций", points: 1 },
      { text: "Хранение денег в банке", points: 1 },
      { text: "Не знаю", points: 0 }
    ]
  },
  {
    id: 4,
    question: "Что лучше: гасить долги или инвестировать?",
    options: [
      { text: "Сначала гасить долги, потом инвестировать", points: 3, correct: true },
      { text: "Сначала инвестировать", points: 1 },
      { text: "Делать одновременно", points: 2 },
      { text: "Не знаю", points: 0 }
    ]
  },
  {
    id: 5,
    question: "Что такое сложный процент?",
    options: [
      { text: "Процент на процент - реинвестирование доходов", points: 3, correct: true },
      { text: "Высокий процент по кредиту", points: 1 },
      { text: "Сложные расчеты", points: 0 },
      { text: "Не знаю", points: 0 }
    ]
  },
  {
    id: 6,
    question: "Размер финансовой подушки безопасности должен составлять:",
    options: [
      { text: "3-6 месячных расходов", points: 3, correct: true },
      { text: "1 месячный расход", points: 1 },
      { text: "12 месячных расходов", points: 2 },
      { text: "Не нужна подушка", points: 0 }
    ]
  },
  {
    id: 7,
    question: "Что такое ИИС (Индивидуальный инвестиционный счёт)?",
    options: [
      { text: "Счёт с налоговыми льготами для инвестиций", points: 3, correct: true },
      { text: "Обычный банковский счёт", points: 0 },
      { text: "Кредитная карта", points: 0 },
      { text: "Не знаю", points: 0 }
    ]
  },
  {
    id: 8,
    question: "При какой доходности облигаций стоит их покупать?",
    options: [
      { text: "Выше уровня инфляции", points: 3, correct: true },
      { text: "Любой доходности", points: 1 },
      { text: "Только самой высокой", points: 1 },
      { text: "Не знаю", points: 0 }
    ]
  },
  {
    id: 9,
    question: "Что делать с деньгами во время экономического кризиса?",
    options: [
      { text: "Диверсифицировать вложения и не паниковать", points: 3, correct: true },
      { text: "Снять все деньги и держать наличными", points: 1 },
      { text: "Вложить всё в золото", points: 2 },
      { text: "Не знаю", points: 0 }
    ]
  },
  {
    id: 10,
    question: "Какой принцип Mark Tilbury для распределения дохода?",
    options: [
      { text: "50-25-15-10 (потребности-сбережения-инвестиции-развлечения)", points: 3, correct: true },
      { text: "60-20-20 (потребности-сбережения-развлечения)", points: 2 },
      { text: "100% тратить на потребности", points: 0 },
      { text: "Не знаю", points: 0 }
    ]
  }
];

const STRATEGIES = {
  beginner: {
    title: "Консервативная стратегия",
    description: "Вам подходит осторожный подход к финансам",
    icon: "🛡️",
    color: "bg-blue-500",
    recommendations: [
      "Создайте подушку безопасности на 6 месяцев расходов",
      "Изучите основы инвестирования",
      "Начните с банковских депозитов и ОФЗ",
      "Откройте ИИС с налоговым вычетом",
      "Читайте книги по финансовой грамотности"
    ],
    instruments: ["Банковские депозиты", "ОФЗ", "Стабильные дивиденды", "ИИС"],
    expectedReturn: "5-8% годовых",
    riskLevel: "Низкий"
  },
  intermediate: {
    title: "Умеренная стратегия", 
    description: "У вас хорошие базовые знания",
    icon: "⚖️",
    color: "bg-green-500",
    recommendations: [
      "Диверсифицируйте портфель: 60% облигации, 40% акции",
      "Инвестируйте в индексные фонды",
      "Регулярно пересматривайте портфель",
      "Увеличьте долю акций со временем",
      "Изучите международные рынки"
    ],
    instruments: ["Индексные фонды", "ETF", "Корпоративные облигации", "Акции голубых фишек"],
    expectedReturn: "8-12% годовых",
    riskLevel: "Средний"
  },
  advanced: {
    title: "Агрессивная стратегия",
    description: "Вы готовы к высоким рискам ради высокой доходности",
    icon: "🚀",
    color: "bg-red-500", 
    recommendations: [
      "Формируйте портфель: 20% облигации, 70% акции, 10% альтернативы",
      "Инвестируйте в акции роста и стартапы",
      "Рассмотрите международную диверсификацию",
      "Используйте сложные инструменты осторожно",
      "Регулярно фиксируйте прибыль"
    ],
    instruments: ["Акции роста", "Венчурные фонды", "Международные ETF", "Сырьевые активы"],
    expectedReturn: "12-25% годовых",
    riskLevel: "Высокий"
  }
};

export default function FinancialTestPage() {
  const { saveTestResults, isAuthenticated, user } = useAuth();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  const [shuffledQuestions, setShuffledQuestions] = useState([]);

  // Функция для перемешивания вопросов (алгоритм Fisher-Yates)
  const shuffleQuestions = (questions) => {
    const shuffled = [...questions];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    // Также перемешиваем варианты ответов в каждом вопросе
    return shuffled.map(question => ({
      ...question,
      options: shuffleArray([...question.options])
    }));
  };

  // Вспомогательная функция для перемешивания массива
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Инициализация перемешанных вопросов при загрузке компонента
  useEffect(() => {
    setShuffledQuestions(shuffleQuestions(FINANCIAL_TEST_QUESTIONS));
  }, []);

  // Загружаем сохраненные результаты теста
  useEffect(() => {
    if (isAuthenticated && user?.financialData?.testResults?.score) {
      const testData = user.financialData.testResults;
      setTotalScore(testData.score);
      setShowResult(true);
    }
  }, [isAuthenticated, user]);

  const handleAnswer = async (selectedOption) => {
    const newAnswers = [...answers, selectedOption];
    setAnswers(newAnswers);
    
    if (currentQuestion < shuffledQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Подсчет результата
      const score = newAnswers.reduce((sum, answer) => sum + answer.points, 0);
      setTotalScore(score);
      setShowResult(true);

      // Сохраняем результаты в БД если пользователь авторизован
      const strategy = getRecommendedStrategyByScore(score);
      if (isAuthenticated) {
        await saveTestResults({
          score,
          strategy: strategy.title,
          completedAt: new Date().toISOString(),
        });
      }
    }
  };

  const getRecommendedStrategy = () => {
    return getRecommendedStrategyByScore(totalScore);
  };

  const getRecommendedStrategyByScore = (score) => {
    if (score <= 10) return STRATEGIES.beginner;
    if (score <= 20) return STRATEGIES.intermediate;
    return STRATEGIES.advanced;
  };

  const resetTest = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResult(false);
    setTotalScore(0);
    // Перемешиваем вопросы заново при сбросе теста
    setShuffledQuestions(shuffleQuestions(FINANCIAL_TEST_QUESTIONS));
  };

  const getScoreColor = () => {
    if (totalScore <= 10) return 'text-red-600';
    if (totalScore <= 20) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getProgressPercentage = () => {
    return ((currentQuestion + 1) / shuffledQuestions.length) * 100;
  };

  // Не показываем тест пока вопросы не перемешаны
  if (shuffledQuestions.length === 0) {
    return (
      <div className="max-w-3xl mx-auto text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Подготовка теста...</p>
      </div>
    );
  }

  if (showResult) {
    const strategy = getRecommendedStrategy();
    const maxScore = shuffledQuestions.length * 3;
    const percentage = Math.round((totalScore / maxScore) * 100);

    return (
      <div className="max-w-4xl mx-auto space-y-8 fade-in">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🎯 Результаты теста
          </h1>
          <p className="text-lg text-gray-600">
            Ваш уровень финансовой грамотности и рекомендуемая стратегия
          </p>
        </div>

        {/* Результат */}
        <div className="card text-center">
          <div className="text-6xl mb-4">{strategy.icon}</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {strategy.title}
          </h2>
          <p className="text-gray-600 mb-4">{strategy.description}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <div className={`text-3xl font-bold ${getScoreColor()}`}>
                {totalScore}/{maxScore}
              </div>
              <p className="text-sm text-gray-600">Ваш результат</p>
            </div>
            <div>
              <div className={`text-3xl font-bold ${getScoreColor()}`}>
                {percentage}%
              </div>
              <p className="text-sm text-gray-600">Процент правильных</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900">
                {strategy.riskLevel}
              </div>
              <p className="text-sm text-gray-600">Уровень риска</p>
            </div>
          </div>
        </div>

        {/* Рекомендации */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              💡 Персональные рекомендации
            </h3>
            <ul className="space-y-2">
              {strategy.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="text-sm text-gray-700">{rec}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              📈 Рекомендуемые инструменты
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Ожидаемая доходность:</span>
                <span className="font-semibold text-green-600">{strategy.expectedReturn}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Уровень риска:</span>
                <span className="font-semibold">{strategy.riskLevel}</span>
              </div>
              <div className="border-t pt-3">
                <p className="text-sm text-gray-600 mb-2">Подходящие инструменты:</p>
                <div className="flex flex-wrap gap-1">
                  {strategy.instruments.map((instrument, index) => (
                    <span key={index} className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {instrument}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Правильные ответы */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            📚 Правильные ответы
          </h3>
          <div className="space-y-3">
            {shuffledQuestions.map((question, index) => {
              const userAnswer = answers[index];
              const correctAnswer = question.options.find(opt => opt.correct);
              const isCorrect = userAnswer.correct;

              return (
                <div key={question.id} className={`p-3 rounded-lg border ${isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                  <p className="font-medium text-sm text-gray-900 mb-2">
                    {question.id}. {question.question}
                  </p>
                  <div className="text-xs space-y-1">
                    <p className={isCorrect ? 'text-green-700' : 'text-red-700'}>
                      Ваш ответ: {userAnswer.text} ({userAnswer.points} баллов)
                    </p>
                    <p className="text-green-700">
                      Правильный ответ: {correctAnswer.text}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Кнопки */}
        <div className="text-center space-x-4">
          <button onClick={resetTest} className="btn-secondary">
            🔄 Пройти тест заново
          </button>
          <button onClick={() => window.location.href = '/'} className="btn-primary">
            📊 Применить стратегию
          </button>
        </div>
      </div>
    );
  }

  const question = shuffledQuestions[currentQuestion];

  return (
    <div className="max-w-3xl mx-auto space-y-8 fade-in">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          🧠 Тест на финансовую грамотность
        </h1>
        <p className="text-lg text-gray-600">
          Определите свой уровень знаний и получите персональную стратегию
        </p>
      </div>

      {/* Прогресс */}
      <div className="card">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm text-gray-600">
            Вопрос {currentQuestion + 1} из {shuffledQuestions.length}
          </span>
          <span className="text-sm font-semibold text-primary-600">
            {Math.round(getProgressPercentage())}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-primary-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${getProgressPercentage()}%` }}
          ></div>
        </div>
      </div>

      {/* Вопрос */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          {question.question}
        </h2>
        
        <div className="space-y-3">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(option)}
              className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-primary-300 transition-colors"
            >
              <div className="flex items-center">
                <div className="w-6 h-6 border border-gray-300 rounded-full mr-3 flex-shrink-0"></div>
                <span className="text-gray-900">{option.text}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Подсказка */}
      <div className="card bg-blue-50 border-blue-200">
        <p className="text-sm text-blue-800 text-center">
          💡 Выберите наиболее подходящий ответ. Нет правильных или неправильных ответов - 
          тест поможет определить ваш текущий уровень знаний.
        </p>
      </div>
    </div>
  );
} 