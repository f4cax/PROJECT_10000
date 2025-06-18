import React, { createContext, useContext, useState } from 'react';

const TranslationContext = createContext();

export const translations = {
  ru: {
    // Навигация
    home: 'Главная',
    stocks: 'Акции',
    cbrData: 'Данные ЦБ',
    assets: 'Активы', 
    tips: 'Советы',
    test: 'Тест',
    about: 'О нас',
    admin: 'Админ-панель',
    navigation: 'Навигация',

    // Главная страница
    financialManagement: 'Управление личными финансами',
    budgetDistributionRule: 'Автоматическое распределение вашего бюджета по правилу',
    fromMarkTilbury: 'от Mark Tilbury',

    // Правило 50-25-15-10
    essentialExpenses: 'Обязательные расходы',
    percentFromIncome: '% от дохода',
    emergencyFund: 'Подушка безопасности',
    investments: 'Инвестиции',
    entertainment: 'Развлечения',

    // Описания категорий
    essentialDesc: 'Еда, коммунальные, транспорт, минимальная одежда',
    emergencyDesc: 'Накопления на чёрный день, экстренные ситуации',
    investmentsDesc: 'Акции, облигации, индексные фонды',
    entertainmentDesc: 'Кафе, кино, хобби, необязательные покупки',

    // Формы
    monthlyIncome: 'Месячный доход',
    rubles: 'руб',
    perMonth: 'в месяц',
    enterIncome: 'Введите ваш доход',
    calculate: 'Рассчитать',

    // Уведомления
    personalRecommendations: 'Персональные рекомендации',
    budgetVisualization: 'Визуализация вашего бюджета',

    // Страница "Данные ЦБ"
    cbrPageTitle: 'Данные ЦБ РФ',
    cbrPageSubtitle: 'Актуальные курсы валют, инфляция и финансовые данные от Центрального Банка России',
    inflationData: 'Данные по инфляции',
    currencyCalculator: 'Калькулятор валют',
    currentInflation: 'Текущая инфляция',
    yearlyInflation: 'Годовая инфляция',
    cbrTarget: 'Таргет ЦБ РФ',
    loadingData: 'Загрузка актуальных данных...',
    gettingFreshData: 'Получаем свежие данные от Центробанка России',
    dataFor: 'Данные на',
    demoMode: 'Демо-режим',
    amount: 'Сумма',
    fromCurrency: 'Из валюты',
    toCurrency: 'В валюту',
    ruble: 'Рубль',
    forInvestors: 'Для инвесторов',
    forFamilyBudget: 'Для семейного бюджета',
    dollarRateAffects: 'Курс доллара влияет на стоимость экспортных компаний',
    strongRubleReduces: 'Сильный рубль снижает инфляцию, но ухудшает экспорт',
    keyRate: 'Ключевая ставка ЦБ РФ: влияет на доходность облигаций',
    currencyInterventions: 'Валютные интервенции могут изменить тренд',
    currencyGrowth: 'Рост курса валют увеличивает цены на импортные товары',
    planLargePurchases: 'Планируйте крупные покупки с учетом валютных колебаний',
    currencyDiversification: 'Диверсификация валют снижает риски',
    vacationAbroad: 'Отпуск за границей: следите за курсом заранее',
    inflationImpact: 'Влияние на ваши финансы: При инфляции',
    inflationExample: 'ваши 100,000 ₽ через год будут стоить как',
    inflationToday: 'сегодня',

    // Страница "Советы"
    financialTips: 'Финансовые советы',
    practicalRecommendations: 'Практические рекомендации для улучшения вашего финансового положения',
    forBeginners: 'Для начинающих',
    intermediateLevel: 'Средний уровень', 
    advancedLevel: 'Продвинутый уровень',
    commonMistakes: 'Частые ошибки',
    compoundInterestPower: 'Сила сложного процента',
    compoundInterestExample: 'Если инвестировать 9,000 ₽ ежемесячно под 10% годовых:',
    years10: 'Через 10 лет',
    years20: 'Через 20 лет',
    years30: 'Через 30 лет',
    startEarly: 'Начните инвестировать как можно раньше — время ваш лучший союзник!',
    usefulResources: 'Полезные ресурсы',
    books: 'Книги',
    youtube: 'YouTube',
    websites: 'Сайты',
    startNow: 'Начните прямо сейчас!',
    bestDay: 'Самый лучший день для начала инвестирования был 20 лет назад. Второй лучший день — сегодня.',

    // Страница "Тест"
    financialTestTitle: 'Тест на финансовую грамотность',
    testSubtitle: 'Определите свой уровень знаний и получите персональную стратегию',
    testResults: 'Результаты теста',
    yourResult: 'Ваш результат',
    percentCorrect: 'Процент правильных',
    riskLevel: 'Уровень риска',
    
    // Стратегии
    conservativeStrategy: 'Консервативная стратегия',
    moderateStrategy: 'Умеренная стратегия', 
    aggressiveStrategy: 'Агрессивная стратегия',

    // Страница "О нас"
    aboutProject: 'О проекте ФинансГид',
    ourMission: 'Наша миссия',
    missionDescription: 'Мы создали ФинансГид для людей, которые не умеют распоряжаться финансами. Наша цель — сделать управление деньгами простым и понятным для каждого.',
    financialHelper: 'ИИ-помощник',
    helperDescription: 'Встроенный искусственный интеллект анализирует ваши финансовые привычки и даёт персональные рекомендации по улучшению бюджета.',
    actualData: 'Актуальные данные',
    actualDataDescription: 'Интеграция с ЦБ РФ для получения актуальных курсов валют, данных об инфляции и информации об индексных фондах в реальном времени.',
    pwaApp: 'PWA приложение',
    pwaDescription: 'Работает как обычное мобильное приложение. Можно установить на телефон и пользоваться даже без интернета.',
    security: 'Безопасность',
    securityDescription: 'Все данные хранятся локально на вашем устройстве. Мы не собираем и не передаём третьим лицам ваши финансовые данные.',
    technologies: 'Технологии',
    frontend: 'Frontend',
    backend: 'Backend',
    charts: 'Графики',
    styles: 'Стили',
    contactUs: 'Связаться с нами',
    contactDescription: 'Есть вопросы или предложения? Мы всегда рады вашей обратной связи!',
    writeUs: 'Написать нам',

    // Формы и кнопки
    monthlyIncomeLabel: 'Введите ваш месячный доход',
    calculateButton: 'Рассчитать бюджет',
    calculateBudgetDistribution: 'Рассчитать распределение бюджета',
    rublesSymbol: '₽',
    calculationCompleted: 'Расчёт выполнен для дохода:',
    
    // Уведомления и рекомендации
    lowIncomeWarning: 'При доходе менее 30,000 руб сосредоточьтесь на создании подушки безопасности перед инвестициями.',
    highIncomeAdvice: 'У вас хороший доход. Рассмотрите увеличение процента на инвестиции до 20-25%.',
    highSpendingWarning: 'Вы тратите более 10,000 руб на развлечения. Подумайте о перераспределении в пользу инвестиций.',
    
    // Цели накопления
    setSavingsGoal: 'Поставить финансовую цель',
    editGoal: 'Редактировать цель',
    goalName: 'Название цели',
    targetAmount: 'Целевая сумма',
    currentAmount: 'Уже накоплено',
    desiredDate: 'Желаемая дата достижения',
    category: 'Категория',
    progress: 'Прогресс',
    accumulated: 'Накоплено',
    remaining: 'Осталось',
    goal: 'Цель',
    monthlyDeposit: 'Откладываете в месяц',
    achieveGoalIn: 'Достигнете цели через',
    months: 'месяцев',
    
    // Категории целей
    emergencyCategory: 'Подушка безопасности',
    vacationCategory: 'Отпуск/Путешествие',
    carCategory: 'Автомобиль',
    houseCategory: 'Недвижимость',
    educationCategory: 'Образование',
    weddingCategory: 'Свадьба',
    businessCategory: 'Бизнес/Стартап',
    gadgetCategory: 'Техника/Гаджеты',
    otherCategory: 'Другое',

    // Авторизация
    login: 'Войти',
    logout: 'Выйти',
    register: 'Регистрация',
    email: 'Email',
    password: 'Пароль',
    name: 'Имя',
    administrator: 'Администратор',
    user: 'Пользователь',
    
    // Общие
    loading: 'Загрузка...',
    save: 'Сохранить',
    cancel: 'Отмена',
    close: 'Закрыть',
    edit: 'Редактировать',
    delete: 'Удалить',
    beginner: 'Новичок',
    intermediate: 'Средний',
    advanced: 'Продвинутый',
  },

  en: {
    // Navigation
    home: 'Home',
    stocks: 'Stocks',
    cbrData: 'CBR Data',
    assets: 'Assets',
    tips: 'Tips', 
    test: 'Test',
    about: 'About',
    admin: 'Admin Panel',
    navigation: 'Navigation',

    // Home page
    financialManagement: 'Personal Finance Management',
    budgetDistributionRule: 'Automatic budget distribution according to the',
    fromMarkTilbury: 'rule by Mark Tilbury',

    // Rule 50-25-15-10
    essentialExpenses: 'Essential Expenses',
    percentFromIncome: '% of income',
    emergencyFund: 'Emergency Fund',
    investments: 'Investments',
    entertainment: 'Entertainment',

    // Category descriptions
    essentialDesc: 'Food, utilities, transport, basic clothing',
    emergencyDesc: 'Emergency savings, unexpected situations',
    investmentsDesc: 'Stocks, bonds, index funds',
    entertainmentDesc: 'Cafes, movies, hobbies, optional purchases',

    // Forms
    monthlyIncome: 'Monthly Income',
    rubles: 'RUB',
    perMonth: 'per month',
    enterIncome: 'Enter your income',
    calculate: 'Calculate',

    // Notifications  
    personalRecommendations: 'Personal Recommendations',
    budgetVisualization: 'Budget Visualization',

    // CBR Data page
    cbrPageTitle: 'Central Bank of Russia Data',
    cbrPageSubtitle: 'Current exchange rates, inflation and financial data from the Central Bank of Russia',
    inflationData: 'Inflation Data',
    currencyCalculator: 'Currency Calculator',
    currentInflation: 'Current Inflation',
    yearlyInflation: 'Annual Inflation',
    cbrTarget: 'CBR Target',
    loadingData: 'Loading current data...',
    gettingFreshData: 'Getting fresh data from the Central Bank of Russia',
    dataFor: 'Data for',
    demoMode: 'Demo mode',
    amount: 'Amount',
    fromCurrency: 'From Currency',
    toCurrency: 'To Currency',
    ruble: 'Ruble',
    forInvestors: 'For Investors',
    forFamilyBudget: 'For Family Budget',
    dollarRateAffects: 'USD rate affects the value of export companies',
    strongRubleReduces: 'Strong ruble reduces inflation but hurts exports',
    keyRate: 'CBR key rate: affects bond yields',
    currencyInterventions: 'Currency interventions can change the trend',
    currencyGrowth: 'Currency growth increases prices of imported goods',
    planLargePurchases: 'Plan large purchases considering currency fluctuations',
    currencyDiversification: 'Currency diversification reduces risks',
    vacationAbroad: 'Vacation abroad: monitor exchange rates in advance',
    inflationImpact: 'Impact on your finances: With inflation at',
    inflationExample: 'your 100,000 RUB will be worth',
    inflationToday: 'today',

    // Tips page
    financialTips: 'Financial Tips',
    practicalRecommendations: 'Practical recommendations to improve your financial situation',
    forBeginners: 'For Beginners',
    intermediateLevel: 'Intermediate Level',
    advancedLevel: 'Advanced Level',
    commonMistakes: 'Common Mistakes',
    compoundInterestPower: 'Power of Compound Interest',
    compoundInterestExample: 'If you invest 9,000 RUB monthly at 10% annual return:',
    years10: 'In 10 years',
    years20: 'In 20 years',
    years30: 'In 30 years',
    startEarly: 'Start investing as early as possible — time is your best ally!',
    usefulResources: 'Useful Resources',
    books: 'Books',
    youtube: 'YouTube',
    websites: 'Websites',
    startNow: 'Start Right Now!',
    bestDay: 'The best day to start investing was 20 years ago. The second best day is today.',

    // Test page
    financialTestTitle: 'Financial Literacy Test',
    testSubtitle: 'Determine your knowledge level and get a personalized strategy',
    testResults: 'Test Results',
    yourResult: 'Your Result',
    percentCorrect: 'Percent Correct',
    riskLevel: 'Risk Level',

    // Strategies
    conservativeStrategy: 'Conservative Strategy',
    moderateStrategy: 'Moderate Strategy',
    aggressiveStrategy: 'Aggressive Strategy',

    // About page
    aboutProject: 'About FinanceGuide Project',
    ourMission: 'Our Mission',
    missionDescription: 'We created FinanceGuide for people who don\'t know how to manage their finances. Our goal is to make money management simple and understandable for everyone.',
    financialHelper: 'AI Assistant',
    helperDescription: 'Built-in artificial intelligence analyzes your financial habits and provides personalized recommendations to improve your budget.',
    actualData: 'Real-time Data',
    actualDataDescription: 'Integration with CBR to get current exchange rates, inflation data and information about index funds in real time.',
    pwaApp: 'PWA Application',
    pwaDescription: 'Works like a regular mobile application. Can be installed on your phone and used even without internet.',
    security: 'Security',
    securityDescription: 'All data is stored locally on your device. We don\'t collect or share your financial data with third parties.',
    technologies: 'Technologies',
    frontend: 'Frontend',
    backend: 'Backend',
    charts: 'Charts',
    styles: 'Styles',
    contactUs: 'Contact Us',
    contactDescription: 'Have questions or suggestions? We always appreciate your feedback!',
    writeUs: 'Write to Us',

    // Forms and buttons
    monthlyIncomeLabel: 'Enter your monthly income',
    calculateButton: 'Calculate Budget',
    calculateBudgetDistribution: 'Calculate Budget Distribution',
    rublesSymbol: 'RUB',
    calculationCompleted: 'Calculation completed for income:',
    
    // Notifications and recommendations
    lowIncomeWarning: 'With income less than 30,000 RUB, focus on creating an emergency fund before investing.',
    highIncomeAdvice: 'You have good income. Consider increasing investment percentage to 20-25%.',
    highSpendingWarning: 'You spend more than 10,000 RUB on entertainment. Consider redistributing towards investments.',
    
    // Savings goals
    setSavingsGoal: 'Set Financial Goal',
    editGoal: 'Edit Goal',
    goalName: 'Goal Name',
    targetAmount: 'Target Amount',
    currentAmount: 'Already Saved',
    desiredDate: 'Desired Achievement Date',
    category: 'Category',
    progress: 'Progress',
    accumulated: 'Saved',
    remaining: 'Remaining',
    goal: 'Goal',
    monthlyDeposit: 'Monthly Deposit',
    achieveGoalIn: 'Achieve Goal In',
    months: 'months',
    
    // Goal categories
    emergencyCategory: 'Emergency Fund',
    vacationCategory: 'Vacation/Travel',
    carCategory: 'Car',
    houseCategory: 'Real Estate',
    educationCategory: 'Education',
    weddingCategory: 'Wedding',
    businessCategory: 'Business/Startup',
    gadgetCategory: 'Tech/Gadgets',
    otherCategory: 'Other',

    // Authorization
    login: 'Login',
    logout: 'Logout',
    register: 'Register',
    email: 'Email',
    password: 'Password',
    name: 'Name',
    administrator: 'Administrator',
    user: 'User',
    
    // Common
    loading: 'Loading...',
    save: 'Save',
    cancel: 'Cancel',
    close: 'Close',
    edit: 'Edit',
    delete: 'Delete',
    beginner: 'Beginner',
    intermediate: 'Intermediate',
    advanced: 'Advanced',
  }
  };

// Провайдер контекста для переводов
export const TranslationProvider = ({ children }) => {
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'ru');
  
  const changeLanguage = (newLanguage) => {
    setLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
  };
  
  const t = (key) => {
    return translations[language]?.[key] || translations.ru[key] || key;
  };

  const value = {
    language,
    changeLanguage,
    t
  };

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  );
};

// Хук для использования переводов
export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within TranslationProvider');
  }
  return context;
}; 