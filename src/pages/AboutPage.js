import React from 'react';
import { useTranslation } from '../utils/translations';

export default function AboutPage() {
  const { t } = useTranslation();
  
  return (
    <div className="max-w-6xl mx-auto space-y-12 fade-in">
      {/* Hero секция */}
      <div className="text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 rounded-3xl"></div>
        <div className="relative px-8 py-16">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-6">
            {t('aboutProject')}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Инновационная платформа для управления личными финансами, которая делает инвестирование и планирование бюджета простым и доступным для каждого
          </p>
          <div className="flex justify-center mt-8 space-x-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">10K+</div>
              <div className="text-sm text-gray-500">Активных пользователей</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">₽2M+</div>
              <div className="text-sm text-gray-500">Средств под управлением</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">95%</div>
              <div className="text-sm text-gray-500">Довольных клиентов</div>
            </div>
          </div>
        </div>
      </div>

      {/* Наша история */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
            🚀 Наша история
          </h2>
          <div className="space-y-4 text-lg text-gray-700 dark:text-gray-300">
            <p>
              Финансовый компас родился из простой идеи: <strong>финансовая грамотность должна быть доступна каждому</strong>. 
              Мы заметили, что большинство людей избегают инвестиций из-за их кажущейся сложности.
            </p>
            <p>
              Используя проверенные методологии ведущих финансовых экспертов и современные технологии, 
              мы создали платформу, которая <strong>превращает сложные финансовые концепции в простые действия</strong>.
            </p>
            <p>
              От первого расчета бюджета до построения инвестиционного портфеля — 
              мы сопровождаем вас на каждом шаге финансового путешествия.
            </p>
          </div>
        </div>
        <div className="relative">
          <div className="bg-gradient-to-br from-blue-100 to-green-100 dark:from-blue-900/30 dark:to-green-900/30 rounded-2xl p-8 text-center">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Основано в 2024
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              С миссией демократизации финансовых знаний
            </p>
          </div>
        </div>
      </div>

      {/* Ключевые функции */}
      <div>
        <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-12">
          ⭐ Почему выбирают нас
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="card hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-3xl text-white mx-auto mb-4">
                🎯
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Персонализация</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Индивидуальные рекомендации на основе вашего дохода, целей и уровня риска
              </p>
            </div>
          </div>

          <div className="card hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-3xl text-white mx-auto mb-4">
                🔄
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Автоматизация</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Автоматический расчет бюджета, отслеживание целей и ребалансировка портфеля
              </p>
            </div>
          </div>

          <div className="card hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-3xl text-white mx-auto mb-4">
                📊
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Аналитика</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Детальная аналитика доходов, расходов и прогнозирование будущих результатов
              </p>
            </div>
          </div>

          <div className="card hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-3xl text-white mx-auto mb-4">
                🔒
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Безопасность</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Банковский уровень шифрования и локальное хранение конфиденциальных данных
              </p>
            </div>
          </div>

          <div className="card hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center text-3xl text-white mx-auto mb-4">
                📱
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Мобильность</h3>
              <p className="text-gray-600 dark:text-gray-400">
                PWA приложение - работает как нативное мобильное приложение на любом устройстве
              </p>
            </div>
          </div>

          <div className="card hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center text-3xl text-white mx-auto mb-4">
                🌍
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Глобальность</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Поддержка множества валют и интеграция с международными финансовыми рынками
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Наши принципы */}
      <div className="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 rounded-3xl p-12">
        <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-12">
          💎 Наши принципы
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-5xl mb-4">🎓</div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Образование</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Мы не просто даем рыбу — мы учим ловить. Каждое решение сопровождается объяснением
            </p>
          </div>
          <div className="text-center">
            <div className="text-5xl mb-4">🤝</div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Доверие</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Полная прозрачность алгоритмов и рекомендаций. Никаких скрытых комиссий или мотивов
            </p>
          </div>
          <div className="text-center">
            <div className="text-5xl mb-4">🚀</div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Инновации</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Постоянное развитие и внедрение новых технологий для улучшения пользовательского опыта
            </p>
          </div>
        </div>
      </div>

      {/* Технологический стек */}
      <div>
        <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-12">
          ⚡ Технологический стек
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {[
            { name: 'React', icon: '⚛️', desc: 'Frontend' },
            { name: 'Node.js', icon: '🟢', desc: 'Backend' },
            { name: 'MongoDB', icon: '🍃', desc: 'Database' },
            { name: 'Chart.js', icon: '📊', desc: 'Analytics' },
            { name: 'Tailwind', icon: '🎨', desc: 'Styling' },
            { name: 'PWA', icon: '📱', desc: 'Mobile' }
          ].map((tech, index) => (
            <div key={index} className="card text-center hover:shadow-lg transition-all duration-300">
              <div className="text-3xl mb-2">{tech.icon}</div>
              <div className="font-bold text-gray-900 dark:text-white">{tech.name}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{tech.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Команда */}
      <div className="text-center">
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
          👥 Наша команда
        </h2>
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-8">
          <div className="text-6xl mb-4">🎯</div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Мы команда энтузиастов
          </h3>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Объединяющих экспертизу в области финансов, технологий и UX-дизайна. 
            Наша цель — сделать финансовое планирование интуитивно понятным и эффективным для миллионов людей.
          </p>
        </div>
      </div>

      {/* Контакты */}
      <div className="card bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-blue-900/20 dark:via-purple-900/20 dark:to-pink-900/20 border-none">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            📞 Связаться с нами
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Есть вопросы, предложения или хотите сотрудничать? Мы всегда рады обратной связи от нашего сообщества!
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
            <a 
              href="mailto:g53705046@gmail.com" 
              className="flex items-center space-x-3 bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <span className="text-2xl">✉️</span>
              <span className="font-semibold">Написать нам</span>
            </a>
            
            <a 
              href="https://www.donationalerts.com/r/xxarnixx" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center space-x-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-4 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <span className="text-2xl">💝</span>
              <span className="font-semibold">Поддержать проект</span>
            </a>
          </div>

          <div className="mt-8 text-sm text-gray-500 dark:text-gray-400">
            <p>⏰ Отвечаем обычно в течение 24 часов</p>
            <p>🌍 Работаем для пользователей по всему миру</p>
          </div>
        </div>
      </div>
    </div>
  );
} 