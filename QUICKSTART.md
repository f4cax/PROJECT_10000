# 🚀 Быстрый старт - День 1

## Что нужно сделать прямо сейчас

### 1. Установка Node.js (если еще не установлен)
Скачайте и установите Node.js с официального сайта: https://nodejs.org
Версия должна быть 16 или выше.

### 2. Создание проекта React

```bash
# В терминале PowerShell:
npx create-react-app financeguide
cd financeguide
```

### 3. Установка дополнительных зависимостей

```bash
npm install react-router-dom chart.js react-chartjs-2 axios
npm install -D tailwindcss postcss autoprefixer
```

### 4. Настройка Tailwind CSS

```bash
npx tailwindcss init -p
```

### 5. Структура проекта

Создайте следующие папки в `src/`:
```
src/
├── components/
│   ├── common/
│   ├── charts/
│   └── forms/
├── pages/
├── services/
├── utils/
└── styles/
```

### 6. Базовые файлы для работы

Используйте файлы из текущего проекта:
- `package.json` - зависимости
- `tailwind.config.js` - настройки Tailwind
- `public/manifest.json` - PWA настройки

### 7. Первая задача - создать навигацию

Создайте компонент `Navbar.js`:

```jsx
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold text-primary-500">ФинансГид</h1>
        <div className="space-x-4">
          <Link to="/" className="hover:text-primary-300">Главная</Link>
          <Link to="/stocks" className="hover:text-primary-300">Акции</Link>
          <Link to="/cbr" className="hover:text-primary-300">Курс ЦБ</Link>
          <Link to="/assets" className="hover:text-primary-300">Активы</Link>
          <Link to="/tips" className="hover:text-primary-300">Советы</Link>
          <Link to="/about" className="hover:text-primary-300">О нас</Link>
        </div>
      </div>
    </nav>
  );
}
```

### 8. Настройка роутинга

В `App.js`:

```jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
// ... другие импорты

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          {/* Добавьте другие маршруты */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
```

### 9. Создайте файл переменных окружения

Создайте `.env` в корне проекта:

```env
REACT_APP_CBR_API_URL=https://www.cbr-xml-daily.ru/daily_json.js
REACT_APP_OPENAI_API_KEY=your_key_here
```

## ⚡ Результат первого дня

После выполнения всех шагов у вас должно быть:
- ✅ Настроенный React проект
- ✅ Навигация между страницами  
- ✅ Настроенный Tailwind CSS
- ✅ Базовая структура проекта
- ✅ PWA настройки

## 🎯 Следующий шаг

Завтра (День 2) начинайте с создания главной страницы и формы ввода дохода.

**Удачи! 💪** 