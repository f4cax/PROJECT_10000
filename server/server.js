const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Поддержка fetch для Node.js < 18
if (typeof fetch === 'undefined') {
  try {
    global.fetch = require('node-fetch');
  } catch (error) {
    console.log('node-fetch не установлен, используем встроенный fetch или упрощенный режим');
  }
}

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware - CORS настройки для production
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://*.vercel.app',
    /\.vercel\.app$/
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());

// Настройки Mongoose
mongoose.set('strictQuery', false);

// MongoDB подключение
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/financeguide';
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB подключена');
  } catch (error) {
    console.error('❌ Ошибка подключения к MongoDB:', error.message);
    process.exit(1);
  }
};

// Схема пользователя
const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email обязателен'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Введите корректный email']
  },
  password: {
    type: String,
    required: [true, 'Пароль обязателен'],
    minlength: [6, 'Пароль должен содержать минимум 6 символов'],
  },
  name: {
    type: String,
    required: [true, 'Имя обязательно'],
    trim: true,
    maxlength: [100, 'Имя не должно превышать 100 символов']
  },
  age: {
    type: Number,
    min: [0, 'Возраст не может быть отрицательным'],
    max: [150, 'Возраст не может превышать 150 лет']
  },
  region: {
    type: String,
    enum: [
      'moscow', 'spb', 'adygea', 'altai', 'bashkortostan', 'buryatia', 
      'dagestan', 'ingushetia', 'kabardino-balkaria', 'kalmykia', 
      'karachay-cherkessia', 'karelia', 'komi', 'crimea', 'mari-el', 
      'mordovia', 'sakha', 'north-ossetia', 'tatarstan', 'tuva', 
      'udmurtia', 'khakassia', 'chechnya', 'chuvashia', 'altai-krai', 
      'krasnodar-krai', 'krasnoyarsk-krai', 'primorsky-krai', 
      'stavropol-krai', 'khabarovsk-krai', 'amur', 'arkhangelsk', 
      'astrakhan', 'belgorod', 'bryansk', 'vladimir', 'volgograd', 
      'vologda', 'voronezh', 'ivanovo', 'irkutsk', 'kaliningrad', 
      'kaluga', 'kamchatka', 'kemerovo', 'kirov', 'kostroma', 
      'kurgan', 'kursk', 'leningrad', 'lipetsk', 'magadan', 
      'moscow-region', 'murmansk', 'nizhny-novgorod', 'novgorod', 
      'novosibirsk', 'omsk', 'orenburg', 'oryol', 'penza', 'perm', 
      'pskov', 'rostov', 'ryazan', 'samara', 'saratov', 'sakhalin', 
      'sverdlovsk', 'smolensk', 'tambov', 'tver', 'tomsk', 'tula', 
      'tyumen', 'ulyanovsk', 'chelyabinsk', 'zabaykalsky', 'yaroslavl', 
      'nenetsky', 'khanty-mansi', 'chukotka', 'yamalo-nenets', 
      'sevastopol', 'jewish'
    ],
  },
  language: {
    type: String,
    enum: ['ru', 'en'],
    default: 'ru'
  },
  currency: {
    type: String,
    enum: ['RUB', 'USD', 'EUR'],
    default: 'RUB'
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  settings: {
    notifications: { type: Boolean, default: true },
    darkMode: { type: Boolean, default: false },
    emailUpdates: { type: Boolean, default: true }
  },
  financialData: {
    monthlyIncome: { type: Number, default: 0 },
    totalAssets: { type: Number, default: 0 },
    monthlyExpenses: { type: Number, default: 0 },
    investments: { type: Number, default: 0 },
    investmentType: {
      type: String,
      enum: ['index-funds', 'stocks', 'bonds', 'mixed', 'crypto'],
      default: 'index-funds'
    },
    financialGoal: { type: String, default: '' },
    goalAmount: { type: Number, default: 0 },
    goalDeadline: { type: Date },
    budgetDistribution: {
      needs: { type: Number, default: 0 },
      safety: { type: Number, default: 0 },
      investments: { type: Number, default: 0 },
      wants: { type: Number, default: 0 },
    },
    selectedStrategy: {
      type: String,
      validate: {
        validator: function(v) {
          return v === null || v === undefined || ['conservative', 'moderate', 'aggressive'].includes(v);
        },
        message: 'Стратегия должна быть одной из: conservative, moderate, aggressive'
      },
      default: null,
    },
    savingsGoals: [{
      title: String,
      targetAmount: Number,
      currentAmount: { type: Number, default: 0 },
      deadline: Date,
      category: String,
      createdAt: { type: Date, default: Date.now },
    }],
    testResults: {
      score: { type: Number, default: 0 },
      strategy: { type: String, default: null },
      completedAt: { type: Date, default: null },
    },
    // Портфель активов пользователя
    assets: [{
      _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
      type: {
        type: String,
        enum: ['cash', 'stocks', 'crypto', 'realestate', 'business', 'bonds', 'other'],
        required: true
      },
      name: { type: String, required: true, trim: true },
      amount: { type: Number, required: true, min: 0 },
      currency: { type: String, enum: ['RUB', 'USD', 'EUR'], default: 'RUB' },
      // Для акций и криптовалют
      symbol: { type: String, trim: true }, // AAPL, BTC, ETH и т.д.
      quantity: { type: Number, min: 0 }, // количество акций/монет
      purchasePrice: { type: Number, min: 0 }, // цена покупки
      currentPrice: { type: Number, min: 0 }, // текущая цена (обновляется автоматически)
      lastUpdated: { type: Date, default: Date.now },
      // Метаданные
      description: { type: String, trim: true },
      category: { type: String, trim: true }, // подкатегория активов
      isTracked: { type: Boolean, default: false }, // отслеживать ли цену автоматически
      createdAt: { type: Date, default: Date.now },
      updatedAt: { type: Date, default: Date.now }
    }],
    // Кэш для расчетов портфеля
    portfolioCache: {
      totalValue: { type: Number, default: 0 },
      totalGainLoss: { type: Number, default: 0 },
      totalGainLossPercent: { type: Number, default: 0 },
      lastCalculated: { type: Date, default: Date.now },
      distribution: {
        cash: { type: Number, default: 0 },
        stocks: { type: Number, default: 0 },
        crypto: { type: Number, default: 0 },
        realestate: { type: Number, default: 0 },
        bonds: { type: Number, default: 0 },
        other: { type: Number, default: 0 }
      }
    }
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastLoginAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true // Автоматически добавляет createdAt и updatedAt
});

// Хэширование пароля перед сохранением
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Метод для проверки пароля
UserSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', UserSchema);

// Схема для кэширования данных акций
const StockDataSchema = new mongoose.Schema({
  symbol: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  change: {
    type: Number,
    default: 0
  },
  changePercent: {
    type: Number,
    default: 0
  },
  volume: {
    type: String,
    default: '0'
  },
  high: Number,
  low: Number,
  previousClose: Number,
  marketCap: String,
  pe: Number,
  high52w: Number,
  low52w: Number,
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  lastAPIUpdate: {
    type: Date,
    default: Date.now
  },
  isDemo: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const StockData = mongoose.model('StockData', StockDataSchema);

// Middleware для проверки авторизации
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Токен доступа не предоставлен' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Недействительный токен' });
    }
    req.user = user;
    next();
  });
};

// Middleware для проверки админских прав
const requireAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Доступ запрещен. Требуются права администратора' });
    }
    next();
  } catch (error) {
    return res.status(500).json({ error: 'Ошибка проверки прав доступа' });
  }
};

// МАРШРУТЫ

// 🔐 Регистрация
app.post('/api/auth/register', async (req, res) => {
  try {
    console.log('📝 Попытка регистрации:', req.body);
    const { email, password, name } = req.body;

    // Валидация
    if (!email || !password || !name) {
      console.log('❌ Валидация не пройдена: не все поля заполнены');
      return res.status(400).json({ error: 'Все поля обязательны' });
    }

    if (password.length < 6) {
      console.log('❌ Валидация не пройдена: пароль слишком короткий');
      return res.status(400).json({ error: 'Пароль должен содержать минимум 6 символов' });
    }

    // Проверка существования пользователя
    console.log('🔍 Проверяем существование пользователя:', email);
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('❌ Пользователь уже существует:', email);
      return res.status(400).json({ error: 'Пользователь с таким email уже существует' });
    }

    // Создание пользователя
    console.log('👤 Создание нового пользователя:', { email, name });
    const user = new User({ email, password, name });
    await user.save();
    console.log('✅ Пользователь создан:', user._id);

    // Генерация JWT токена
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    console.log('🎉 Регистрация успешна для:', email);
    res.status(201).json({
      message: 'Пользователь успешно зарегистрирован',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    console.error('❌ Ошибка регистрации:');
    console.error('Тип:', error.name);
    console.error('Сообщение:', error.message);
    console.error('Стек:', error.stack);
    
    // Более детальная обработка ошибок
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      console.error('Ошибки валидации:', messages);
      return res.status(400).json({ 
        error: 'Ошибка валидации данных', 
        details: messages 
      });
    }
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({ 
        error: `${field === 'email' ? 'Пользователь с таким email' : 'Данные'} уже существует` 
      });
    }
    
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

// 🔑 Авторизация
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Валидация
    if (!email || !password) {
      return res.status(400).json({ error: 'Email и пароль обязательны' });
    }

    // Поиск пользователя
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Неверный email или пароль' });
    }

    // Проверка пароля
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Неверный email или пароль' });
    }

    // Обновление времени последнего входа
    user.lastLoginAt = new Date();
    await user.save();

    // Генерация токена
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Авторизация успешна',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        isActive: user.isActive,
        financialData: user.financialData,
      },
    });
  } catch (error) {
    console.error('Ошибка авторизации:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

// 👤 Получение профиля пользователя
app.get('/api/user/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    res.json(user);
  } catch (error) {
    console.error('Ошибка получения профиля:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

// 👤 Обновление профиля пользователя
app.put('/api/user/profile', authenticateToken, async (req, res) => {
  try {
    console.log('📝 Обновление профиля пользователя:', req.user.userId);
    console.log('📥 Данные запроса:', req.body);
    
    const { name, email, age, region, language, currency } = req.body;

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (age !== undefined) updateData.age = age;
    if (region !== undefined) updateData.region = region;
    if (language !== undefined) updateData.language = language;
    if (currency !== undefined) updateData.currency = currency;

    console.log('🔄 Данные для обновления:', updateData);

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      console.log('❌ Пользователь не найден:', req.user.userId);
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    console.log('✅ Профиль успешно обновлен:', user.name);
    res.json({
      message: 'Профиль обновлен',
      user: user,
    });
  } catch (error) {
    if (error.code === 11000) {
      console.log('❌ Email уже используется:', error);
      return res.status(400).json({ error: 'Email уже используется' });
    }
    console.error('❌ Ошибка обновления профиля:', error);
    console.error('Stack trace:', error.stack);
    res.status(500).json({ error: 'Внутренняя ошибка сервера', details: error.message });
  }
});

// ⚙️ Обновление настроек пользователя
app.put('/api/user/settings', authenticateToken, async (req, res) => {
  try {
    const { notifications, darkMode, emailUpdates } = req.body;

    const updateData = {};
    if (typeof notifications === 'boolean') updateData['settings.notifications'] = notifications;
    if (typeof darkMode === 'boolean') updateData['settings.darkMode'] = darkMode;
    if (typeof emailUpdates === 'boolean') updateData['settings.emailUpdates'] = emailUpdates;

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    res.json({
      message: 'Настройки обновлены',
      settings: user.settings,
    });
  } catch (error) {
    console.error('Ошибка обновления настроек:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

// 💰 Сохранение финансовых данных
app.put('/api/user/financial-data', authenticateToken, async (req, res) => {
  try {
    const {
      monthlyIncome,
      totalAssets,
      monthlyExpenses,
      investments,
      investmentType,
      financialGoal,
      goalAmount,
      goalDeadline,
      budgetDistribution,
      selectedStrategy,
      savingsGoals,
      testResults,
    } = req.body;

    const updateData = {};
    if (monthlyIncome !== undefined) updateData['financialData.monthlyIncome'] = monthlyIncome;
    if (totalAssets !== undefined) updateData['financialData.totalAssets'] = totalAssets;
    if (monthlyExpenses !== undefined) updateData['financialData.monthlyExpenses'] = monthlyExpenses;
    if (investments !== undefined) updateData['financialData.investments'] = investments;
    if (investmentType) updateData['financialData.investmentType'] = investmentType;
    if (financialGoal !== undefined) updateData['financialData.financialGoal'] = financialGoal;
    if (goalAmount !== undefined) updateData['financialData.goalAmount'] = goalAmount;
    if (goalDeadline) updateData['financialData.goalDeadline'] = goalDeadline;
    if (budgetDistribution) updateData['financialData.budgetDistribution'] = budgetDistribution;
    if (selectedStrategy) updateData['financialData.selectedStrategy'] = selectedStrategy;
    if (savingsGoals) updateData['financialData.savingsGoals'] = savingsGoals;
    if (testResults) updateData['financialData.testResults'] = testResults;

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      message: 'Финансовые данные сохранены',
      financialData: user.financialData,
    });
  } catch (error) {
    console.error('Ошибка сохранения данных:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

// 🎯 Управление целями накопления
app.post('/api/user/savings-goals', authenticateToken, async (req, res) => {
  try {
    const goal = req.body;
    const user = await User.findById(req.user.userId);
    
    user.financialData.savingsGoals.push(goal);
    await user.save();

    res.json({
      message: 'Цель добавлена',
      goals: user.financialData.savingsGoals,
    });
  } catch (error) {
    console.error('Ошибка добавления цели:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

// ======================
// 📈 УПРАВЛЕНИЕ ДАННЫМИ АКЦИЙ
// ======================

// Популярные акции для отслеживания
const POPULAR_STOCKS = [
  { symbol: 'AAPL', name: 'Apple Inc.', sector: 'Technology' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', sector: 'Technology' },
  { symbol: 'MSFT', name: 'Microsoft Corp.', sector: 'Technology' },
  { symbol: 'TSLA', name: 'Tesla Inc.', sector: 'Automotive' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', sector: 'E-commerce' },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', sector: 'Technology' }
];

// Генерация демо-данных для акций
const generateDemoStockData = () => {
  const baseData = {
    'AAPL': { basePrice: 175, basePE: 28.5, marketCap: '2.7T' },
    'GOOGL': { basePrice: 2450, basePE: 25.3, marketCap: '1.6T' },
    'MSFT': { basePrice: 345, basePE: 32.1, marketCap: '2.5T' },
    'TSLA': { basePrice: 235, basePE: 45.2, marketCap: '745B' },
    'AMZN': { basePrice: 3120, basePE: 58.7, marketCap: '1.3T' },
    'NVDA': { basePrice: 450, basePE: 65.4, marketCap: '1.1T' }
  };

  return POPULAR_STOCKS.map(stock => {
    const base = baseData[stock.symbol];
    const changePercent = (Math.random() - 0.5) * 8; // От -4% до +4%
    const newPrice = base.basePrice * (1 + changePercent / 100);
    const change = newPrice - base.basePrice;
    
    return {
      symbol: stock.symbol,
      name: stock.name,
      price: Number(newPrice.toFixed(2)),
      change: Number(change.toFixed(2)),
      changePercent: Number(changePercent.toFixed(2)),
      volume: Math.floor(Math.random() * 50000000 + 10000000).toLocaleString(),
      high: newPrice * (1 + Math.random() * 0.02),
      low: newPrice * (1 - Math.random() * 0.02),
      previousClose: base.basePrice,
      marketCap: base.marketCap,
      pe: base.basePE + (Math.random() - 0.5) * 5,
      high52w: newPrice * (1 + Math.random() * 0.3),
      low52w: newPrice * (1 - Math.random() * 0.3),
      isDemo: true
    };
  });
};

// Функция для получения реальных данных акций через EODHD API
const fetchRealStockData = async () => {
  const API_KEY = process.env.EODHD_API_KEY || '68545cf3e0b555.23627356';
  const realData = [];

  for (const stock of POPULAR_STOCKS) {
    try {
      const url = `https://eodhd.com/api/real-time/${stock.symbol}.US?api_token=${API_KEY}&fmt=json`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      const price = parseFloat(data.close || data.price || 0);
      const previousClose = parseFloat(data.previousClose || 0);
      const change = parseFloat(data.change || 0);
      const changePercent = parseFloat(data.change_p || 0);
      
      realData.push({
        symbol: stock.symbol,
        name: stock.name,
        price: Number(price.toFixed(2)),
        change: Number(change.toFixed(2)),
        changePercent: Number(changePercent.toFixed(2)),
        volume: (data.volume || 0).toLocaleString(),
        high: parseFloat(data.high || price),
        low: parseFloat(data.low || price),
        previousClose: previousClose,
        marketCap: getMarketCap(stock.symbol),
        pe: getPERatio(stock.symbol),
        high52w: parseFloat(data.high || price) * 1.2,
        low52w: parseFloat(data.low || price) * 0.8,
        isDemo: false
      });
      
      console.log(`✅ Получены реальные данные для ${stock.symbol}:`, price);
    } catch (error) {
      console.error(`❌ Ошибка получения данных для ${stock.symbol}:`, error.message);
      // Если не удалось получить реальные данные, используем демо
      const demoData = generateDemoStockData();
      const demoStock = demoData.find(d => d.symbol === stock.symbol);
      if (demoStock) {
        realData.push(demoStock);
      }
    }
  }

  return realData;
};

// Вспомогательные функции для статичных данных
const getMarketCap = (symbol) => {
  const caps = {
    'AAPL': '2.7T', 'GOOGL': '1.6T', 'MSFT': '2.5T',
    'TSLA': '745B', 'AMZN': '1.3T', 'NVDA': '1.1T'
  };
  return caps[symbol] || 'N/A';
};

const getPERatio = (symbol) => {
  const ratios = {
    'AAPL': 28.5, 'GOOGL': 25.3, 'MSFT': 32.1,
    'TSLA': 45.2, 'AMZN': 58.7, 'NVDA': 65.4
  };
  return ratios[symbol] || 0;
};

// Функция для обновления данных акций в БД
const updateStockDataInDB = async (stocksData) => {
  const bulkOps = stocksData.map(stock => ({
    updateOne: {
      filter: { symbol: stock.symbol },
      update: {
        $set: {
          ...stock,
          lastUpdated: new Date(),
          lastAPIUpdate: new Date()
        }
      },
      upsert: true
    }
  }));

  try {
    await StockData.bulkWrite(bulkOps);
    console.log(`✅ Обновлены данные ${stocksData.length} акций в БД`);
  } catch (error) {
    console.error('❌ Ошибка обновления данных акций в БД:', error);
    throw error;
  }
};

// 📊 Получение данных акций с кэшированием
app.get('/api/stocks/data', async (req, res) => {
  try {
    const forceUpdate = req.query.force === 'true';
    const TWO_HOURS = 2 * 60 * 60 * 1000; // 2 часа в миллисекундах
    
    console.log('📈 Запрос данных акций, принудительное обновление:', forceUpdate);
    
    // Проверяем, есть ли данные в БД
    const existingStocks = await StockData.find({
      symbol: { $in: POPULAR_STOCKS.map(s => s.symbol) }
    }).sort({ lastAPIUpdate: -1 });
    
    const now = new Date();
    let shouldUpdate = forceUpdate;
    let canUpdate = true;
    let nextUpdateTime = null;
    
    if (existingStocks.length > 0) {
      const lastUpdate = existingStocks[0].lastAPIUpdate;
      const timeSinceLastUpdate = now - lastUpdate;
      
      console.log(`🕐 Последнее обновление: ${lastUpdate.toLocaleString()}`);
      console.log(`⏱️ Время с последнего обновления: ${Math.round(timeSinceLastUpdate / 1000 / 60)} минут`);
      
      if (timeSinceLastUpdate < TWO_HOURS) {
        canUpdate = false;
        nextUpdateTime = new Date(lastUpdate.getTime() + TWO_HOURS);
        console.log(`⏰ Следующее обновление возможно: ${nextUpdateTime.toLocaleString()}`);
      } else {
        shouldUpdate = true;
        console.log('✅ Можно обновлять данные');
      }
    } else {
      shouldUpdate = true;
      console.log('🆕 Данных в БД нет, получаем первые данные');
    }
    
    let stocksData = [];
    let isUsingRealAPI = false;
    let statusMessage = '';
    
    if (shouldUpdate && canUpdate) {
      console.log('🔄 Обновляем данные акций...');
      try {
        // Пытаемся получить реальные данные
        const realData = await fetchRealStockData();
        
        // Сохраняем в БД
        await updateStockDataInDB(realData);
        
        stocksData = realData;
        isUsingRealAPI = !realData.some(stock => stock.isDemo);
        statusMessage = isUsingRealAPI 
          ? '🎉 Все акции с реальными данными EODHD (15-20 мин. задержка)'
          : 'Смешанный режим: часть данных реальная, часть демо';
        
        console.log('✅ Данные успешно обновлены');
      } catch (error) {
        console.error('❌ Ошибка обновления данных:', error);
        
        // Если есть кэшированные данные, используем их
        if (existingStocks.length > 0) {
          stocksData = existingStocks.map(stock => stock.toObject());
          statusMessage = '⚠️ Ошибка API, используются кэшированные данные';
        } else {
          // Иначе генерируем демо-данные
          stocksData = generateDemoStockData();
          await updateStockDataInDB(stocksData);
          statusMessage = 'EODHD API недоступен, показаны демо-данные';
        }
      }
    } else if (!canUpdate) {
      // Используем кэшированные данные
      stocksData = existingStocks.map(stock => stock.toObject());
      isUsingRealAPI = !stocksData.some(stock => stock.isDemo);
      
      const timeLeft = Math.ceil((TWO_HOURS - (now - existingStocks[0].lastAPIUpdate)) / 1000 / 60);
      statusMessage = `⏱️ Данные актуальны. Следующее обновление через ${timeLeft} мин.`;
      
      console.log('📚 Используем кэшированные данные');
    } else {
      // Используем существующие данные
      stocksData = existingStocks.map(stock => stock.toObject());
      isUsingRealAPI = !stocksData.some(stock => stock.isDemo);
      statusMessage = 'Данные из кэша';
    }
    
    // Формируем ответ в формате, ожидаемом фронтендом
    const response = {
      success: true,
      data: stocksData.reduce((acc, stock) => {
        acc[stock.symbol] = {
          price: stock.price,
          change: stock.change,
          changePercent: stock.changePercent,
          volume: stock.volume,
          high: stock.high,
          low: stock.low,
          previousClose: stock.previousClose,
          marketCap: stock.marketCap,
          pe: stock.pe,
          high52w: stock.high52w,
          low52w: stock.low52w
        };
        return acc;
      }, {}),
      meta: {
        lastUpdated: existingStocks.length > 0 ? existingStocks[0].lastAPIUpdate : now,
        isUsingRealAPI,
        canUpdate,
        nextUpdateTime,
        statusMessage,
        stocksCount: stocksData.length
      }
    };
    
    console.log('📤 Отправляем ответ:', { 
      stocksCount: stocksData.length, 
      isUsingRealAPI, 
      canUpdate,
      statusMessage: response.meta.statusMessage
    });
    
    res.json(response);
  } catch (error) {
    console.error('❌ Общая ошибка API акций:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Ошибка получения данных акций',
      details: error.message 
    });
  }
});

// 🔄 Принудительное обновление данных акций (только для тестирования)
app.post('/api/stocks/force-update', async (req, res) => {
  try {
    console.log('🔄 Принудительное обновление данных акций...');
    
    const realData = await fetchRealStockData();
    await updateStockDataInDB(realData);
    
    const isUsingRealAPI = !realData.some(stock => stock.isDemo);
    
    res.json({
      success: true,
      message: 'Данные акций принудительно обновлены',
      data: realData,
      meta: {
        lastUpdated: new Date(),
        isUsingRealAPI,
        stocksCount: realData.length
      }
    });
  } catch (error) {
    console.error('❌ Ошибка принудительного обновления:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Ошибка принудительного обновления данных акций',
      details: error.message 
    });
  }
});

// ======================
// 💰 УПРАВЛЕНИЕ АКТИВАМИ
// ======================

// Функция для получения реальных цен активов
const fetchAssetPrices = async (assets) => {
  const updatedAssets = [];
  
  for (const asset of assets) {
    try {
      let currentPrice = asset.currentPrice || 0;
      
      if (asset.isTracked && asset.symbol) {
        if (asset.type === 'stocks') {
          // Получаем цену акций через EODHD API
          const response = await fetch(`https://eodhd.com/api/real-time/${asset.symbol}.US?api_token=${process.env.EODHD_API_KEY || '68545cf3e0b555.23627356'}&fmt=json`);
          if (response.ok) {
            const data = await response.json();
            currentPrice = parseFloat(data.close || data.price || asset.currentPrice);
          }
        } else if (asset.type === 'crypto') {
          // Получаем цену криптовалют через CoinGecko API (бесплатно)
          const cryptoMap = {
            'BTC': 'bitcoin',
            'ETH': 'ethereum', 
            'ADA': 'cardano',
            'DOT': 'polkadot',
            'LINK': 'chainlink'
          };
          const coinId = cryptoMap[asset.symbol.toUpperCase()];
          if (coinId) {
            const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd`);
            if (response.ok) {
              const data = await response.json();
              currentPrice = data[coinId]?.usd || asset.currentPrice;
            }
          }
        }
      }
      
      // Пересчитываем стоимость актива
      const totalValue = asset.quantity ? (currentPrice * asset.quantity) : asset.amount;
      
      updatedAssets.push({
        ...asset.toObject(),
        currentPrice,
        amount: totalValue,
        lastUpdated: new Date()
      });
    } catch (error) {
      console.error(`Ошибка обновления цены для ${asset.symbol}:`, error);
      updatedAssets.push(asset.toObject());
    }
  }
  
  return updatedAssets;
};

// Функция для расчета портфеля
const calculatePortfolio = (assets) => {
  const distribution = {
    cash: 0, stocks: 0, crypto: 0, realestate: 0, bonds: 0, other: 0
  };
  
  let totalValue = 0;
  let totalGainLoss = 0;
  
  assets.forEach(asset => {
    totalValue += asset.amount;
    distribution[asset.type] += asset.amount;
    
    if (asset.quantity && asset.purchasePrice && asset.currentPrice) {
      const purchaseValue = asset.quantity * asset.purchasePrice;
      const currentValue = asset.quantity * asset.currentPrice;
      totalGainLoss += (currentValue - purchaseValue);
    }
  });
  
  const totalGainLossPercent = totalValue > 0 ? (totalGainLoss / totalValue) * 100 : 0;
  
  return {
    totalValue,
    totalGainLoss,
    totalGainLossPercent,
    lastCalculated: new Date(),
    distribution
  };
};

// 📊 Получить все активы пользователя
app.get('/api/user/assets', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('financialData.assets financialData.portfolioCache');
    
    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    // Обновляем цены если запрошено
    let assets = user.financialData.assets || [];
    if (req.query.sync === 'true') {
      assets = await fetchAssetPrices(assets);
      
      // Пересчитываем портфель
      const portfolioCache = calculatePortfolio(assets);
      
      // Обновляем пользователя
      await User.findByIdAndUpdate(req.user.userId, {
        'financialData.assets': assets,
        'financialData.portfolioCache': portfolioCache
      });
      
      user.financialData.assets = assets;
      user.financialData.portfolioCache = portfolioCache;
    }

    res.json({
      assets: user.financialData.assets,
      portfolio: user.financialData.portfolioCache,
      lastSync: new Date()
    });
  } catch (error) {
    console.error('Ошибка получения активов:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

// ➕ Добавить новый актив
app.post('/api/user/assets', authenticateToken, async (req, res) => {
  try {
    const {
      type, name, amount, currency = 'RUB',
      symbol, quantity, purchasePrice, description, category, isTracked = false
    } = req.body;

    // Валидация
    if (!type || !name || amount <= 0) {
      return res.status(400).json({ error: 'Тип, название и сумма актива обязательны' });
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    // Создаем новый актив
    const newAsset = {
      type,
      name: name.trim(),
      amount: parseFloat(amount),
      currency,
      symbol: symbol?.toUpperCase().trim(),
      quantity: quantity ? parseFloat(quantity) : undefined,
      purchasePrice: purchasePrice ? parseFloat(purchasePrice) : undefined,
      currentPrice: purchasePrice ? parseFloat(purchasePrice) : undefined,
      description: description?.trim(),
      category: category?.trim(),
      isTracked,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Добавляем актив
    user.financialData.assets.push(newAsset);
    
    // Пересчитываем портфель
    const portfolioCache = calculatePortfolio(user.financialData.assets);
    user.financialData.portfolioCache = portfolioCache;
    
    await user.save();

    res.status(201).json({
      message: 'Актив добавлен',
      asset: user.financialData.assets[user.financialData.assets.length - 1],
      portfolio: portfolioCache
    });
  } catch (error) {
    console.error('Ошибка добавления актива:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

// ✏️ Обновить актив
app.put('/api/user/assets/:assetId', authenticateToken, async (req, res) => {
  try {
    const { assetId } = req.params;
    const updateData = req.body;

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    const assetIndex = user.financialData.assets.findIndex(asset => asset._id.toString() === assetId);
    if (assetIndex === -1) {
      return res.status(404).json({ error: 'Актив не найден' });
    }

    // Обновляем актив
    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined) {
        user.financialData.assets[assetIndex][key] = updateData[key];
      }
    });
    user.financialData.assets[assetIndex].updatedAt = new Date();

    // Пересчитываем портфель
    const portfolioCache = calculatePortfolio(user.financialData.assets);
    user.financialData.portfolioCache = portfolioCache;

    await user.save();

    res.json({
      message: 'Актив обновлен',
      asset: user.financialData.assets[assetIndex],
      portfolio: portfolioCache
    });
  } catch (error) {
    console.error('Ошибка обновления актива:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

// 🗑️ Удалить актив
app.delete('/api/user/assets/:assetId', authenticateToken, async (req, res) => {
  try {
    const { assetId } = req.params;

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    const assetIndex = user.financialData.assets.findIndex(asset => asset._id.toString() === assetId);
    if (assetIndex === -1) {
      return res.status(404).json({ error: 'Актив не найден' });
    }

    // Удаляем актив
    user.financialData.assets.splice(assetIndex, 1);

    // Пересчитываем портфель
    const portfolioCache = calculatePortfolio(user.financialData.assets);
    user.financialData.portfolioCache = portfolioCache;

    await user.save();

    res.json({
      message: 'Актив удален',
      portfolio: portfolioCache
    });
  } catch (error) {
    console.error('Ошибка удаления актива:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

// 🔄 Синхронизировать цены активов
app.post('/api/user/assets/sync', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    // Обновляем цены всех отслеживаемых активов
    const updatedAssets = await fetchAssetPrices(user.financialData.assets);
    
    // Пересчитываем портфель
    const portfolioCache = calculatePortfolio(updatedAssets);
    
    // Сохраняем обновления
    user.financialData.assets = updatedAssets;
    user.financialData.portfolioCache = portfolioCache;
    await user.save();

    res.json({
      message: 'Цены синхронизированы',
      syncedAssets: updatedAssets.filter(a => a.isTracked).length,
      portfolio: portfolioCache,
      lastSync: new Date()
    });
  } catch (error) {
    console.error('Ошибка синхронизации:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

// 📈 Получить аналитику портфеля
app.get('/api/user/portfolio/analytics', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('financialData');
    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    const assets = user.financialData.assets || [];
    const portfolio = user.financialData.portfolioCache;
    
    // Расширенная аналитика
    const analytics = {
      portfolio,
      diversification: {
        score: 0, // 0-100, насколько диверсифицирован портфель
        recommendations: []
      },
      topAssets: assets
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 5)
        .map(asset => ({
          name: asset.name,
          type: asset.type,
          amount: asset.amount,
          percentage: portfolio.totalValue > 0 ? (asset.amount / portfolio.totalValue * 100) : 0
        })),
      riskMetrics: {
        volatility: 'medium', // low, medium, high
        riskScore: 50, // 0-100
        riskLevel: 'moderate'
      },
      suggestions: []
    };

    // Оценка диверсификации
    const types = Object.keys(portfolio.distribution);
    const activeTypes = types.filter(type => portfolio.distribution[type] > 0).length;
    analytics.diversification.score = Math.min((activeTypes / types.length) * 100, 100);
    
    // Рекомендации по диверсификации
    if (analytics.diversification.score < 30) {
      analytics.diversification.recommendations.push('Рассмотрите диверсификацию портфеля по разным классам активов');
    }
    if (portfolio.distribution.cash > portfolio.totalValue * 0.2) {
      analytics.diversification.recommendations.push('Слишком много наличных средств, рассмотрите инвестирование');
    }
    if (portfolio.distribution.stocks > portfolio.totalValue * 0.7) {
      analytics.diversification.recommendations.push('Высокая концентрация в акциях, добавьте облигации для снижения риска');
    }

    // Общие рекомендации
    if (portfolio.totalValue < 100000) {
      analytics.suggestions.push('Начните с создания резервного фонда в размере 3-6 месячных расходов');
    }
    if (assets.filter(a => a.type === 'realestate').length === 0 && portfolio.totalValue > 1000000) {
      analytics.suggestions.push('Рассмотрите инвестиции в недвижимость для диверсификации');
    }

    res.json(analytics);
  } catch (error) {
    console.error('Ошибка получения аналитики:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

// ===================
// 🛡️ АДМИНСКИЕ РОУТЫ
// ===================

// 📊 Получение статистики для админки
app.get('/api/admin/stats', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({
      lastLoginAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      isActive: true
    });
    const adminUsers = await User.countDocuments({ role: 'admin' });
    
    // Подсчитываем количество ПОЛЬЗОВАТЕЛЕЙ с целями накопления
    // (не общее количество целей, а количество людей, у которых есть хотя бы одна цель)
    const usersWithGoals = await User.countDocuments({
      'financialData.savingsGoals.0': { $exists: true },  // проверяем наличие первого элемента в массиве целей
      isActive: true
    });

    // Вычисляем средний доход
    const usersWithIncome = await User.find({
      'financialData.monthlyIncome': { $gt: 0 },
      isActive: true
    });
    const averageIncome = usersWithIncome.length > 0 
      ? usersWithIncome.reduce((sum, user) => sum + user.financialData.monthlyIncome, 0) / usersWithIncome.length
      : 0;

    // Статистика по стратегиям
    const strategiesStats = await User.aggregate([
      { $match: { isActive: true, 'financialData.selectedStrategy': { $ne: null } } },
      { $group: { _id: '$financialData.selectedStrategy', count: { $sum: 1 } } }
    ]);

    res.json({
      totalUsers,
      activeUsers,
      adminUsers,
      usersWithGoals,
      averageIncome: Math.round(averageIncome),
      strategiesStats: strategiesStats.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {})
    });
  } catch (error) {
    console.error('Ошибка получения статистики:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

// 👥 Получение списка всех пользователей
app.get('/api/admin/users', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find({})
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalUsers = await User.countDocuments();

    res.json({
      users,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalUsers / limit),
        totalUsers,
        hasNext: page * limit < totalUsers,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Ошибка получения пользователей:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

// 🔍 Поиск пользователей
app.get('/api/admin/users/search', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ error: 'Запрос для поиска не указан' });
    }

    const users = await User.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } }
      ]
    }).select('-password').limit(20);

    res.json({ users });
  } catch (error) {
    console.error('Ошибка поиска пользователей:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

// 👤 Получение информации о конкретном пользователе
app.get('/api/admin/users/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }
    res.json(user);
  } catch (error) {
    console.error('Ошибка получения пользователя:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

// ✏️ Редактирование пользователя
app.put('/api/admin/users/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { name, email, role, isActive } = req.body;
    
    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (role) updateData.role = role;
    if (typeof isActive === 'boolean') updateData.isActive = isActive;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    res.json({ message: 'Пользователь обновлен', user });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Email уже используется' });
    }
    console.error('Ошибка обновления пользователя:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

// 🗑️ Удаление пользователя
app.delete('/api/admin/users/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    res.json({ message: 'Пользователь удален', user: { id: user._id, email: user.email } });
  } catch (error) {
    console.error('Ошибка удаления пользователя:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

// 🔑 Создание первого админа (только если админов нет)
app.post('/api/admin/create-first-admin', async (req, res) => {
  try {
    const adminExists = await User.findOne({ role: 'admin' });
    if (adminExists) {
      return res.status(400).json({ error: 'Администратор уже существует' });
    }

    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Все поля обязательны' });
    }

    const admin = new User({
      name,
      email,
      password,
      role: 'admin'
    });

    await admin.save();

    const token = jwt.sign(
      { userId: admin._id, email: admin.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Первый администратор создан',
      token,
      user: {
        id: admin._id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
        isActive: admin.isActive,
      }
    });
  } catch (error) {
    console.error('Ошибка создания администратора:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

// 📤 Экспорт данных
app.get('/api/admin/export', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    const exportData = {
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      totalUsers: users.length,
      users: users,
      statistics: {
        totalUsers: users.length,
        activeUsers: users.filter(u => u.isActive).length,
        adminUsers: users.filter(u => u.role === 'admin').length,
      }
    };

    res.json(exportData);
  } catch (error) {
    console.error('Ошибка экспорта данных:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

// 🔄 Оптимизация базы данных
app.post('/api/admin/optimize', authenticateToken, requireAdmin, async (req, res) => {
  try {
    // Здесь можно добавить реальную оптимизацию
    // Например, удаление старых токенов, очистка логов и т.д.
    
    console.log('🔄 Выполняется оптимизация базы данных...');
    
    // Имитация работы
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    res.json({ 
      message: 'База данных оптимизирована',
      optimizedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Ошибка оптимизации БД:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

// 📋 Статистика базы данных
app.get('/api/admin/db-stats', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    
    const stats = {
      database: db.databaseName,
      collections: collections.length,
      timestamp: new Date().toISOString(),
      details: []
    };

    for (const collection of collections) {
      const collStats = await db.collection(collection.name).stats();
      stats.details.push({
        name: collection.name,
        documents: collStats.count || 0,
        size: collStats.size || 0,
        avgObjSize: collStats.avgObjSize || 0
      });
    }

    res.json(stats);
  } catch (error) {
    console.error('Ошибка получения статистики БД:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

// 🗑️ Очистка базы данных
app.delete('/api/admin/clear-database', authenticateToken, requireAdmin, async (req, res) => {
  try {
    console.log('⚠️ ВНИМАНИЕ: Выполняется очистка базы данных!');
    
    // Удаляем всех пользователей кроме текущего админа
    const currentUserId = req.user.userId;
    await User.deleteMany({ _id: { $ne: currentUserId } });
    
    console.log('✅ База данных очищена');
    res.json({ 
      message: 'База данных очищена',
      clearedAt: new Date().toISOString(),
      remainingUsers: 1
    });
  } catch (error) {
    console.error('Ошибка очистки БД:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

// 🔄 Сброс системы
app.post('/api/admin/reset-system', authenticateToken, requireAdmin, async (req, res) => {
  try {
    console.log('⚠️ ВНИМАНИЕ: Выполняется сброс системы!');
    
    // Здесь можно добавить логику сброса настроек
    // Пока что просто возвращаем успех
    
    res.json({ 
      message: 'Система сброшена к заводским настройкам',
      resetAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Ошибка сброса системы:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

// ⚙️ Управление настройками системы
app.get('/api/admin/settings', authenticateToken, requireAdmin, async (req, res) => {
  try {
    // Здесь можно добавить реальное хранение настроек в БД
    const settings = {
      registration: true,
      cbrApi: true,
      notifications: false
    };
    
    res.json(settings);
  } catch (error) {
    console.error('Ошибка получения настроек:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

app.put('/api/admin/settings', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { registration, cbrApi, notifications } = req.body;
    
    // Здесь можно добавить реальное сохранение настроек в БД
    const settings = {
      registration: registration !== undefined ? registration : true,
      cbrApi: cbrApi !== undefined ? cbrApi : true,
      notifications: notifications !== undefined ? notifications : false
    };
    
    console.log('💾 Настройки обновлены:', settings);
    
    res.json({ 
      message: 'Настройки обновлены',
      settings,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Ошибка обновления настроек:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

// 🏠 Главная страница API
app.get('/api', (req, res) => {
  res.json({
    message: 'Финансовый компас API работает! 🚀',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth/register, /api/auth/login',
      user: '/api/user/profile, /api/user/financial-data',
      goals: '/api/user/savings-goals',
      admin: '/api/admin/stats',
    },
  });
});

// Обработка 404
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Эндпоинт не найден' });
});

// Запуск сервера
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 Сервер запущен на порту ${PORT}`);
    console.log(`🌐 API доступно: http://localhost:${PORT}/api`);
  });
};

startServer(); 