// Система аналитики для отслеживания производительности
class PerformanceAnalytics {
  constructor() {
    this.metrics = {
      pageViews: 0,
      activeUsers: 0,
      loadTimes: [],
      errors: [],
      features: {}
    };

    this.startTime = performance.now();
    this.initializeTracking();
  }

  // Инициализация отслеживания
  initializeTracking() {
    // Отслеживание времени загрузки страницы
    window.addEventListener('load', () => {
      const loadTime = performance.now() - this.startTime;
      this.trackLoadTime(loadTime);
    });

    // Отслеживание ошибок
    window.addEventListener('error', (error) => {
      this.trackError(error);
    });

    // Отслеживание активности пользователя
    this.trackUserActivity();
  }

  // Отслеживание просмотров страниц
  trackPageView(page) {
    this.metrics.pageViews++;
    console.log(`📊 Page view: ${page} (Total: ${this.metrics.pageViews})`);
    
    // Сохранение в localStorage для персистентности
    this.saveMetrics();
  }

  // Отслеживание времени загрузки
  trackLoadTime(time) {
    this.metrics.loadTimes.push(time);
    console.log(`⚡ Load time: ${time.toFixed(2)}ms`);
    
    // Предупреждение если загрузка медленная
    if (time > 3000) {
      console.warn('🐌 Slow load time detected!');
    }
  }

  // Отслеживание ошибок
  trackError(error) {
    const errorInfo = {
      message: error.message,
      stack: error.error?.stack,
      timestamp: new Date().toISOString()
    };
    
    this.metrics.errors.push(errorInfo);
    console.error('❌ Error tracked:', errorInfo);
  }

  // Отслеживание использования функций
  trackFeatureUsage(feature) {
    if (!this.metrics.features[feature]) {
      this.metrics.features[feature] = 0;
    }
    this.metrics.features[feature]++;
    
    console.log(`🎯 Feature used: ${feature} (${this.metrics.features[feature]} times)`);
    this.saveMetrics();
  }

  // Отслеживание активности пользователей
  trackUserActivity() {
    let isActive = true;
    let inactiveTime = 0;

    // Сброс таймера при активности
    const resetTimer = () => {
      isActive = true;
      inactiveTime = 0;
    };

    // События активности
    ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(event => {
      window.addEventListener(event, resetTimer, true);
    });

    // Проверка активности каждую секунду
    setInterval(() => {
      if (isActive) {
        inactiveTime = 0;
        isActive = false;
      } else {
        inactiveTime++;
        
        // Пользователь неактивен более 30 секунд
        if (inactiveTime === 30) {
          console.log('😴 User became inactive');
        }
      }
    }, 1000);
  }

  // Получение статистики производительности
  getPerformanceStats() {
    const avgLoadTime = this.metrics.loadTimes.length > 0 
      ? this.metrics.loadTimes.reduce((a, b) => a + b) / this.metrics.loadTimes.length 
      : 0;

    return {
      totalPageViews: this.metrics.pageViews,
      averageLoadTime: avgLoadTime.toFixed(2) + 'ms',
      totalErrors: this.metrics.errors.length,
      mostUsedFeatures: Object.entries(this.metrics.features)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5),
      sessionDuration: ((performance.now() - this.startTime) / 1000 / 60).toFixed(1) + ' minutes'
    };
  }

  // Сохранение метрик в localStorage
  saveMetrics() {
    try {
      localStorage.setItem('financial-app-metrics', JSON.stringify(this.metrics));
    } catch (error) {
      console.warn('Could not save metrics to localStorage:', error);
    }
  }

  // Загрузка метрик из localStorage
  loadMetrics() {
    try {
      const saved = localStorage.getItem('financial-app-metrics');
      if (saved) {
        this.metrics = { ...this.metrics, ...JSON.parse(saved) };
      }
    } catch (error) {
      console.warn('Could not load metrics from localStorage:', error);
    }
  }

  // Отправка метрик на сервер (для будущего использования)
  sendMetricsToServer() {
    const stats = this.getPerformanceStats();
    
    // Здесь можно добавить отправку на сервер аналитики
    console.log('📈 Performance Stats:', stats);
    
    return stats;
  }
}

// Создание глобального экземпляра аналитики
const analytics = new PerformanceAnalytics();

// Экспорт функций для использования в компонентах
export const trackPageView = (page) => analytics.trackPageView(page);
export const trackFeatureUsage = (feature) => analytics.trackFeatureUsage(feature);
export const getPerformanceStats = () => analytics.getPerformanceStats();
export const sendMetrics = () => analytics.sendMetricsToServer();

export default analytics; 