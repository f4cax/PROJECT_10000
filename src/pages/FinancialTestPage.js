import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from '../utils/translations';

// Функция для получения вопросов на основе выбранного языка
const getFinancialTestQuestions = (t) => [
  {
    id: 1,
    question: t('testQuestion1'),
    options: [
      { text: t('testQ1Option1'), points: 3, correct: true },
      { text: t('testQ1Option2'), points: 2 },
      { text: t('testQ1Option3'), points: 1 },
      { text: t('testQ1Option4'), points: 0 }
    ]
  },
  {
    id: 2,
    question: t('testQuestion2'),
    options: [
      { text: t('testQ2Option1'), points: 1 },
      { text: t('testQ2Option2'), points: 3, correct: true },
      { text: t('testQ2Option3'), points: 2 },
      { text: t('testQ2Option4'), points: 0 }
    ]
  },
  {
    id: 3,
    question: t('testQuestion3'),
    options: [
      { text: t('testQ3Option1'), points: 3, correct: true },
      { text: t('testQ3Option2'), points: 1 },
      { text: t('testQ3Option3'), points: 1 },
      { text: t('testQ3Option4'), points: 0 }
    ]
  },
  {
    id: 4,
    question: t('testQuestion4'),
    options: [
      { text: t('testQ4Option1'), points: 3, correct: true },
      { text: t('testQ4Option2'), points: 1 },
      { text: t('testQ4Option3'), points: 2 },
      { text: t('testQ4Option4'), points: 0 }
    ]
  },
  {
    id: 5,
    question: t('testQuestion5'),
    options: [
      { text: t('testQ5Option1'), points: 3, correct: true },
      { text: t('testQ5Option2'), points: 1 },
      { text: t('testQ5Option3'), points: 0 },
      { text: t('testQ5Option4'), points: 0 }
    ]
  },
  {
    id: 6,
    question: t('testQuestion6'),
    options: [
      { text: t('testQ6Option1'), points: 3, correct: true },
      { text: t('testQ6Option2'), points: 1 },
      { text: t('testQ6Option3'), points: 2 },
      { text: t('testQ6Option4'), points: 0 }
    ]
  },
  {
    id: 7,
    question: t('testQuestion7'),
    options: [
      { text: t('testQ7Option1'), points: 3, correct: true },
      { text: t('testQ7Option2'), points: 0 },
      { text: t('testQ7Option3'), points: 0 },
      { text: t('testQ7Option4'), points: 0 }
    ]
  },
  {
    id: 8,
    question: t('testQuestion8'),
    options: [
      { text: t('testQ8Option1'), points: 3, correct: true },
      { text: t('testQ8Option2'), points: 1 },
      { text: t('testQ8Option3'), points: 1 },
      { text: t('testQ8Option4'), points: 0 }
    ]
  },
  {
    id: 9,
    question: t('testQuestion9'),
    options: [
      { text: t('testQ9Option1'), points: 3, correct: true },
      { text: t('testQ9Option2'), points: 1 },
      { text: t('testQ9Option3'), points: 2 },
      { text: t('testQ9Option4'), points: 0 }
    ]
  },
  {
    id: 10,
    question: t('testQuestion10'),
    options: [
      { text: t('testQ10Option1'), points: 3, correct: true },
      { text: t('testQ10Option2'), points: 2 },
      { text: t('testQ10Option3'), points: 0 },
      { text: t('testQ10Option4'), points: 0 }
    ]
  }
];

// Функция для получения стратегий на основе выбранного языка
const getStrategies = (t) => ({
  beginner: {
    title: t('conservativeStrategyTitle'),
    description: t('conservativeStrategyDesc'),
    icon: "🛡️",
    color: "bg-blue-500",
    recommendations: [
      t('conservativeRec1'),
      t('conservativeRec2'),
      t('conservativeRec3'),
      t('conservativeRec4'),
      t('conservativeRec5')
    ],
    instruments: [t('conservativeInstrument1'), t('conservativeInstrument2'), t('conservativeInstrument3'), t('conservativeInstrument4')],
    expectedReturn: t('conservativeReturn'),
    riskLevel: t('conservativeRisk')
  },
  intermediate: {
    title: t('moderateStrategyTitle'), 
    description: t('moderateStrategyDesc'),
    icon: "⚖️",
    color: "bg-green-500",
    recommendations: [
      t('moderateRec1'),
      t('moderateRec2'),
      t('moderateRec3'),
      t('moderateRec4'),
      t('moderateRec5')
    ],
    instruments: [t('moderateInstrument1'), t('moderateInstrument2'), t('moderateInstrument3'), t('moderateInstrument4')],
    expectedReturn: t('moderateReturn'),
    riskLevel: t('moderateRisk')
  },
  advanced: {
    title: t('aggressiveStrategyTitle'),
    description: t('aggressiveStrategyDesc'),
    icon: "🚀",
    color: "bg-red-500", 
    recommendations: [
      t('aggressiveRec1'),
      t('aggressiveRec2'),
      t('aggressiveRec3'),
      t('aggressiveRec4'),
      t('aggressiveRec5')
    ],
    instruments: [t('aggressiveInstrument1'), t('aggressiveInstrument2'), t('aggressiveInstrument3'), t('aggressiveInstrument4')],
    expectedReturn: t('aggressiveReturn'),
    riskLevel: t('aggressiveRisk')
  }
});

export default function FinancialTestPage() {
  const { saveTestResults, isAuthenticated, user } = useAuth();
  const { t } = useTranslation();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  const [shuffledQuestions, setShuffledQuestions] = useState([]);

  // Мемоизируем вопросы и стратегии для текущего языка
  const testQuestions = useMemo(() => getFinancialTestQuestions(t), [t]);
  const strategies = useMemo(() => getStrategies(t), [t]);

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
    setShuffledQuestions(shuffleQuestions(testQuestions));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [testQuestions]);

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
    if (score <= 10) return strategies.beginner;
    if (score <= 20) return strategies.intermediate;
    return strategies.advanced;
  };

  const resetTest = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResult(false);
    setTotalScore(0);
    // Перемешиваем вопросы заново при сбросе теста
    setShuffledQuestions(shuffleQuestions(testQuestions));
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
        <p className="mt-4 text-gray-600 dark:text-gray-400">{t('preparingTest')}</p>
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
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            🎯 {t('testResults')}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {t('yourLiteracyLevel')}
          </p>
        </div>

        {/* Результат */}
        <div className="card text-center">
          <div className="text-6xl mb-4">{strategy.icon}</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {strategy.title}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{strategy.description}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <div className={`text-3xl font-bold ${getScoreColor()}`}>
                {totalScore}/{maxScore}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t('yourResult')}</p>
            </div>
            <div>
              <div className={`text-3xl font-bold ${getScoreColor()}`}>
                {percentage}%
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t('percentCorrect')}</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {strategy.riskLevel}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t('riskLevel')}</p>
            </div>
          </div>
        </div>

        {/* Рекомендации */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              💡 {t('personalRecommendations')}
            </h3>
            <ul className="space-y-2">
              {strategy.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="text-sm text-gray-700 dark:text-gray-300">{rec}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              📈 {t('recommendedInstruments')}
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">{t('expectedReturn')}:</span>
                <span className="font-semibold text-green-600">{strategy.expectedReturn}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">{t('riskLevel')}:</span>
                <span className="font-semibold text-gray-900 dark:text-white">{strategy.riskLevel}</span>
              </div>
              <div className="border-t pt-3">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{t('suitableInstruments')}:</p>
                <div className="flex flex-wrap gap-1">
                  {strategy.instruments.map((instrument, index) => (
                    <span key={index} className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-2 py-1 rounded">
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
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            📚 {t('correctAnswers')}
          </h3>
          <div className="space-y-3">
            {shuffledQuestions.map((question, index) => {
              const userAnswer = answers[index];
              const correctAnswer = question.options.find(opt => opt.correct);
              const isCorrect = userAnswer?.correct || false;

              // Проверяем что userAnswer и correctAnswer существуют
              if (!userAnswer || !correctAnswer) {
                return null;
              }

              return (
                <div key={question.id} className={`p-3 rounded-lg border ${isCorrect ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'}`}>
                  <p className="font-medium text-sm text-gray-900 dark:text-white mb-2">
                    {question.id}. {question.question}
                  </p>
                  <div className="text-xs space-y-1">
                    <p className={isCorrect ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}>
                      {t('yourAnswer')}: {userAnswer.text} ({userAnswer.points} {t('points')})
                    </p>
                    <p className="text-green-700 dark:text-green-300">
                      {t('correctAnswer')}: {correctAnswer.text}
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
            🔄 {t('retakeTest')}
          </button>
          <button onClick={() => window.location.href = '/'} className="btn-primary">
            📊 {t('applyStrategy')}
          </button>
        </div>
      </div>
    );
  }

  const question = shuffledQuestions[currentQuestion];

  return (
    <div className="max-w-3xl mx-auto space-y-8 fade-in">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          🧠 {t('financialLiteracyTest')}
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          {t('testPageSubtitle')}
        </p>
      </div>

      {/* Прогресс */}
      <div className="card">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {t('questionOf', { current: currentQuestion + 1, total: shuffledQuestions.length })}
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
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          {question.question}
        </h2>
        
        <div className="space-y-3">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(option)}
              className="w-full text-left p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-primary-300 dark:hover:border-primary-600 transition-colors"
            >
              <div className="flex items-center">
                <div className="w-6 h-6 border border-gray-300 dark:border-gray-600 rounded-full mr-3 flex-shrink-0"></div>
                <span className="text-gray-900 dark:text-white">{option.text}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Подсказка */}
      <div className="card bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <p className="text-sm text-blue-800 dark:text-blue-300 text-center">
          💡 {t('testHint')}
        </p>
      </div>
    </div>
  );
} 