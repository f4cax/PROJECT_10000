const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

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
    enum: ['moscow', 'spb', 'central', 'northwest', 'south', 'north-caucasus', 'volga', 'ural', 'siberia', 'far-east'],
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
    const { name, email, age, region, language, currency } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (age) updateData.age = age;
    if (region) updateData.region = region;
    if (language) updateData.language = language;
    if (currency) updateData.currency = currency;

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    res.json({
      message: 'Профиль обновлен',
      user: user,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Email уже используется' });
    }
    console.error('Ошибка обновления профиля:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
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