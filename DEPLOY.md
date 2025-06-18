# 🚀 Деплой ФинансГид на удалённый хостинг

## 🔥 Рекомендуемые платформы

### 1. Vercel (Рекомендуется) ⭐
- **Бесплатно** для личных проектов
- **Автоматический деплой** из GitHub
- **Отличная поддержка React**
- **CDN по всему миру**

### 2. Netlify
- Бесплатная альтернатива
- Простой drag-and-drop деплой

### 3. GitHub Pages
- Бесплатно для публичных репозиториев
- Интеграция с GitHub Actions

---

## 🎯 Деплой на Vercel (Пошагово)

### Шаг 1: Подготовка проекта

```bash
# Убедитесь что проект собирается локально
npm install
npm run build

# Проверьте что сборка прошла успешно
# Должна появиться папка build/
```

### Шаг 2: Создание Git репозитория

```bash
# Инициализация Git (если ещё не сделано)
git init

# Добавление файлов
git add .
git commit -m "Initial commit: ФинансГид v1.0"

# Создайте репозиторий на GitHub
# https://github.com/new

# Привязка к GitHub
git remote add origin https://github.com/ВАШ_USERNAME/финансгид.git
git branch -M main
git push -u origin main
```

### Шаг 3: Деплой на Vercel

#### Способ 1: Через веб-интерфейс (Проще)

1. Идите на https://vercel.com
2. Войдите через GitHub
3. Нажмите **"New Project"**
4. Выберите ваш репозиторий `финансгид`
5. Настройте параметры:
   - **Framework Preset**: Create React App
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
6. Добавьте переменные окружения:
   - `REACT_APP_CBR_API_URL` = `https://www.cbr-xml-daily.ru/daily_json.js`
   - `REACT_APP_OPENAI_API_KEY` = `your_openai_key`
7. Нажмите **"Deploy"**

#### Способ 2: Через CLI

```bash
# Установка Vercel CLI
npm install -g vercel

# Логин в Vercel
vercel login

# Деплой проекта
vercel

# Следуйте инструкциям:
# - Set up and deploy? Yes
# - Which scope? Ваш username
# - Link to existing project? No
# - Project name: financeguide
# - Directory: ./
# - Override settings? No

# После успешного деплоя получите URL
```

### Шаг 4: Настройка домена (Опционально)

1. В панели Vercel перейдите в **Settings → Domains**
2. Добавьте свой домен
3. Настройте DNS записи согласно инструкциям

---

## 🔧 Переменные окружения

В панели Vercel добавьте следующие переменные:

```env
# Обязательные
REACT_APP_CBR_API_URL=https://www.cbr-xml-daily.ru/daily_json.js

# Для ИИ-помощника (получите на https://platform.openai.com)
REACT_APP_OPENAI_API_KEY=sk-ваш-ключ-здесь

# Дополнительные (опционально)
REACT_APP_DEEPSEEK_API_KEY=ваш-deepseek-ключ
```

---

## 📱 Настройка PWA для мобильных

После деплоя:

1. Откройте сайт на телефоне
2. В Chrome нажмите **меню → "Добавить на главный экран"**
3. В Safari нажмите **Поделиться → "На экран «Домой»"**

---

## 🔄 Автоматический деплой

После настройки каждый push в GitHub будет автоматически деплоить изменения:

```bash
# Внесите изменения в код
git add .
git commit -m "Добавил новые функции"
git push

# Vercel автоматически сделает новый деплой
```

---

## 🛠️ Альтернативные платформы

### Netlify

```bash
# Сборка проекта
npm run build

# Перетащите папку build/ на https://app.netlify.com/drop
# Или подключите GitHub репозиторий
```

### GitHub Pages

```bash
# Установка gh-pages
npm install --save-dev gh-pages

# Добавьте в package.json
"homepage": "https://ВАШ_USERNAME.github.io/финансгид",
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d build"
}

# Деплой
npm run deploy
```

### Railway

```bash
# Установка Railway CLI
npm install -g @railway/cli

# Логин
railway login

# Деплой
railway deploy
```

---

## 🔍 Проверка работоспособности

После деплоя проверьте:

- ✅ Сайт открывается
- ✅ Навигация работает
- ✅ Форма ввода дохода функционирует
- ✅ Диаграммы отображаются
- ✅ PWA устанавливается на мобильный
- ✅ Все стили подгружаются

---

## 🚨 Решение проблем

### Ошибка сборки

```bash
# Очистка кеша
npm ci
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Проблемы с роутингом

Добавьте файл `public/_redirects` (для Netlify):

```
/*    /index.html   200
```

Или настройте в `vercel.json` (уже настроено в проекте).

### Ошибки CORS

Добавьте в `public/index.html`:
```html
<meta http-equiv="Content-Security-Policy" content="default-src 'self' https://www.cbr-xml-daily.ru https://api.openai.com;">
```

---

## 📊 Мониторинг и аналитика

### Vercel Analytics

1. В панели Vercel включите **Analytics**
2. Получите данные о посетителях, производительности

### Google Analytics (Опционально)

```bash
npm install react-ga4

# Добавьте в src/index.js
import ReactGA from 'react-ga4';
ReactGA.initialize('G-ВАШ-TRACKING-ID');
```

---

## 🔒 Безопасность

1. **Не коммитьте API ключи** в Git
2. Используйте переменные окружения
3. Включите HTTPS (автоматически в Vercel)
4. Регулярно обновляйте зависимости

---

## 💰 Стоимость

### Vercel
- **Hobby план**: Бесплатно
  - 100GB трафика
  - Безлимитные запросы
  - Автоматические деплои

- **Pro план**: $20/месяц
  - 1TB трафика
  - Приоритетная поддержка

### Домен (опционально)
- `.ru` домен: ~500-1000₽/год
- `.com` домен: ~1000-1500₽/год

---

## 🎉 Готово!

После выполнения всех шагов ваше приложение будет доступно онлайн 24/7!

**Примерная ссылка**: https://financeguide.vercel.app

### Поделитесь результатом:
- 📱 Установите PWA на телефон
- 🔗 Поделитесь ссылкой с друзьями
- ⭐ Поставьте звезду на GitHub

**Удачного деплоя! 🚀** 